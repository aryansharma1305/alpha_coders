"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import PatientModal from '@/components/PatientModal'; // Import PatientModal

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch patient data from Firebase Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = collection(db, 'appointments'); // Use your existing collection
      const patientSnapshot = await getDocs(patientsCollection);
      const patientList = patientSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientList);
    };

    const fetchHospitals = async () => {
      const hospitalsCollection = collection(db, 'hospitals'); // Assuming hospitals are stored in 'hospitals' collection
      const hospitalSnapshot = await getDocs(hospitalsCollection);
      const hospitalList = hospitalSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setHospitals(hospitalList);
    };

    fetchPatients();
    fetchHospitals();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  // Get hospital name by ID
  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find((h) => h.id === hospitalId);
    return hospital ? hospital.name : '-';
  };

  // Handle row click
  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 p-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-semibold">Patient Appointment List</h1>
        <button
          className="mt-2 text-md bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          onClick={() => router.push('/AdminHome')}
        >
          Back to Admin Home
        </button>
      </header>

      {/* Search Bar */}
      <main className="flex-grow p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by patient name"
            className="px-4 py-2 border-4 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table of Patients */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Age</th>
                <th className="py-2 px-4 border-b">Department</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(patient)}
                  >
                    <td className="py-2 px-4 border-b">{patient.name}</td>
                    <td className="py-2 px-4 border-b">{patient.age}</td>
                    <td className="py-2 px-4 border-b">{patient.department}</td>
                    <td className="py-2 px-4 border-b">{patient.date}</td>
                    <td className="py-2 px-4 border-b">{patient.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Patient Modal */}
      {isModalOpen && selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          getHospitalName={getHospitalName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientList;
