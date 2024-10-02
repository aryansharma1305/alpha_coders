"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Ensure Firebase Firestore and auth are imported
import { useRouter } from "next/navigation"; // Use for redirection
import Navbar from '@/components/Navbar'; // Assuming you have a Navbar component
import Footer from '@/components/Footer'; // Assuming you have a Footer component
import { signOut } from "firebase/auth";

export default function DoctorDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDoctors = async (specialization) => {
    try {
      const doctorsQuery = query(
        collection(db, "doctors"),
        where("specialization", "==", specialization)
      );
      const querySnapshot = await getDocs(doctorsQuery);
      const doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAppointments = async (specialization) => {
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("department", "==", specialization)
      );
      const querySnapshot = await getDocs(appointmentsQuery);
      const appointmentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const storedSpecialization = localStorage.getItem("userDepartment");

    if (!storedSpecialization) {
      return;
    }

    setSpecialization(storedSpecialization);

    const fetchData = async () => {
      await fetchDoctors(storedSpecialization);
      await fetchAppointments(storedSpecialization);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push("/DoctorSignIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateTo = (section) => {
    if (section === "home") {
      router.push("/"); // Redirect to Home
    } else if (section === "appointments") {
      // Only show appointments for this department
      setLoading(true);
      fetchAppointments(specialization).then(() => setLoading(false));
    } else if (section === "doctors") {
      // Only show doctors for this department
      setLoading(true);
      fetchDoctors(specialization).then(() => setLoading(false));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 bg-gray-50 pt-20"> {/* Added padding-top to avoid overlap */}
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white p-6 min-h-screen">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li><a href="#" onClick={() => navigateTo("home")} className="block hover:text-gray-300">Home</a></li>
            <li><a href="#" onClick={() => navigateTo("appointments")} className="block hover:text-gray-300">Appointments</a></li>
            <li><a href="#" onClick={() => navigateTo("doctors")} className="block hover:text-gray-300">Doctors</a></li>
            <li>
              <a href="/PrescriptionPage" className="block hover:text-gray-300">Prescription</a></li>

          </ul>

          <div className="absolute bottom-10">
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-10 bg-white">
          <h1 className="text-3xl font-bold mb-8">Doctor Dashboard - {specialization} Department</h1>

          {/* Doctors List */}
          {doctors.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Doctors in {specialization} Department</h2>
              <ul className="list-disc ml-6 space-y-2">
                {doctors.map((doctor) => (
                  <li key={doctor.id} className="bg-gray-100 shadow-md p-4 rounded-lg">
                    <p className="font-bold">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Appointments List */}
          {appointments.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Appointments for {specialization} Department</h2>
              <table className="w-full border-collapse border border-gray-300 shadow-md rounded-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2 text-left">Patient Name</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="odd:bg-white even:bg-gray-100">
                      <td className="border px-4 py-2">{appointment.name}</td>
                      <td className="border px-4 py-2">{appointment.time}</td>
                      <td className="border px-4 py-2">{appointment.date}</td>
                      <td className="border px-4 py-2">{appointment.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No data available */}
          {doctors.length === 0 && appointments.length === 0 && (
            <div>
              <p className="text-gray-500">No doctors or appointments found in this department.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
