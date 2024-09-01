// components/PharmacyManagement.js
"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MdOutlineGppGood } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { AiFillMedicineBox } from "react-icons/ai";

const hospitalData = {
  'Hospital 1': { medicinesAvailable: 200, shortages: 10, inventoryStatus: 'Good', revenue: '$15,000' },
  'Hospital 2': { medicinesAvailable: 180, shortages: 15, inventoryStatus: 'Moderate', revenue: '$12,000' },
  'Hospital 3': { medicinesAvailable: 220, shortages: 5, inventoryStatus: 'Excellent', revenue: '$18,000' },
  'Hospital 4': { medicinesAvailable: 150, shortages: 20, inventoryStatus: 'Low', revenue: '$10,000' },
  'All Hospitals': { medicinesAvailable: 750, shortages: 50, inventoryStatus: 'Varied', revenue: '$55,000' }
};

export default function PharmacyManagement() {
  const [selectedHospital, setSelectedHospital] = useState('All Hospitals');

  const handleChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const { medicinesAvailable, shortages, inventoryStatus, revenue } = hospitalData[selectedHospital] || {
    medicinesAvailable: 'N/A',
    shortages: 'N/A',
    inventoryStatus: 'Unavailable',
    revenue: 'N/A'
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex top-0 w-full bg-gray-100 p-6 justify-between">
          <h1 className="text-2xl font-bold text-black">Pharmacy Management Dashboard</h1>
          {/* Dropdown Menu */}
          <select value={selectedHospital} onChange={handleChange} className="p-2 rounded border">
            <option value="All Hospitals">All Hospitals</option>
            <option value="Hospital 1">Hospital 1</option>
            <option value="Hospital 2">Hospital 2</option>
            <option value="Hospital 3">Hospital 3</option>
            <option value="Hospital 4">Hospital 4</option>
          </select>
        </div>

        <div className="p-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Medicines Available */}
            <div className="bg-blue-100 p-4 rounded-lg border-blue-400 border-2 flex flex-col justify-center items-center">
              <GiMedicines className='text-7xl text-blue-400' />
              <h2 className="text-xl font-semibold mb-2">Medicines Available</h2>
              <p className="text-2xl font-bold">{medicinesAvailable}</p>
            </div>

            {/* Medicine Shortage */}
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-400 flex flex-col justify-center items-center">
              <AiFillMedicineBox className='text-7xl text-red-500' />
              <h2 className="text-xl font-semibold mb-2">Medicine Shortage</h2>
              <p className="text-2xl font-bold">{shortages}</p>
            </div>

            {/* Inventory Status */}
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400 flex flex-col justify-center items-center">
              <MdOutlineGppGood className='text-7xl text-green-500'/>
              <h2 className="text-xl font-semibold mb-2">Inventory Status</h2>
              <p className="text-2xl font-bold">{inventoryStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}