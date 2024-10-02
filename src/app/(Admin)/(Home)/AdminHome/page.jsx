"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { HiQueueList } from "react-icons/hi2";
import { FaRegHospital } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { CiBoxes } from "react-icons/ci";
import { GiHealthNormal } from "react-icons/gi"; // Crisis management icon
import Link from 'next/link'; // Import Link from Next.js
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Footer from '@/components/Footer';

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

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    router.push('/SignIn');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex justify-center items-center w-full h-full bg-blue-400 py-12">
          <Image src={"/assets/admin.webp"} alt='image' width={450} height={450} />
          <h1 className='text-7xl font-bold'>Admin Dashboard</h1>
        </div>
        <main className="container mx-auto p-6 bg-white rounded-b-lg m-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Monitor Queue */}
            <div className="bg-white p-6 rounded-lg border-2 flex flex-col justify-center items-center text-center hover:bg-gray-100 transition">
              <HiQueueList className='text-9xl' />
              <h2 className="text-xl font-bold mb-4">Monitor Queue</h2>
              <p className="text-gray-700 mb-4">
                View and manage the current queue of patients waiting for consultation.
              </p>
              <Link href="/MonitorQueue" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                View Queue
              </Link>
            </div>

            {/* Hospital Management */}
            <div className="bg-white p-6 rounded-lg border-2 text-center flex flex-col justify-center items-center hover:bg-gray-100 transition">
              <FaRegHospital className='text-9xl' />
              <h2 className="text-xl font-bold mb-4">Hospital Management</h2>
              <p className="text-gray-700 mb-4">
                Access and view lists of hospitals, doctors, available beds, and occupancy details across all hospitals.
              </p>
              <Link href="/Hospitals" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Hospital Management
              </Link>
            </div>

            {/* Pharmacy Management */}
            <div className="bg-white p-6 rounded-lg border-2 text-center flex flex-col justify-center items-center hover:bg-gray-100 transition">
              <MdOutlineInventory2 className='text-9xl' />
              <h2 className="text-xl font-bold mb-4">Pharmacy Management</h2>
              <p className="text-gray-700 mb-4">
                Manage pharmacy inventory, track medication stock, and update records.
              </p>
              <Link href="/Pharmacy" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Manage Pharmacy
              </Link>
            </div>

            {/* Crisis Management */}
            <div className="bg-white p-6 rounded-lg border-2 text-center flex flex-col justify-center items-center hover:bg-gray-100 transition">
              <GiHealthNormal className='text-9xl' />
              <h2 className="text-xl font-bold mb-4">Crisis Management</h2>
              <p className="text-gray-700 mb-4">
                Manage crises, allocate resources, and handle emergencies in the hospital network.
              </p>
              <Link href="/CrisisManagement" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                Crisis Management
              </Link>
            </div>

            {/* Patient Lists */}
            <div className="bg-white p-6 rounded-lg border-2 text-center flex flex-col justify-center items-center hover:bg-gray-100 transition">
              <FaList className='text-9xl' />
              <h2 className="text-xl font-bold mb-4">Patient Lists</h2>
              <p className="text-gray-700 mb-4">
                Access and view lists of patients, including their appointment history and details.
              </p>
              <Link href="/PatientLists" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                View Patients
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
