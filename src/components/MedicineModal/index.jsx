import { useState, useEffect } from 'react';

const MedicineModal = ({ isOpen, onClose, onSave, medicine }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [group, setGroup] = useState('');

  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setQuantity(medicine.quantity);
      setGroup(medicine.group);
    } else {
      setName('');
      setQuantity('');
      setGroup('');
    }
  }, [medicine]);

  const handleSave = () => {
    const newMedicine = {
      name,
      quantity: Number(quantity),
      group
    };
    onSave(newMedicine);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{medicine ? 'Edit Medicine' : 'Add Medicine'}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medicine Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="Group"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
      </div>
    </div>
  ) : null;
};

export default MedicineModal;
