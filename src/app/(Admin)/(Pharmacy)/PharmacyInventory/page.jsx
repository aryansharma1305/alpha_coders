"use client";
import Sidebar from '@/components/Sidebar';
import { FaPrescriptionBottleAlt , FaExclamationTriangle, FaListAlt } from 'react-icons/fa';

export default function PharmacyInventory() {
  // Sample data
  const medicineData = [
    { id: 1, name: 'Aspirin', quantity: 20, group: 'Pain Relievers' },
    { id: 2, name: 'Paracetamol', quantity: 5, group: 'Pain Relievers' },
    { id: 3, name: 'Amoxicillin', quantity: 10, group: 'Antibiotics' }
  ];

  const shortageData = medicineData.filter(med => med.quantity < 10);
  const groupData = [...new Set(medicineData.map(med => med.group))];

  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1">
      <div className="flex top-0 w-full bg-gray-100 p-6 justify-between">
          <h1 className="text-2xl font-bold text-black">Pharmacy Management Inventory</h1>
        </div>
      
      <div className="p-6 flex-1">
        {/* Quick Reports */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-100 border-2 border-blue-300 p-4 rounded-lg flex items-center">
            <FaPrescriptionBottleAlt  className="text-blue-500 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Medicines Available</h2>
              <p className="text-gray-600">{medicineData.length}</p>
            </div>
          </div>
          <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg flex items-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Medicine Shortage</h2>
              <p className="text-gray-600">{shortageData.length}</p>
            </div>
          </div>
          <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg flex items-center">
            <FaListAlt className="text-green-500 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Medicine Groups</h2>
              <p className="text-gray-600">{groupData.length}</p>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="bg-white border-2 border-gray-300 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Medicine Shortage</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {shortageData.map(med => (
                <tr key={med.id} className="border-b">
                  <td className="p-2">{med.id}</td>
                  <td className="p-2">{med.name}</td>
                  <td className="p-2">{med.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-2 border-gray-300 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Medicine Groups</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Group</th>
                <th className="p-2 text-left">Number of Medicines</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((group, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{group}</td>
                  <td className="p-2">{medicineData.filter(med => med.group === group).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-2 border-gray-300 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">All Medicines</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Group</th>
              </tr>
            </thead>
            <tbody>
              {medicineData.map(med => (
                <tr key={med.id} className="border-b">
                  <td className="p-2">{med.id}</td>
                  <td className="p-2">{med.name}</td>
                  <td className="p-2">{med.quantity}</td>
                  <td className="p-2">{med.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
