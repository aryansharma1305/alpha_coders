import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BedModal({ bedDetails, appointments, closeModal }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { bedId, hospitalId } = bedDetails;

  const assignBed = async (appointmentId) => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { bedId, hospitalId });
    closeModal();
  };

  const dischargeBed = async (appointmentId) => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { bedId: null, hospitalId: null, condition: "discharged" });
    closeModal();
  };

  const occupiedAppointments = appointments.filter(
    (appt) => appt.bedId === bedId && appt.hospitalId === hospitalId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Bed {bedId} Details</h2>

        {occupiedAppointments.length > 0 ? (
          <div>
            <h3 className="text-lg mb-2">Occupied by:</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">Patient Name</th>
                  <th className="py-2 px-4">Age</th>
                  <th className="py-2 px-4">Department</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {occupiedAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="py-2 px-4">{appt.name}</td>
                    <td className="py-2 px-4">{appt.age}</td>
                    <td className="py-2 px-4">{appt.department}</td>
                    <td className="py-2 px-4">{appt.date}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => dischargeBed(appt.id)}
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        Discharge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h3 className="text-lg mb-4">Assign a Patient to Bed {bedId}</h3>
            <select
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
              className="border p-2 rounded mb-4"
            >
              <option value="">Select Appointment</option>
              {appointments
                .filter((appt) => !appt.bedId)
                .map((appt) => (
                  <option key={appt.id} value={appt.id}>
                    {appt.name} (Department: {appt.department})
                  </option>
                ))}
            </select>
            <button
              onClick={() => assignBed(selectedAppointment)}
              className="bg-blue-500 text-white p-2 rounded-lg"
              disabled={!selectedAppointment}
            >
              Assign Bed
            </button>
          </div>
        )}

        <button
          onClick={closeModal}
          className="mt-4 bg-gray-500 text-white p-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
