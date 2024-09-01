// pages/appointment.js
"use client";
import { useState } from 'react';

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    department: '',
    date: '',
    time: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, age, gender, department, date, time } = formData;
    
    if (!name || !age || !gender || !department || !date || !time) {
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
    setSubmitted(true);

    console.log('Form Data:', formData);
    // Optionally, you can handle form submission to a server here.
  };

  if (submitted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen" >
        <p className="text-2xl font-bold ">The Appointment has been Booked Successfully!</p>
        <p className='text-lg font-semibold'>Appointment ID Number: #6969</p>
        <div className="flex flex-row gap-6 mt-6">
          <a className='px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md' href='/'>Close</a>
          <a className='px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md'>Print</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/assets/bg3.jpg)'}}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0"></div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-5/6 max-w-3xl z-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Appointment Form</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-6">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
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
            <label className="block text-sm font-bold mb-2">Deparment:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Department</option>
              <option value="Male">Ortho</option>
              <option value="Female">Pedatric</option>
              <option value="Other">ENT</option>
              <option value="Other">Dental</option>
            </select>
          </div>
          
          <div className="flex gap-6">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Appointment Date:
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Appointment Time:
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
