"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserName && storedUserEmail) {
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
      if(storedUserEmail === "admin@admin.com"){
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    router.push('/SignIn');
  };

  return (
    <nav className="backdrop-blur-lg bg-opacity-25 p-4 fixed w-screen z-20 border-blue-200 shadow-lg">
      <div className="container flex justify-between items-center">
        <h1 className="text-blue-800 text-3xl font-bold">OPD System</h1>
        <div className="flex gap-4 items-center font-semibold">
          <a className="text-black hover:underline" href="/">Home</a>
          <a className="text-black hover:underline" href="/Appointment">Appointment</a>

          {userName ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white bg-blue-700 hover:bg-blue-600 rounded-lg p-2 flex items-center gap-2 capitalize"
              >
                {userName}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4 text-gray-700">
                    <p className='text-xl font-bold capitalize'>{userName},</p>
                    <p className="text-sm font-semibold">{userEmail}</p>
                  </div>
                  {isAdmin && (
                    <a
                      href="/AdminHome"
                      className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a className="text-gray-100 bg-blue-700 hover:bg-blue-600 rounded-lg p-2 px-4 border-2 border-blue-400 transition" href="/SignIn">Sign In</a>
          )}
        </div>
      </div>
    </nav>
  );
}
