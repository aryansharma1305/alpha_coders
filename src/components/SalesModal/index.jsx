import { useState, useEffect } from 'react';

export default function SalesModal({ isOpen, onClose, onSave, medicines, sales }) {
  const [date, setDate] = useState('');
  const [medicine, setMedicine] = useState('');
  const [quantity, setQuantity] = useState('');
  const [total, setTotal] = useState('');

  // If sales data is passed, prefill the form fields with the existing sales data for editing
  useEffect(() => {
    if (sales) {
      setDate(sales.date);
      setMedicine(sales.medicine);
      setQuantity(sales.quantity);
      setTotal(sales.total);
    } else {
      // If no sales data is passed (i.e., adding a new sale), reset the form fields
      setDate('');
      setMedicine('');
      setQuantity('');
      setTotal('');
    }
  }, [sales]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ date, medicine, quantity: parseInt(quantity), total: parseFloat(total) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{sales ? 'Edit Sale' : 'Add Sale'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Medicine</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              required
            >
              <option value="" disabled>Select a medicine</option>
              {medicines.map((med) => (
                <option key={med.id} value={med.name}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Total ($)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
