// pages/admin.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has admin privileges
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail || storedEmail !== 'admin@admin.com') {
      router.push('/AdminSignIn');
    } else {
      setUser(storedEmail);
    }
  }, [router]);

    return (
      <div className="bg-gray-100 min-h-screen w-screen flex justify-center items-center">
        <div className="bg-blue-500 p-4 top-0 fixed w-screen z-20 shadow-xl">
            <div className="">
                <h1 className="text-white text-xl font-bold">OPD System</h1>
            </div>
        </div>
        <div className="flex flex-col w-5/6 justify-center items-center pt-24">
        {/* Header */}
        <header className="bg-blue-500 text-white p-4 w-full rounded-t-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <a href="/" className="text-white hover:underline">Logout</a>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="container mx-auto p-6 bg-white rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Monitor Queue */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">Monitor Queue</h2>
              <p className="text-gray-700 mb-4">
                View and manage the current queue of patients waiting for consultation.
              </p>
              <a href="/MonitorQueue" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                View Queue
              </a>
            </div>
  
            {/* Change Wait Time */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">Change Wait Time</h2>
              <p className="text-gray-700 mb-4">
                Adjust the estimated wait time for patient consultations to improve efficiency.
              </p>
              <a href="/change-wait-time" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Adjust Time
              </a>
            </div>
  
            {/* Pharmacy Management */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">Pharmacy Management</h2>
              <p className="text-gray-700 mb-4">
                Manage pharmacy inventory, track medication stock, and update records.
              </p>
              <a href="/Pharmacy" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Manage Pharmacy
              </a>
            </div>
  
            {/* Patient Lists */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">Patient Lists</h2>
              <p className="text-gray-700 mb-4">
                Access and view lists of patients, including their appointment history and details.
              </p>
              <a href="/patient-lists" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                View Patients
              </a>
            </div>
          </div>
        </main>
        </div>
      </div>
    );
  }
  