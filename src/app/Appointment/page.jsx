"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { db, doc, getDoc, setDoc, updateDoc } from '@/lib/firebase'; // Import necessary Firestore functions
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';
import Footer from '@/components/Footer';


export default function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    department: '',
    date: '',
    time: '',
    condition: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  // Retrieve email from local storage
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateDate = (date) => {
    return new Date(date) > new Date();
  };

  const validateTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= 480 && totalMinutes <= 1320; // 8 AM to 10 PM in minutes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, age, gender, department, date, time, condition } = formData;
  
    if (!name || !age || !gender || !department || !date || !time || !condition) {
      setError('All fields are required.');
      return;
    }
  
    if (!validateDate(date)) {
      setError('Appointment date must be in the future.');
      return;
    }
  
    if (!validateTime(time)) {
      setError('Appointment time must be between 8 AM and 10 PM.');
      return;
    }
  
    setError('');
  
    try {
      // Retrieve the current counter
      const counterDocRef = doc(db, 'meta', 'appointmentCounter');
      const counterDoc = await getDoc(counterDocRef);
      let newAppointmentId = 1;
  
      if (counterDoc.exists()) {
        newAppointmentId = counterDoc.data().latestId + 1;
        // Update the counter
        await updateDoc(counterDocRef, { latestId: newAppointmentId });
      } else {
        // Create the counter document if it doesn't exist
        await setDoc(counterDocRef, { latestId: newAppointmentId });
      }
  
      // Add the appointment data to Firestore with a specific ID
      const appointmentDocRef = doc(db, 'appointments', newAppointmentId.toString()); // Set ID to newAppointmentId
      await setDoc(appointmentDocRef, {
        name,
        age,
        gender,
        department,
        date,
        time,
        condition,
        email: userEmail,
      });
  
      setAppointmentId(newAppointmentId); // Set the generated appointment ID
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit appointment. Please try again.');
      console.error('Error adding document:', error);
    }
  };  

  if (submitted) {
    return (
      <div>
        <Navbar />
        <main className="flex flex-col justify-center items-center h-screen bg-blue-400">
          <div className="bg-white p-6 py-24 rounded border-2 shadow-md w-5/6 max-w-3xl z-10 flex flex-col items-center">
            <p className="text-2xl font-bold">The Appointment has been Booked Successfully!</p>
            <p className='text-lg font-semibold'>Appointment ID Number: #{appointmentId}</p>
            <div className="flex flex-row gap-6 mt-6">
              <a className='px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md' href='/'>Close</a>
              <a className='px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md'>Print</a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex justify-between items-center h-screen w-full">
        <div className="bg-blue-400 h-full w-1/2 flex justify-center items-center">
          <Image src={"/assets/appointment-form.png"} alt='image' width={600} height={400}/>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded"
        >
          <h2 className="text-4xl font-bold mb-4 text-center">Appointment Form</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-md font-bold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <div className="mb-4 w-40">
              <label className="block text-md font-bold mb-2">Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-md font-bold mb-2">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-md font-bold mb-2">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 rounded"
              required
            >
              <option value="">Select Specialization</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Pediatric">Pediatric</option>
              <option value="ENT">ENT</option>
              <option value="Dental">Dental</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>
          
          <div className="flex justify-between">
            <div className="mb-4">
              <label className="block text-md font-bold mb-2">Appointment Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-md font-bold mb-2">Appointment Time:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-md font-bold mb-2">Condition:</label>
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <input 
                  type='radio'
                  name='condition'
                  value='emergency'  // Set specific value
                  checked={formData.condition === 'emergency'}  // Check if selected
                  onChange={handleChange}
                  className="px-3 py-2 border-2 rounded"
                  required
                />
                <label>Emergency</label>
              </div>
              <div className="flex gap-2">
                <input 
                  type='radio'
                  name='condition'
                  value='non-emergency'  // Set specific value
                  checked={formData.condition === 'non-emergency'}  // Check if selected
                  onChange={handleChange}
                  className="px-3 py-2 border-2 rounded"
                  required
                />
                <label>Non-Emergency</label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Submit
          </button>
        </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
