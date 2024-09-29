// components/HospitalModal.js
import { useState, useEffect } from 'react';

const HospitalModal = ({ isOpen, onClose, onSave, hospital }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalBeds, setTotalBeds] = useState(null);

  useEffect(() => {
    if (hospital) {
      setName(hospital.name);
      setLocation(hospital.location);
      setTotalBeds(hospital.totalBeds);
    } else {
      setName('');
      setLocation('');
      setTotalBeds('');
    }
  }, [hospital]);

  const handleSave = () => {
    onSave({ ...hospital, name, location, totalBeds: parseInt(totalBeds) });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {hospital ? 'Edit Hospital' : 'Add Hospital'}
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hospital Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="number"
          value={totalBeds}
          onChange={(e) => setTotalBeds(e.target.value)}
          placeholder="Total Beds"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
      </div>
    </div>
  ) : null;
};

export default HospitalModal;
