"use client";
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, setDoc, deleteDoc } from '@/lib/firebase';
import HospitalModal from '@/components/HospitalModal';
import MedicineModal from '@/components/MedicineModal';

import { MdDelete, MdEdit } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { CgDanger } from "react-icons/cg";
import { HiOutlineRectangleGroup } from "react-icons/hi2";

export default function PharmacyInventory() {
  const [medicineData, setMedicineData] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('all'); // Default to 'all'
  const [hospitals, setHospitals] = useState([]);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  useEffect(() => {
    async function fetchHospitals() {
      const hospitalsSnapshot = await getDocs(collection(db, 'hospitals'));
      const hospitalsList = hospitalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(hospitalsList);
    }

    fetchHospitals();
  }, []);

  useEffect(() => {
    async function fetchMedicines() {
      if (selectedHospital === 'all') {
        // Fetch medicines from all hospitals
        const allMedicines = [];
        for (const hospital of hospitals) {
          const medicinesSnapshot = await getDocs(collection(db, `hospitals/${hospital.id}/medicines`));
          const medicinesList = medicinesSnapshot.docs.map(doc => ({
            id: doc.id,
            hospital: hospital.id,  // Add hospital.id to each medicine object
            ...doc.data(),
          }));
          allMedicines.push(...medicinesList);
        }
        setMedicineData(allMedicines);
      } else if (selectedHospital) {
        // Fetch medicines from the selected hospital
        const medicinesSnapshot = await getDocs(collection(db, `hospitals/${selectedHospital}/medicines`));
        const medicinesList = medicinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMedicineData(medicinesList);
      }
    }

    fetchMedicines();
  }, [selectedHospital, hospitals]);

  const medicinesAvailable = medicineData.length;
  const medicineShortage = medicineData.filter(med => med.quantity < 10).length;
  const medicineGroups = [...new Set(medicineData.map(med => med.group))].length;

  const handleAddHospital = async (hospital) => {
    const hospitalRef = doc(db, 'hospitals', hospital.name);
    await setDoc(hospitalRef, {});
    setHospitals([...hospitals, { id: hospital.name }]);
  };

  const handleAddMedicine = async (medicine) => {
    if (selectedHospital) {
      const medicinesCollectionRef = collection(db, `hospitals/${selectedHospital}/medicines`);
      if (editingMedicine) {
        const medicineRef = doc(medicinesCollectionRef, editingMedicine.id);
        await setDoc(medicineRef, medicine);
        setMedicineData(medicineData.map(med => med.id === editingMedicine.id ? { id: editingMedicine.id, ...medicine } : med));
      } else {
        const medicinesSnapshot = await getDocs(medicinesCollectionRef);
        const maxId = medicinesSnapshot.docs.length
          ? Math.max(...medicinesSnapshot.docs.map(doc => Number(doc.id)))
          : 0;
        const newId = (maxId + 1).toString();
        const newMedicineRef = doc(medicinesCollectionRef, newId);
        await setDoc(newMedicineRef, medicine);
        setMedicineData([...medicineData, { id: newId, ...medicine }]);
      }
      setIsMedicineModalOpen(false);
      setEditingMedicine(null);
    }
  };
  
  const handleDeleteMedicine = async (id) => {
    if (selectedHospital) {
      const medicineRef = doc(db, `hospitals/${selectedHospital}/medicines`, id);
      await deleteDoc(medicineRef);
      setMedicineData(medicineData.filter(med => med.id !== id));
    }
  };
  
  const handleEditButtonClick = (medicine) => {
    setEditingMedicine(medicine);
    setIsMedicineModalOpen(true);
  };
  
  const handleNewMedicineClick = () => {
    setEditingMedicine(null);
    setIsMedicineModalOpen(true);
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1">
        <div className="flex top-0 w-full bg-blue-500 p-6 justify-between">
          <h1 className="text-3xl font-semibold text-black">Pharmacy Management Inventory</h1>
          <div className="flex gap-4 items-center">
            <p className='font-bold text-lg'>Selected Hospital: </p>
            <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} className="p-2 border-2 rounded-lg ">
              <option value="all">All Hospitals</option>
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital.id}>{hospital.id}</option>
              ))}
            </select>
            <button 
              onClick={() => setIsHospitalModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition"
            >
              Add Hospital
            </button>
          </div>
        </div>
      
        <div className="p-6 flex-1">
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-purple-400 p-4 rounded flex flex-col justify-center items-center">
              <GiMedicines className="text-white text-7xl" />
                <h3 className="text-xl font-bold">Medicines Available</h3>
                <p className="">{medicinesAvailable}</p>
            </div>
            <div className="bg-red-400 p-4 rounded flex flex-col justify-center items-center">
              <CgDanger className="text-white text-7xl" />
                <h3 className="text-xl font-bold">Medicine Shortage</h3>
                <p className="">{medicineShortage}</p>
            </div>
            <div className="bg-green-400 p-4 rounded flex flex-col justify-center items-center">
              <HiOutlineRectangleGroup className="text-white text-7xl" />
                <h3 className="text-xl font-bold">Medicine Groups</h3>
                <p className="">{medicineGroups}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold mb-4">All Medicines</h2>
              <button 
                onClick={handleNewMedicineClick}
                className={`bg-green-500 text-white p-2 rounded-lg ${selectedHospital == "all" ? "hidden" : ""}`}
              >
                Add New Medicine
              </button>
            </div>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Group</th>
                  {selectedHospital === "all" ? <th className="p-2 text-left">Hospital</th> : null}
                  {selectedHospital === "all" ?  null : <th className="p-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {medicineData.map(med => (
                  <tr key={med.id} className="border-b">
                    <td className="p-2">{med.id}</td>
                    <td className="p-2">{med.name}</td>
                    <td className="p-2">{med.quantity}</td>
                    <td className="p-2">{med.group}</td>
                    {selectedHospital === "all" ? <td className="p-2">{med.hospital}</td> : null}
                    {selectedHospital === "all" ? null : <td className="p-2">
                      <button 
                        onClick={() => handleEditButtonClick(med)}
                        className="bg-yellow-400 text-white p-2 rounded-lg mr-2"
                      >
                        <MdEdit className='text-xl' />
                      </button>
                      <button 
                        onClick={() => handleDeleteMedicine(med.id)}
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        <MdDelete className='text-xl' />
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medicine Shortage Table */}
          <div className="bg-white border-2 border-gray-300 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Medicine Shortage</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {medicineData
                  .filter(med => med.quantity < 10)
                  .map(med => (
                    <tr key={med.id} className="border-b">
                      <td className="p-2">{med.id}</td>
                      <td className="p-2">{med.name}</td>
                      <td className="p-2">{med.quantity}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Medicine Groups Table */}
          <div className="bg-white border-2 border-gray-300 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Medicine Groups</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Group Name</th>
                  <th className="p-2 text-left">Number of Medicines</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(medicineData.map(med => med.group)))
                  .map(group => (
                    <tr key={group} className="border-b">
                      <td className="p-2">{group}</td>
                      <td className="p-2">
                        {medicineData.filter(med => med.group === group).length}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        
        <HospitalModal 
        isOpen={isHospitalModalOpen} 
        onClose={() => setIsHospitalModalOpen(false)} 
        onSave={handleAddHospital} 
      />
      <MedicineModal 
        isOpen={isMedicineModalOpen} 
        onClose={() => setIsMedicineModalOpen(false)} 
        onSave={handleAddMedicine} 
        medicine={editingMedicine}
      />
      </div>
    </div>
  );
}

