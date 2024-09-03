// components/HospitalModal.js
import { useState } from 'react';

const HospitalModal = ({ isOpen, onClose, onSave, hospital }) => {
  const [name, setName] = useState(hospital ? hospital.name : '');

  const handleSave = () => {
    onSave({ ...hospital, name });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{hospital ? 'Edit Hospital' : 'Add Hospital'}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hospital Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
      </div>
    </div>
  ) : null;
};

export default HospitalModal;
