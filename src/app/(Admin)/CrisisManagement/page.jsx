"use client";
import { MdOutlineInventory2, MdEmergency } from "react-icons/md";
import { FaUserMd } from "react-icons/fa"; 
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai"; 
import { RiTeamLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';

export default function CrisisManagement() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    router.push('/SignIn');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-blue-500 text-white p-6 fixed top-0 left-0 z-10">
          <h2 className="text-3xl font-bold mb-8">Crisis Management</h2>
          <ul>
            <li className="mb-4 flex items-center cursor-pointer hover:bg-blue-700 p-2 rounded">
              <AiOutlineHome className="mr-2" /> Home
            </li>
            <li className="mb-4 flex items-center cursor-pointer hover:bg-blue-700 p-2 rounded">
              <FaUserMd className="mr-2" /> Doctors
            </li>
            <li className="mb-4 flex items-center cursor-pointer hover:bg-blue-700 p-2 rounded">
              <RiTeamLine className="mr-2" /> Staff
            </li>
            <li className="mb-4 flex items-center cursor-pointer hover:bg-blue-700 p-2 rounded">
              <MdOutlineInventory2 className="mr-2" /> Equipment
            </li>
            <li className="mb-4 flex items-center cursor-pointer hover:bg-blue-700 p-2 rounded">
              <MdEmergency className="mr-2" /> Emergency
            </li>
            <li
              onClick={handleLogout}
              className="flex items-center cursor-pointer hover:bg-red-700 p-2 rounded bg-red-500 mt-4"
            >
              <AiOutlineLogout className="mr-2" /> Logout
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="ml-64 w-full p-10 pt-20">
          <h1 className="text-4xl font-bold mb-10">Crisis Management Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Crisis Management Widgets */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
              <MdOutlineInventory2 className="text-6xl text-blue-500" />
              <h2 className="text-xl font-bold mt-4">Equipment Allocation</h2>
              <p className="text-gray-700 mt-2">Allocate medical equipment based on current demand and availability.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
              <FaUserMd className="text-6xl text-blue-500" />
              <h2 className="text-xl font-bold mt-4">Doctor Allocation</h2>
              <p className="text-gray-700 mt-2">Assign doctors to departments in times of crisis.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
              <MdEmergency className="text-6xl text-red-500" />
              <h2 className="text-xl font-bold mt-4">Room Allocation</h2>
              <p className="text-gray-700 mt-2">Manage room assignments for patients and staff during emergencies.</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Doctors Status</h2>
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="p-4">001</td>
                  <td className="p-4">Dr. John Doe</td>
                  <td className="p-4">Orthopedics</td>
                  <td className="p-4 text-green-500">Available</td>
                </tr>
                <tr className="text-center">
                  <td className="p-4">002</td>
                  <td className="p-4">Dr. Jane Smith</td>
                  <td className="p-4">Cardiology</td>
                  <td className="p-4 text-red-500">Unavailable</td>
                </tr>
                {/* Add more doctor statuses as needed */}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Emergency Stocks</h2>
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="p-4">A001</td>
                  <td className="p-4">Oxygen Cylinders</td>
                  <td className="p-4 text-yellow-500">Low</td>
                  <td className="p-4">5</td>
                </tr>
                <tr className="text-center">
                  <td className="p-4">A002</td>
                  <td className="p-4">Masks</td>
                  <td className="p-4 text-green-500">Sufficient</td>
                  <td className="p-4">200</td>
                </tr>
                {/* Add more emergency stocks as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
