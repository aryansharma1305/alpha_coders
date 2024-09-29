"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BedModal from '@/components/BedModal'; // Modal for handling bed details
import Sidebar from '@/components/HospitalSidebar'; // Assuming you have a sidebar component

import { FaBed, FaHospital } from "react-icons/fa";


export default function BedManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [bedDetails, setBedDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch hospitals data
  useEffect(() => {
    async function fetchHospitals() {
      const hospitalQuery = await getDocs(collection(db, 'hospitals'));
      setHospitals(hospitalQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    
    fetchHospitals();
  }, []);

  // Fetch appointments data
  const fetchAppointments = async () => {
    const appointmentQuery = await getDocs(collection(db, 'appointments'));
    setAppointments(appointmentQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const openBedModal = (bedId, hospitalId) => {
    setBedDetails({ bedId, hospitalId });
    setShowModal(true);
  };

  const closeBedModal = () => {
    setShowModal(false);
    fetchAppointments(); // Refresh the appointments after modal closes to reflect changes
  };

  const getBedStatus = (hospital) => {
    const occupiedBeds = appointments.filter(appt => appt.hospitalId === hospital.id).map(appt => appt.bedId);
    return { total: hospital.totalBeds, free: hospital.totalBeds - occupiedBeds.length, occupied: occupiedBeds.length };
  };

  const renderTopBoxes = () => {
    if (selectedHospital === 'all') {
      const totalBeds = hospitals.reduce((acc, hosp) => acc + hosp.totalBeds, 0);
      const freeBeds = totalBeds - appointments.length;
      return (
        <div className="flex w-full justify-center space-x-6">
          <div className="bg-blue-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
            <FaHospital className='text-7xl text-white' />
            <p className='text-xl font-semibold'>Total Hospitals</p> 
            {hospitals.length}
          </div>
          <div className="bg-green-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
            <FaBed className='text-7xl text-white' />
          <p className='text-xl font-semibold'>Total Beds</p> 
          {totalBeds}
          </div>
          <div className="bg-yellow-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
            <FaBed className='text-7xl text-white' />
            <p className='text-xl font-semibold'>Free Beds</p> 
            {freeBeds}
          </div>
        </div>
      );
    } else {
      const hospital = hospitals.find(hosp => hosp.id === selectedHospital);
      const { total, free, occupied } = getBedStatus(hospital);
      return (
        <div className="flex w-full justify-center space-x-6">
        <div className="bg-blue-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
          <FaBed className='text-7xl text-white' />
          <p className='text-xl font-semibold'>Total Beds</p> 
          {total}
        </div>
        <div className="bg-green-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
          <FaBed className='text-7xl text-white' />
        <p className='text-xl font-semibold'>Free Beds</p> 
        {free}
        </div>
        <div className="bg-yellow-500 text-black p-4 px-12 rounded-lg flex flex-col justify-center items-center w-1/3">
          <FaBed className='text-7xl text-white' />
          <p className='text-xl font-semibold'>Occupied Beds</p> 
          {occupied}
        </div>
      </div>
      );
    }
  };

  const renderBedTable = () => {
    if (selectedHospital === 'all') {
      return (
        <table className="min-w-full bg-white border-2">
          <thead className='border-2'>
            <tr>
              <th className="py-2 px-4 border-r-2">Hospital</th>
              <th className="py-2 px-4 border-r-2">Total Beds</th>
              <th className="py-2 px-4 border-r-2">Free Beds</th>
              <th className="py-2 px-4 border-r-2">Occupied Beds</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, index) => {
              const { total, free, occupied } = getBedStatus(hospital);
              return (
                <tr key={hospital.id} className={index % 2 === 0 ? "bg-gray-100" : "" }>
                  <td className="py-2 px-4 border-r-2">{hospital.name}</td>
                  <td className="py-2 px-4 border-r-2">{total}</td>
                  <td className="py-2 px-4 border-r-2">{free}</td>
                  <td className="py-2 px-4 border-r-2">{occupied}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      const hospital = hospitals.find(hosp => hosp.id === selectedHospital);
      const { total } = getBedStatus(hospital);
      const occupiedBeds = appointments.filter(appt => appt.hospitalId === selectedHospital).map(appt => appt.bedId);
      return (
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const bedId = i + 1;
            const isOccupied = occupiedBeds.includes(bedId);
            return (
              <div
                key={bedId}
                className={`p-4 text-white cursor-pointer rounded-lg ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`}
                onClick={() => openBedModal(bedId, selectedHospital)}
              >
                Bed {bedId}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow overflow-y-auto max-h-screen">
        <div className="bg-blue-500 flex justify-between items-center p-6">
          <h1 className="text-3xl font-semibold">Bed Management</h1>
          {/* Dropdown to select hospital */}
          <div className="flex items-center">
            <label htmlFor="hospital-select" className="mr-2 font-bold text-lg">Select Hospital:</label>
            <select
              id="hospital-select"
              value={selectedHospital}
              onChange={handleHospitalChange}
              className="border p-2 rounded"
            >
              <option value="all">All</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Render top statistics */}
        <div className="mb-6 p-6">
          {renderTopBoxes()}
        </div>

        {/* Render bed table or bed grid based on hospital selection */}
        <div className="mb-6 p-6">
          {renderBedTable()}
        </div>

        {/* Bed Modal */}
        {showModal && (
          <BedModal
            bedDetails={bedDetails}
            appointments={appointments}
            closeModal={closeBedModal}
          />
        )}
      </div>
    </div>
  );
}
