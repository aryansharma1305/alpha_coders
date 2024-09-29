// components/Footer.js
import { BsTwitterX, BsFacebook, BsInstagram  } from "react-icons/bs";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto px-4 py-6 flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col mt-12">
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-500 transition text-4xl"
            >
              <BsTwitterX />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-500 transition text-4xl"
            >
              <BsFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-500 transition text-4xl"
            >
              <BsInstagram /> 
            </a>
          </div>
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-6">
            <a className="text-gray-100 hover:text-gray-300 mb-2 md:mb-0 transition" href="/">Home</a>
            <a className="text-gray-100 hover:text-gray-300 mb-2 md:mb-0 transition" href="/Appointment">Appointment</a>
            <a className="text-gray-100 hover:text-gray-300 transition" href="/about">About</a>
        </div>
      </div>
      <div className="text-center text-gray-200 bg-gray-950 p-6">
          <p>&copy; {new Date().getFullYear()} OPD System. All rights reserved.</p>
      </div>
    </footer>
  );
}
