"use client";
import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/components/PharmacySidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import SalesModal from '@/components/SalesModal';

import { MdDelete, MdEdit } from "react-icons/md";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export default function PharmacyReports() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [salesData, setSalesData] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [editingSale, setEditingSale] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch hospitals from Firebase
  useEffect(() => {
    async function fetchHospitals() {
      const hospitalDocs = await getDocs(collection(db, 'hospitals'));
      setHospitals(hospitalDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchHospitals();
  }, []);

  // Fetch sales and medicine data based on selected hospital
  useEffect(() => {
    async function fetchData() {
      let salesData = [];
      let medicineData = [];
  
      if (selectedHospital === 'all') {
        const hospitalsQuery = collection(db, 'hospitals');
        const hospitalsDocs = await getDocs(hospitalsQuery);
  
        for (let hospital of hospitalsDocs.docs) {
          const hospitalSalesQuery = collection(db, `hospitals/${hospital.id}/sales`);
          const hospitalMedicinesQuery = collection(db, `hospitals/${hospital.id}/medicines`);
  
          const salesDocs = await getDocs(hospitalSalesQuery);
          const medicinesDocs = await getDocs(hospitalMedicinesQuery);
  
          salesData = [...salesData, ...salesDocs.docs.map(doc => ({ id: doc.id, hospital: hospital.id, ...doc.data() }))];
          medicineData = [...medicineData, ...medicinesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
        }
      } else {
        const salesQuery = collection(db, `hospitals/${selectedHospital}/sales`);
        const medicinesQuery = collection(db, `hospitals/${selectedHospital}/medicines`);
  
        const salesDocs = await getDocs(salesQuery);
        const medicinesDocs = await getDocs(medicinesQuery);
  
        salesData = salesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        medicineData = medicinesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
  
      setSalesData(salesData);
      setMedicineData(medicineData);
    }
  
    fetchData();
  }, [selectedHospital]);
  

  // Prepare data for charts
  const dates = salesData.map(sale => sale.date);
  const totals = salesData.map(sale => sale.total);

  const salesByMedicine = medicineData.map(med => {
    const totalSales = salesData
      .filter(sale => sale.medicine === med.name)
      .reduce((sum, sale) => sum + sale.total, 0);
    return { name: med.name, totalSales };
  });

  const salesByMedicineData = {
    labels: salesByMedicine.map(item => item.name),
    datasets: [
      {
        label: 'Total Sales',
        data: salesByMedicine.map(item => item.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const medicineQuantityData = {
    labels: medicineData.map(med => med.name),
    datasets: [
      {
        data: medicineData.map(med => med.quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const salesOverTimeData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Sales',
        data: totals,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };
  
  const handleSave = async (newSale) => {
    if (selectedHospital) {
      const salesCollectionRef = collection(db, `hospitals/${selectedHospital}/sales`);
      
      try {
        if (editingSale) {
          // Update the existing sale
          const saleDocRef = doc(salesCollectionRef, editingSale.id);
          await setDoc(saleDocRef, newSale);
          
          // Update local state with the updated sale
          setSalesData(salesData.map(sale =>
            sale.id === editingSale.id ? { id: editingSale.id, ...newSale } : sale
          ));
        } else {
          // Create a new sale
          const salesSnapshot = await getDocs(salesCollectionRef);
          const maxId = salesSnapshot.docs.length
            ? Math.max(...salesSnapshot.docs.map(doc => Number(doc.id)))
            : 0;
          const newId = (maxId + 1).toString();
          const newSaleRef = doc(salesCollectionRef, newId);
          await setDoc(newSaleRef, newSale);
  
          // Add the newly created sale to local state
          setSalesData([...salesData, { id: newId, ...newSale }]);
        }
        
        // Close modal
        handleClose();
        setEditingSale(null);
      } catch (error) {
        console.error('Error saving sale:', error);
      }
    }
  };
  

  const handleDeleteSale = async (id) => {
    if (selectedHospital) {
      try {
        const saleRef = doc(db, `hospitals/${selectedHospital}/sales`, id);
        await deleteDoc(saleRef);
        setSalesData(salesData.filter(sale => sale.id !== id));
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const handleEditButtonClick = (sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };
  
  const handleNewSaleClick = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex top-0 w-full bg-blue-500 p-6 justify-between">
          <h1 className="text-3xl font-bold text-black">Pharmacy Management Report</h1>
          <div className='flex items-center'>
            <p className='text-md font-bold mr-2'>Selected Hospital:</p>
            <select
              className="border border-gray-300 rounded-lg p-2 text-black"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="all">All Hospitals</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {/* Sales Over Time Graph */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sales Over Time</h2>
            <div className="h-64">
              <Line data={salesOverTimeData} options={chartOptions} />
            </div>
          </div>

          {/* Sales by Medicine Graph */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sales by Medicine</h2>
            <div className="h-64">
              <Bar data={salesByMedicineData} options={chartOptions} />
            </div>
          </div>

          {/* Medicine Quantity Distribution Pie Chart */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Medicine Quantity Distribution</h2>
            <div className="h-64">
              <Pie data={medicineQuantityData} options={chartOptions} />
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white border border-gray-300 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-2">Sales Table</h2>
              {selectedHospital === "all" ? null : <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={handleNewSaleClick}
              >
                Add Sale
              </button>
              }
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Total ($)</th>
                  {selectedHospital === "all" ? <th className="p-2 text-left">Hospital</th> : null}
                  {selectedHospital === "all" ?  null : <th className="p-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {salesData.map(sale => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2">{sale.id}</td>
                    <td className="p-2">{sale.date}</td>
                    <td className="p-2">{sale.medicine}</td>
                    <td className="p-2">{sale.quantity}</td>
                    <td className="p-2">{sale.total}</td>
                    {selectedHospital === "all" ? <td className="p-2">{sale.hospital}</td> : null}
                    {selectedHospital === "all" ? null : <td className="p-2">
                      <button 
                        onClick={() => handleEditButtonClick(sale)}
                        className="bg-yellow-400 text-white p-2 rounded-lg mr-2"
                      >
                        <MdEdit className='text-xl' />
                      </button>
                      <button 
                        onClick={() => handleDeleteSale(sale.id)}
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        <MdDelete className='text-xl' />
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Modal */}
        {isModalOpen && (
            <SalesModal
              isOpen={isModalOpen}
              onClose={handleClose} // Pass the handleClose function
              onSave={handleSave} // Pass the handleSave function
              medicines={medicineData} // Pass medicines data to the modal
              sales={editingSale} // Pass editing sale data to the modal
            />
          )}
      </div>
    </div>
  );
}
