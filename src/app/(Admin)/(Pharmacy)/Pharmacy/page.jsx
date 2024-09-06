"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { MdOutlineGppGood } from "react-icons/md";
import { GiMedicines, GiMoneyStack  } from "react-icons/gi";
import { AiFillMedicineBox } from "react-icons/ai";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';

export default function PharmacyManagement() {
  const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
  const [hospitalNames, setHospitalNames] = useState([]);
  const [hospitalData, setHospitalData] = useState({
    medicinesAvailable: 'N/A',
    shortages: 'N/A',
    inventoryStatus: 'Unavailable',
    revenue: 'N/A',
  });
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]); // Added state for sales data
  const [lastVisibleMedicine, setLastVisibleMedicine] = useState(null);
  const [lastVisibleUser, setLastVisibleUser] = useState(null);
  const [lastVisibleSale, setLastVisibleSale] = useState(null); // Added state for last visible sale

  useEffect(() => {
    const fetchHospitals = async () => {
      const hospitalsRef = collection(db, 'hospitals');
      const hospitalsSnapshot = await getDocs(hospitalsRef);
      const names = hospitalsSnapshot.docs.map(doc => doc.id);
      setHospitalNames(names);
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (selectedHospital === 'All Hospitals') {
        let totalMedicinesAvailable = 0;
        let totalShortages = 0;
        let totalRevenue = 0;
        let allStatuses = [];

        const hospitalsRef = collection(db, 'hospitals');
        const hospitalsSnapshot = await getDocs(hospitalsRef);

        for (const doc of hospitalsSnapshot.docs) {
          const medicinesRef = collection(db, `hospitals/${doc.id}/medicines`);
          const salesRef = collection(db, `hospitals/${doc.id}/sales`);

          const [medicinesSnapshot, salesSnapshot] = await Promise.all([
            getDocs(medicinesRef),
            getDocs(salesRef),
          ]);

          const medicinesAvailable = medicinesSnapshot.docs.length;
          const shortages = medicinesSnapshot.docs.filter(doc => doc.data().quantity < 10).length;
          const revenue = salesSnapshot.docs.reduce((acc, sale) => acc + parseFloat(sale.data().total), 0);

          totalMedicinesAvailable += medicinesAvailable;
          totalShortages += shortages;
          totalRevenue += revenue;

          allStatuses.push(
            shortages > 20 ? 'Very Bad' :
            shortages > 10 ? 'Bad' : 'Good'
          );
        }

        const inventoryStatus = allStatuses.includes('Very Bad') && allStatuses.includes('Good')
          ? 'Varied'
          : allStatuses.includes('Very Bad') 
          ? 'Very Bad'
          : allStatuses.includes('Bad')
          ? 'Bad'
          : 'Good';

        setHospitalData({
          medicinesAvailable: totalMedicinesAvailable,
          shortages: totalShortages,
          inventoryStatus,
          revenue: `$${totalRevenue.toFixed(2)}`,
        });
      } else {
        const medicinesRef = collection(db, `hospitals/${selectedHospital}/medicines`);
        const salesRef = collection(db, `hospitals/${selectedHospital}/sales`);

        const [medicinesSnapshot, salesSnapshot] = await Promise.all([
          getDocs(medicinesRef),
          getDocs(salesRef)
        ]);

        const medicinesAvailable = medicinesSnapshot.docs.length;
        const shortages = medicinesSnapshot.docs.filter(doc => doc.data().quantity < 10).length;
        const revenue = salesSnapshot.docs.reduce((acc, sale) => acc + parseFloat(sale.data().amount), 0).toFixed(2);

        const inventoryStatus = shortages > 20 ? 'Very Bad' :
                                shortages > 10 ? 'Bad' :
                                'Good';

        setHospitalData({
          medicinesAvailable,
          shortages,
          inventoryStatus,
          revenue: `$${revenue}`
        });
      }

      // Fetch initial medicines, users, and sales data
      fetchMedicines();
      fetchUsers();
      fetchSales(); // Added to fetch sales data
    };

    fetchHospitalData();
  }, [selectedHospital]);

  const fetchMedicines = async () => {
    try {
      let aggregatedMedicines = [];
  
      if (selectedHospital === "All Hospitals") {
        const hospitalsRef = collection(db, 'hospitals');
        const hospitalsSnapshot = await getDocs(hospitalsRef);
        const hospitalIds = hospitalsSnapshot.docs.map(doc => doc.id);
  
        for (const hospitalId of hospitalIds) {
          const medicinesRef = collection(db, `hospitals/${hospitalId}/medicines`);
          const medicinesQuery = query(medicinesRef, orderBy('name'), limit(10));
          const medicinesSnapshot = await getDocs(medicinesQuery);
  
          const medicinesList = medicinesSnapshot.docs.map(doc => ({ id: doc.id, hospitalId, ...doc.data() }));
          aggregatedMedicines = [...aggregatedMedicines, ...medicinesList];
        }
  
      } else {
        const medicinesRef = collection(db, `hospitals/${selectedHospital}/medicines`);
        const medicinesQuery = query(medicinesRef, orderBy('name'), limit(10));
        const medicinesSnapshot = await getDocs(medicinesQuery);
  
        aggregatedMedicines = medicinesSnapshot.docs.map(doc => ({ id: doc.id, hospitalId: selectedHospital, ...doc.data() }));
        setLastVisibleMedicine(medicinesSnapshot.docs[medicinesSnapshot.docs.length - 1]);
      }
  
      setMedicines(aggregatedMedicines);
      
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchUsers = async () => {
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('name'), limit(10));
    const usersSnapshot = await getDocs(usersQuery);

    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersList);
    setLastVisibleUser(usersSnapshot.docs[usersSnapshot.docs.length - 1]);
  };

  const fetchSales = async () => {
    try {
      let aggregatedSales = [];
  
      if (selectedHospital === "All Hospitals") {
        const hospitalsRef = collection(db, 'hospitals');
        const hospitalsSnapshot = await getDocs(hospitalsRef);
        const hospitalIds = hospitalsSnapshot.docs.map(doc => doc.id);
  
        for (const hospitalId of hospitalIds) {
          const salesRef = collection(db, `hospitals/${hospitalId}/sales`);
          const salesQuery = query(salesRef, orderBy('date'), limit(10));
          const salesSnapshot = await getDocs(salesQuery);
  
          const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, hospitalId, ...doc.data() }));
          aggregatedSales = [...aggregatedSales, ...salesList];
        }
  
      } else {
        const salesRef = collection(db, `hospitals/${selectedHospital}/sales`);
        const salesQuery = query(salesRef, orderBy('date'), limit(10));
        const salesSnapshot = await getDocs(salesQuery);
  
        aggregatedSales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLastVisibleSale(salesSnapshot.docs[salesSnapshot.docs.length - 1]);
      }
  
      setSales(aggregatedSales);
      
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const loadMoreMedicines = async () => {
    const medicinesRef = collection(db, `hospitals/${selectedHospital}/medicines`);
    const medicinesQuery = query(medicinesRef, orderBy('name'), startAfter(lastVisibleMedicine), limit(10));
    const medicinesSnapshot = await getDocs(medicinesQuery);

    const medicinesList = medicinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMedicines([...medicines, ...medicinesList]);
    setLastVisibleMedicine(medicinesSnapshot.docs[medicinesSnapshot.docs.length - 1]);
  };

  const loadMoreUsers = async () => {
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('name'), startAfter(lastVisibleUser), limit(10));
    const usersSnapshot = await getDocs(usersQuery);

    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers([...users, ...usersList]);
    setLastVisibleUser(usersSnapshot.docs[usersSnapshot.docs.length - 1]);
  };

  const loadMoreSales = async () => {
    const salesRef = collection(db, `hospitals/${selectedHospital}/sales`);
    const salesQuery = query(salesRef, orderBy('date'), startAfter(lastVisibleSale), limit(10));
    const salesSnapshot = await getDocs(salesQuery);

    const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSales([...sales, ...salesList]);
    setLastVisibleSale(salesSnapshot.docs[salesSnapshot.docs.length - 1]);
  };

  const handleHospitalChange = (e) => {
    setSelectedHospital(e.target.value);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center bg-blue-500 p-6">
          <h1 className='text-3xl font-semibold'>Pharmacy Management Dashboard</h1>
          <div className="flex items-center">
            <p className='text-lg font-bold mr-2'>Selected Hospital:</p>
            <select value={selectedHospital} onChange={handleHospitalChange} className="p-2 border border-gray-300 rounded">
              <option value="All Hospitals">All Hospitals</option>
              {hospitalNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Hospital Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-400 p-4 rounded flex flex-col justify-center items-center">
              <MdOutlineGppGood className="text-white text-7xl mb-2" />
              <h3 className="text-xl font-bold">Medicines Available</h3>
              <p>{hospitalData.medicinesAvailable}</p>
            </div>
            <div className="bg-red-400 p-4 rounded flex flex-col justify-center items-center">
              <AiFillMedicineBox className="text-white text-7xl mb-2" />
              <h3 className="text-xl font-bold">Shortages</h3>
              <p>{hospitalData.shortages}</p>
            </div>
            <div className="bg-yellow-400 p-4 rounded flex flex-col justify-center items-center">
              <GiMedicines className="text-white text-7xl mb-2" />
              <h3 className="text-xl font-bold">Inventory Status</h3>
              <p>{hospitalData.inventoryStatus}</p>
            </div>
            <div className="bg-blue-400 p-4 rounded flex flex-col justify-center items-center">
              <GiMoneyStack className="text-white text-7xl mb-2"/>
              <h3 className="text-xl font-bold">Total Revenue</h3>
              <p>{hospitalData.revenue}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between gap-4">
          <div className="mb-6 border-2 rounded-lg p-4 w-full">
            <h2 className="text-xl font-semibold">Medicines</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Quantity</th>
                  <th className="py-2 px-4 border-b text-left">Group</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(medicine => (
                  <tr key={medicine.id}>
                    <td className="py-2 px-4 border-b">{medicine.name}</td>
                    <td className="py-2 px-4 border-b">{medicine.quantity}</td>
                    <td className="py-2 px-4 border-b">{medicine.group}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {medicines.length > 10 && (
              <button onClick={loadMoreMedicines} className="mt-4 p-2 bg-blue-500 text-white rounded">Load More Medicines</button>
            )}
          </div>

          <div className="mb-6 border-2 rounded-lg p-4 w-full">
            <h2 className="text-xl font-semibold">Users</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length > 10 && (
              <button onClick={loadMoreUsers} className="mt-4 p-2 bg-blue-500 text-white rounded">Load More Users</button>
            )}
          </div>
        </div>
        
        
        <div className="mb-6  border-2 rounded-lg p-4 w-full">
          <h2 className="text-xl font-semibold">Sales</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Medicine</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Hospital ID</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td className="py-2 px-4 border-b">{sale.date}</td>
                  <td className="py-2 px-4 border-b">{sale.medicine}</td>
                  <td className="py-2 px-4 border-b">${sale.total}</td>
                  <td className="py-2 px-4 border-b">{sale.hospitalId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length > 10 && (
            <button onClick={loadMoreSales} className="mt-4 p-2 bg-blue-500 text-white rounded">Load More Sales</button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
