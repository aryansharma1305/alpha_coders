// components/WaitingTime.js
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function WaitingTime() {
  const [appointmentsByDepartment, setAppointmentsByDepartment] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Group appointments by department
      const groupedAppointments = appointmentsData.reduce((acc, appointment) => {
        const { department } = appointment;
        if (!acc[department]) {
          acc[department] = [];
        }
        acc[department].push(appointment);
        return acc;
      }, {});

      setAppointmentsByDepartment(groupedAppointments);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md my-24">
      <h2 className="text-3xl font-bold mb-4">Waiting Time:</h2>
      {Object.entries(appointmentsByDepartment).map(([department, appointments]) => (
        <div key={department} className="mb-8">
          <h3 className="text-2xl font-bold mb-4">{department}</h3>
          <table className="min-w-full bg-white mb-6">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Sl no</th>
                <th className="py-2 px-4 border-b">Appointment ID</th>
                <th className="py-2 px-4 border-b">Patient Name</th>
                <th className="py-2 px-4 border-b">Expected Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-center">{appointment.id}</td>
                  <td className="py-2 px-4 border-b text-center">{appointment.name}</td>
                  <td className="py-2 px-4 border-b text-center">{appointment.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
