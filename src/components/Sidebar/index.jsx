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
        <div className="w-64 bg-blue-500 text-white min-h-screen">
            {/* Name Section */}
            <div className="text-center bg-blue-600 px-4 py-6">
                <h1 className="text-2xl font-bold">Pharmacy Admin</h1>
            </div>

            {/* Tabs */}
            <nav className="h-full p-4">
                <ul className="flex flex-col space-y-2">
                    <li>
                        <a
                            href="/Pharmacy"
                            className={`block p-3 rounded-lg ${path === '/Pharmacy' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaHome className="inline mr-2" /> Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/PharmacyInventory"
                            className={`block p-3 rounded-lg ${path === '/PharmacyInventory' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaBox className="inline mr-2" /> Inventory
                        </a>
                    </li>
                    <li>
                        <a
                            href="/PharmacyReports"
                            className={`block p-3 rounded-lg ${path === '/PharmacyReports' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaChartLine className="inline mr-2" /> Reports
                        </a>
                    </li>
                    <li>
                        <a
                            href="/PharmacyNotifications"
                            className={`block p-3 rounded-lg ${path === '/PharmacyNotifications' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaBell className="inline mr-2" /> Notifications
                        </a>
                    </li>
                    <li>
                        <a
                            href="/PharmacySettings"
                            className={`block p-3 rounded-lg ${path === '/PharmacySettings' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaCog className="inline mr-2" /> Settings
                        </a>
                    </li>
                    <li>
                        <a
                            href="/PharmacyHelp"
                            className={`block p-3 rounded-lg ${path === '/PharmacyHelp' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-400 transition`}
                        >
                            <FaQuestionCircle className="inline mr-2" /> Help
                        </a>
                    </li>
                    <li>
                        <a
                            href="/AdminHome"
                            className={`block p-3 rounded-lg border-blue-400 bg-blue-600 text-white hover:bg-blue-400 transition`}
                            onClick={handleLogout}
                        >
                            <CiLogout className="inline mr-2 text-xl" /> Admin Page
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className={`block p-3 rounded-lg border-2 border-red-400 bg-red-400 text-white hover:bg-red-500 transition`}
                            onClick={handleLogout}
                        >
                            <CiLogout className="inline mr-2 text-xl" /> Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
