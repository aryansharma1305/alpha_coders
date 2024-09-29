"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import Footer from '@/components/Footer';


export default function AdminSignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Optionally save admin info to localStorage or manage session
      localStorage.setItem('userName', 'Admin'); // Save admin name or email
      localStorage.setItem('userEmail', formData.email);
      router.push('/AdminHome'); // Redirect to admin home page
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
      console.error('Sign-in error:', error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-between h-screen w-full">
      <div className="bg-blue-400 h-full w-1/2 flex justify-center items-center">
          <Image src={"/assets/admin-login.webp"} alt='image' width={450} height={450}/>
      </div>
      <div className="w-1/2 bg-white rounded-lg p-6 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-6 text-center">Admin Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
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
              className="w-full px-3 py-2 border-2 rounded"
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

        <div className="mt-6 text-center">
            <a className="text-blue-500 hover:underline" href="/SignIn">Back to Sign In</a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
