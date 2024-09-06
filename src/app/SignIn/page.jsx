"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, getUserData } from '@/lib/firebase';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userData = await getUserData(user.uid);

      if (userData) {
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', user.email);

        setSuccessMessage('Sign in successful! Redirecting...');
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push('/');
        }, 1000); // Delay for 1 second
      } else {
        setError('User data not found.');
      }
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError('Failed to sign in. Please check your email and password.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between h-screen w-full">
        <div className="bg-blue-400 h-full w-1/2 flex justify-center items-center">
          <Image src={"/assets/signin.webp"} alt='image' width={450} height={450}/>
        </div>
        <div className="w-1/2 bg-white rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-6 text-center">Sign In To your Account</h2>

          <form onSubmit={handleSubmit} className='w-1/2'>
            <div className="mb-4">
              <label className="block text-md font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded "
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-md font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>

          {successMessage && <div className="mt-4 text-green-500 text-center">{successMessage}</div>}
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

          <div className="flex justify-between w-full px-12 pt-12">
            <a className="text-blue-500 hover:underline" href="/Register">Register Account</a>
            <a className="text-blue-500 hover:underline" href="/AdminSignIn">Admin Sign In</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
