"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Sidebar from "@/components/HospitalSidebar";
import DoctorModal from "@/components/DoctorModal";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsCollection = collection(db, "hospitals");
        const hospitalSnapshot = await getDocs(hospitalsCollection);
        const hospitalList = hospitalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHospitals(hospitalList);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "doctors");
        const doctorSnapshot = await getDocs(doctorsCollection);
        const doctorList = doctorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchHospitals();
    fetchDoctors();
  }, []);

  const handleSaveDoctor = async (doctor) => {
    try {
      if (doctor.id) {
        // Update doctor
        const doctorRef = doc(db, "doctors", doctor.id);
        await updateDoc(doctorRef, {
          name: doctor.name,
          specialization: doctor.specialization,
          hospitalId: doctor.hospitalId,
          availability: doctor.availability || "free", // Default to "free" if not provided
        });
      } else {
        // Add new doctor
        await addDoc(collection(db, "doctors"), {
          name: doctor.name,
          specialization: doctor.specialization,
          hospitalId: doctor.hospitalId,
          availability: doctor.availability || "free", // Default to "free" if not provided
        });
      }
      setIsModalOpen(false);
      // Re-fetch doctors after adding or updating
      const doctorsCollection = collection(db, "doctors");
      const doctorSnapshot = await getDocs(doctorsCollection);
      const doctorList = doctorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorList);
    } catch (error) {
      console.error("Error saving doctor:", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await deleteDoc(doc(db, "doctors", id));
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    !selectedHospital || doctor.hospitalId === selectedHospital
  );

  const specializationCounts = filteredDoctors.reduce((acc, doctor) => {
    acc[doctor.specialization] = (acc[doctor.specialization] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full overflow-y-auto max-h-screen">
        <header className="bg-blue-500 p-4 flex justify-between items-center w-full">
          <h1 className="text-3xl font-semibold">Doctors Management Dashboard</h1>
          <div className="flex items-center">
            <p className="mr-2 text-lg font-bold">Selected Hospital:</p>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="mr-4 p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSelectedDoctor(null); // For new doctor
                setIsModalOpen(true);
              }}
              className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded"
            >
              Add Doctor
            </button>
          </div>
        </header>
        <div className="p-6">
          {/* Statistics Section */}
          <div className="bg-gray-100 p-5 rounded-lg shadow mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Total Doctors</h2>
                <p className="text-2xl">{filteredDoctors.length}</p>
              </div>
              {Object.entries(specializationCounts).map(([specialization, count]) => (
                <div key={specialization} className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold">{specialization}</h2>
                  <p className="text-2xl">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors Table */}
          <table className="table-auto w-full border-collapse border border-gray-300 mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Specialization</th>
                <th className="border px-4 py-2">Hospital</th>
                <th className="border px-4 py-2">Availability</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="border px-4 py-2">{doctor.name}</td>
                  <td className="border px-4 py-2">{doctor.specialization}</td>
                  <td className="border px-4 py-2">
                    {hospitals.find((hospital) => hospital.id === doctor.hospitalId)?.name || "Unknown"}
                  </td>
                  <td className="border px-4 py-2">{doctor.availability}</td>
                  <td className="border px-4 py-2 flex space-x-2 w-20">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsModalOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 transition text-white px-4 py-2 rounded flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => deleteDoctor(doctor.id)}
                      className="bg-red-500 hover:bg-red-700 transition text-white px-4 py-2 rounded flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Adding or Editing a Doctor */}
          <DoctorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveDoctor}
            doctor={selectedDoctor}
            hospitals={hospitals} // Passing hospitals to the modal for selection
          />
        </div>
      </div>
    </div>
  );
}