"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function DoctorSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Dummy credentials for testing purposes
  const dummyCredentials = {
    orthopedic: { email: "ortho@hospital.com", password: "ortho123", name: "Dr. Orthopedic", department: "Orthopedic" },
    pediatric: { email: "pediatric@hospital.com", password: "pediatric123", name: "Dr. Pediatric", department: "Pediatric" },
    ent: { email: "ent@hospital.com", password: "ent123", name: "Dr. ENT", department: "ENT" },
    cardiology: { email: "cardiology@hospital.com", password: "cardio123", name: "Dr. Cardiology", department: "Cardiology" },
    neurology: { email: "neurology@hospital.com", password: "neuro123", name: "Dr. Neruology", department: "Neurology" },
    denatal: { email: "dental@hospital.com", password: "dental123", name: "Dr. Dental", department: "Dental" },
    medicine:{email:"medicine@hosptital.com", password:"medicine123",name:"Dr. Medicine",department:"General Medicine"},
    surgery:{email:"surgery@hospital.com",password:"surgery123",name:"Dr. Surgery",department:"Surgery"},
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Dummy login check
    let isAuthenticated = false;
    let doctorData = null;

    Object.keys(dummyCredentials).forEach(key => {
      const { email, password, name, department } = dummyCredentials[key];
      if (formData.email === email && formData.password === password) {
        isAuthenticated = true;
        doctorData = { name, department, email };
      }
    });

    if (isAuthenticated) {
      localStorage.setItem('userName', doctorData.name);
      localStorage.setItem('userEmail', doctorData.email);
      localStorage.setItem('userDepartment', doctorData.department);

      setSuccessMessage(`Doctor Sign-In successful for ${doctorData.department}! Redirecting...`);

      // Redirect to the correct Doctor Dashboard path
      setTimeout(() => {
        router.push('/Doctor/Dashboard');  // Redirect to the correct path
      }, 1000);  // Delay for 1 second
    } else {
      setError('Invalid email or password.');
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
          <h2 className="text-4xl font-bold mb-6 text-center">Doctor Sign-In</h2>

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
