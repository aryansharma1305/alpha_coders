import React from 'react';

const PatientModal = ({ patient, getHospitalName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Patient Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">ID:</p>
            <p>{patient.id}</p>
          </div>
          <div>
            <p className="font-semibold">Name:</p>
            <p>{patient.name}</p>
          </div>
          <div>
            <p className="font-semibold">Age:</p>
            <p>{patient.age}</p>
          </div>
          <div>
            <p className="font-semibold">Gender:</p>
            <p>{patient.gender || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Department:</p>
            <p>{patient.department}</p>
          </div>
          <div>
            <p className="font-semibold">Condition:</p>
            <p>{patient.condition || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Bed ID:</p>
            <p>{patient.bedId || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Hospital:</p>
            <p>{getHospitalName(patient.hospitalId) || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Date:</p>
            <p>{patient.date}</p>
          </div>
          <div>
            <p className="font-semibold">Time:</p>
            <p>{patient.time}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{patient.email || '-'}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientModal;
