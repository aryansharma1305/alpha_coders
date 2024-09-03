// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-300 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start md:flex-row md:justify-between mt-12">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2 text-blue-900 underline">OPD System</h2>
            <p className="text-gray-900">Efficiently manage outpatient appointments with ease.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col mb-6">
            <p className='underline mb-2 text-black'>Links</p>
              <a className="text-gray-600 hover:text-blue-600 mb-2 md:mb-0 transition" href="/">Home</a>
              <a className="text-gray-600 hover:text-blue-600 mb-2 md:mb-0 transition" href="/Appointment">Appointment</a>
              <a className="text-gray-600 hover:text-blue-600 transition" href="/about">About</a>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col mb-6">
          <p className='underline mb-2 text-black'>Social Links</p>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-800 transition"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-800 transition"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-800 transition"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="text-center text-gray-800 mt-12">
          <p>&copy; {new Date().getFullYear()} OPD System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
