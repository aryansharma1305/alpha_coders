// components/Sidebar.js
"use client";
import { FaHome, FaBox, FaChartLine, FaCog, FaBell, FaQuestionCircle } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
    const path = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        router.push('/SignIn');
    };

    return (
        <div className="min-w-64 bg-gray-800 text-white h-screen flex flex-col">
            <div className="text-center bg-gray-900 px-4 py-6">
                <h1 className="text-2xl font-bold">Pharmacy Admin</h1>
            </div>
            <nav className="p-2 flex flex-col justify-between h-full">
                <ul className="flex flex-col space-y-2">
                    <li>
                        <a href="/Pharmacy" className={`block p-3 rounded-lg ${path === '/Pharmacy' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaHome className="inline mr-2" /> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/PharmacyInventory" className={`block p-3 rounded-lg ${path === '/PharmacyInventory' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaBox className="inline mr-2" /> Inventory
                        </a>
                    </li>
                    <li>
                        <a href="/PharmacyReports" className={`block p-3 rounded-lg ${path === '/PharmacyReports' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaChartLine className="inline mr-2" /> Reports
                        </a>
                    </li>
                    <li>
                        <a href="/PharmacyNotifications" className={`block p-3 rounded-lg ${path === '/PharmacyNotifications' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaBell className="inline mr-2" /> Notifications
                        </a>
                    </li>
                </ul>
                <ul className="flex flex-col space-y-2">
                    <li>
                        <a href="/PharmacySettings" className={`block p-3 rounded-lg ${path === '/PharmacySettings' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaCog className="inline mr-2" /> Settings
                        </a>
                    </li>
                    <li>
                        <a href="/PharmacyHelp" className={`block p-3 rounded-lg ${path === '/PharmacyHelp' ? 'bg-gray-900 border-b-2 border-blue-500' : 'bg-gray-800'} text-white hover:bg-gray-700 transition`}>
                            <FaQuestionCircle className="inline mr-2" /> Help
                        </a>
                    </li>
                    <li>
                        <a href="/AdminHome" className="block p-3 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition">
                            <CiLogout className="inline mr-2 text-xl" /> Admin Page
                        </a>
                    </li>
                    <li>
                        <a href="/" className="block p-3 rounded-lg text-red-400 bg-gray-800 hover:bg-red-500 hover:text-white transition" onClick={handleLogout}>
                            <CiLogout className="inline mr-2 text-xl" /> Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
