// components/DoctorModal.js
import { useState, useEffect } from 'react';

const DoctorModal = ({ isOpen, onClose, onSave, doctor, hospitals }) => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [availability, setAvailability] = useState('free');
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name);
      setSpecialization(doctor.specialization);
      setHospitalId(doctor.hospitalId);
      setAvailability(doctor.availability);
    } else {
      setName('');
      setSpecialization('');
      setHospitalId('');
      setAvailability('free');
    }
  }, [doctor]);

  const handleSave = () => {
    if (!name || !specialization || !hospitalId) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSave({ ...doctor, name, specialization, hospitalId, availability });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{doctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <label className='font-bold'>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Doctor Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          required
        />
        
        <label className='font-bold'>Specialization:</label>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
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
        
        <label className='font-bold'>Hospital:</label>
        <select
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          required
        >
          <option value="">Select Hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name}
            </option>
          ))}
        </select>
        
        <label className='font-bold'>Availability:</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="free">Free</option>
          <option value="busy">Busy</option>
          <option value="off_duty">Off Duty</option>
        </select>
        
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg mr-2">
          Save
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

export default DoctorModal;
