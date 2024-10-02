"use client"
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth, getUserData } from '@/lib/firebase';
import { onAuthStateChanged } from "firebase/auth";

export default function UserDashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchUserDetails = async () => {
          try {
            const userDoc = await getUserData(user.uid);
            if (userDoc) {
              setUserDetails(userDoc);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        const fetchAppointments = async () => {
          try {
            const q = query(collection(db, "appointments"), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            const appointmentsList = [];
            querySnapshot.forEach((doc) => {
              appointmentsList.push({ id: doc.id, ...doc.data() });
            });

            setAppointments(appointmentsList);
          } catch (error) {
            console.error('Error fetching appointments:', error);
          }
        };

        fetchUserDetails();
        fetchAppointments();
        setLoading(false);
      } else {
        router.push('/SignIn');
      }
    });

    return () => unsubscribe();
  }, [router, db]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      {/* Add padding or margin to create space below the fixed Navbar */}
      <div className="min-h-screen bg-gray-100 p-6 pt-24">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        {/* User Details */}
        {userDetails ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        {/* Appointment History */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Appointment History</h2>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border-b py-2">
                  <p><strong>Department:</strong> {appointment.department}</p>
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Condition:</strong> {appointment.condition}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointment history found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
