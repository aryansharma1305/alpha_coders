"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import Sidebar from "@/components/HospitalSidebar";
import HospitalModal from "@/components/HospitalModal";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalBeds, setTotalBeds] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      const hospitalsCollection = collection(db, "hospitals");
      const hospitalSnapshot = await getDocs(hospitalsCollection);
      const hospitalList = hospitalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // For each hospital, fetch the number of doctors associated with it
      for (const hospital of hospitalList) {
        const doctorsQuery = query(collection(db, "doctors"), where("hospitalId", "==", hospital.id));
        const doctorsSnapshot = await getDocs(doctorsQuery);
        hospital.doctorsCount = doctorsSnapshot.size; // Add doctors count to each hospital
      }

      setHospitals(hospitalList);

      // Calculate total number of beds
      const totalBedsCount = hospitalList.reduce((sum, hospital) => sum + hospital.totalBeds, 0);
      setTotalBeds(totalBedsCount);
    };

    const fetchTotalDoctors = async () => {
      const doctorsCollection = collection(db, "doctors");
      const doctorSnapshot = await getDocs(doctorsCollection);
      setTotalDoctors(doctorSnapshot.size);
    };

    fetchHospitals();
    fetchTotalDoctors();
  }, []);

  const handleSaveHospital = async (hospital) => {
    try {
      if (hospital.id) {
        // Update existing hospital
        const hospitalRef = doc(db, "hospitals", hospital.id);
        await updateDoc(hospitalRef, {
          name: hospital.name,
          location: hospital.location,
          totalBeds: hospital.totalBeds,
        });
        setHospitals((prev) =>
          prev.map((h) => (h.id === hospital.id ? hospital : h))
        );
      } else {
        // Add new hospital
        const docRef = await addDoc(collection(db, "hospitals"), {
          name: hospital.name,
          location: hospital.location,
          totalBeds: hospital.totalBeds,
        });
        setHospitals((prev) => [...prev, { ...hospital, id: docRef.id }]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving hospital:", error);
    }
  };

  const deleteHospital = async (id) => {
    try {
      await deleteDoc(doc(db, "hospitals", id));
      setHospitals((prev) => prev.filter((hospital) => hospital.id !== id));
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const editHospital = (hospital) => {
    setSelectedHospital(hospital); // Set the selected hospital for editing
    setIsModalOpen(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full overflow-y-auto max-h-screen">
        <header className="bg-blue-500 p-4 flex justify-between items-center w-full">
          <h1 className="text-3xl font-semibold">Hospital Management Dashboard</h1>
          <button
            onClick={() => {
              setSelectedHospital(null); // For new hospital
              setIsModalOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Hospital
          </button>
        </header>
        <div className="p-6">
          {/* Statistics Section */}
          <div className="bg-gray-100 p-5 rounded-lg shadow mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Total Hospitals</h2>
                <p className="text-2xl">{hospitals.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Total Doctors</h2>
                <p className="text-2xl">{totalDoctors}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Total Beds</h2>
                <p className="text-2xl">{totalBeds}</p>
              </div>
            </div>
          </div>

          {/* Hospital Table */}
          <table className="table-auto w-full border-collapse border border-gray-300 mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Total Beds</th>
                <th className="border px-4 py-2">Doctors</th> {/* New Column for Doctors */}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.id}>
                  <td className="border px-4 py-2">{hospital.name}</td>
                  <td className="border px-4 py-2">{hospital.location}</td>
                  <td className="border px-4 py-2">{hospital.totalBeds}</td>
                  <td className="border px-4 py-2">{hospital.doctorsCount}</td> {/* Display doctors count */}
                  <td className="border px-4 py-2 flex space-x-2 w-20">
                    <button
                      onClick={() => editHospital(hospital)}
                      className="text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-700 transition flex gap-2"
                    >
                      <FaEdit size={20} />Edit
                    </button>
                    <button
                      onClick={() => deleteHospital(hospital.id)}
                      className="text-white bg-red-500 p-2 rounded-lg hover:bg-red-700 transition flex gap-2"
                    >
                      <FaTrash size={20} />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Adding or Editing a Hospital */}
          <HospitalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveHospital}
            hospital={selectedHospital}
          />
        </div>
      </div>
    </div>
  );
}
