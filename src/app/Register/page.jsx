// pages/register.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';  // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(''); // State for success/error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        password, // Consider hashing the password before storing in production
      });

      setMessage('Registration successful!');
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/bg2.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0"></div>
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 z-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          {message && <p className="text-center text-red-500 mb-4">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

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

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <a className="text-blue-500 hover:underline" href="/SignIn">Already have an account? Sign In</a>
          </div>
        </div>
      </div>
    </>
  );
}
