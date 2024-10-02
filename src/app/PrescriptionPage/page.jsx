"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure Firebase Firestore is imported
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrescriptionPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatientModal, setNewPatientModal] = useState(false); // Modal for registering a new patient
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    sex: '',
    age: '',
  });
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [automate, setAutomate] = useState(true); // Automate by default for smart suggestions

  // Fetch department from localStorage
  const department = localStorage.getItem('userDepartment');

  // Fetch patients (appointments) from Firestore based on department
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(patient => patient.department === department); // Filter by department
        setPatients(patientsList);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [department]);

  const handlePatientSelect = (patientId) => {
    const selected = patients.find(patient => patient.id === patientId);
    setSelectedPatient(selected);
  };

  // Handle input for new patient registration
  const handleNewPatientChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  // Save new patient to Firebase
  const handleNewPatientSubmit = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.sex || !newPatient.age) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "patients"), newPatient);
      console.log("New patient added with ID:", docRef.id);
      setPatients([...patients, { id: docRef.id, ...newPatient }]); // Add new patient to the patients list
      setNewPatientModal(false); // Close modal after registration
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handlePrescriptionSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    const prescriptionData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      symptoms,
      diagnosis,
      medications,
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "prescriptions"), prescriptionData);
      alert("Prescription saved successfully.");
      setSymptoms('');
      setDiagnosis('');
      setMedications('');
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  const handleAutomate = () => {
    if (automate && symptoms) {
      // Example of smart suggestions based on symptoms
      const smartDiagnosis = symptoms.toLowerCase().includes('fever') ? 'Flu' : 'General Checkup';
      const smartMedications = symptoms.toLowerCase().includes('fever') ? 'Paracetamol, Rest' : 'Multivitamin';

      setDiagnosis(smartDiagnosis);
      setMedications(smartMedications);
    }
  };

  useEffect(() => {
    if (automate) {
      handleAutomate();
    }
  }, [symptoms, automate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 bg-gray-50 p-10 pt-20">
        <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Select a Patient</h2>

          {/* Existing Patients Filtered by Department */}
          <label className="block mb-2">Select Patient:</label>
          <select onChange={(e) => handlePatientSelect(e.target.value)} className="w-full mb-4 p-2 border rounded-lg">
            <option value="">Select a Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name} - {patient.email}</option>
            ))}
          </select>

          {/* Button for Registering a New Patient */}
          <button onClick={() => setNewPatientModal(true)} className="w-full bg-blue-500 text-white py-2 rounded-lg">Register New Patient</button>

          {/* Modal for New Patient Registration */}
          {newPatientModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Register New Patient</h2>
                <input type="text" name="name" placeholder="Name" className="w-full mb-2 p-2 border rounded-lg" onChange={handleNewPatientChange} />
                <input type="email" name="email" placeholder="Email" className="w-full mb-2 p-2 border rounded-lg" onChange={handleNewPatientChange} />
                <input type="text" name="sex" placeholder="Sex" className="w-full mb-2 p-2 border rounded-lg" onChange={handleNewPatientChange} />
                <input type="number" name="age" placeholder="Age" className="w-full mb-4 p-2 border rounded-lg" onChange={handleNewPatientChange} />
                <button onClick={handleNewPatientSubmit} className="w-full bg-green-500 text-white py-2 rounded-lg">Register Patient</button>
                <button onClick={() => setNewPatientModal(false)} className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Prescription Form */}
        <div className="w-2/3 p-4 bg-white shadow-md rounded-lg ml-6">
          <h2 className="text-2xl font-semibold mb-4">Smart Prescription</h2>

          {/* Symptom Selection */}
          <label className="block mb-2">Enter Symptoms:</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full p-4 border rounded-lg mb-4"
            rows="4"
            placeholder="Enter symptoms (e.g., fever, cough)..."
          ></textarea>

          {/* Diagnosis (Auto-filled based on symptoms) */}
          <label className="block mb-2">Diagnosis (Auto-Suggested):</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Diagnosis"
          />

          {/* Medications (Auto-filled based on diagnosis) */}
          <label className="block mb-2">Medications (Auto-Suggested):</label>
          <input
            type="text"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Medications"
          />

          {/* Automate Prescription */}
          <div className="flex items-center mt-4">
            <input type="checkbox" checked={automate} onChange={() => setAutomate(!automate)} className="mr-2" />
            <label>Automate Prescription (auto-fill common medications)</label>
          </div>

          {/* Save Prescription */}
          <button onClick={handlePrescriptionSubmit} className="w-full bg-green-500 text-white py-2 mt-4 rounded-lg">Save Prescription</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
