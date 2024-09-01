// pages/index.js
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="bg-white text-gray-900">
      {/* Main Section */}
      <main className="relative flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/assets/bg.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl font-bold mb-4 text-white">Welcome to the OPD System</h1>
          <p className="text-lg mb-8 text-white">
            Experience seamless and efficient outpatient care. Our system helps you manage appointments with ease, ensuring you receive the best healthcare possible.
          </p>
          <a href="/Appointment" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition">
            Book an Appointment
          </a>
        </div>
      </main>

      {/* Appointment Made Easy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center flex flex-col justify-center items-center">
          <h2 className="text-7xl font-bold mb-4">Appointment Booking <span className="text-blue-500">Made Easy</span></h2>
          <img src="/assets/appointment.png" alt="Appointment Made Easy" className="object-cover mb-4 rounded-md"/>
          <p className="text-lg mb-8">
            With our user-friendly platform, scheduling your appointment has never been easier. Choose your preferred time slot and meet with your doctor at your convenience. Our streamlined process ensures quick and hassle-free bookings, so you can focus on what matters most—your health.
          </p>
          <a href="/Appointment" className="w-48 inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition">
            Get Started
          </a>
        </div>
      </section>

      {/* The Right Decision at the Right Time Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">The Right Decision at the Right Time</h2>
          <img src="/assets/decision.png" alt="The Right Decision" className=" object-cover mb-4 rounded-md" />
          <p className="text-lg mb-8">
            Your health is our priority. By making timely appointments, you ensure that potential issues are addressed before they become serious. Our dedicated team of healthcare professionals is committed to providing you with the best care possible, offering personalized attention to every detail.
          </p>
        </div>
      </section>

      {/* One Appointment Away Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">We're Just One Appointment Away</h2>
          <img src="/assets/appointment2.png" alt="One Appointment Away" className="object-cover mb-4 rounded-md" />
          <p className="text-lg mb-8">
            Our expert doctors and medical practitioners are just a click away. Whether you need a routine check-up or a specialized consultation, our team is here to assist you. Experience top-notch care and attention from the comfort of your home. Let us help you maintain your health and well-being with our comprehensive services.
          </p>
          <a href="/Appointment" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition">
            Get Started
          </a>
        </div>
      </section>
    </div>
    </>
  );
}
