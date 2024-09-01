"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    <div className="flex items-center justify-center h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/bg2.jpg)' }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0"></div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign In</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
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
    </>
  );
}
