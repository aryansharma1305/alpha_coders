// pages/index.js
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Navbar />
    <div className=" bg-blue-400 text-gray-900">
      {/* Main Section */}
      <main className="relative flex flex-row justify-center items-center h-screen">
        <div className="">
        <Image src={"/assets/herobg.webp"} alt={"background"} width={540} height={450}/>
        </div>
        <div className="relative text-center p-4 w-1/2">
          <h1 className="text-5xl font-bold mb-4 text-black">Welcome to the <span className="text-white">OPD System</span></h1>
          <p className="text-lg mb-8 text-black">
            Experience seamless and efficient outpatient care. Our system helps you manage appointments with ease, ensuring you receive the best healthcare possible.
          </p>
          <a href="/Appointment" className="inline-block border-2 border-blue-400 shadow-md bg-blue-700 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center flex justify-between items-center">
        <img src="/assets/decision.png" alt="The Right Decision" className=" object-cover mb-4 rounded-md" />
        <div className="">
          <h2 className="text-4xl font-bold mb-4">The Right Decision at the Right Time</h2>
          <p className="text-lg mb-8">
            Your health is our priority. By making timely appointments, you ensure that potential issues are addressed before they become serious. Our dedicated team of healthcare professionals is committed to providing you with the best care possible, offering personalized attention to every detail.
          </p>
        </div>
        </div>
      </section>

      {/* One Appointment Away Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center flex justify-center items-center">
          <div className="">
            <h2 className="text-4xl font-bold mb-4">We're Just One Appointment Away</h2>
            <p className="text-lg mb-8">
            Our expert doctors and medical practitioners are just a click away. Whether you need a routine check-up or a specialized consultation, our team is here to assist you. Experience top-notch care and attention from the comfort of your home. Let us help you maintain your health and well-being with our comprehensive services.
          </p>
          </div>
          <img src="/assets/appointment2.png" alt="One Appointment Away" className="object-cover mb-4 rounded-md" />
        </div>
      </section>

      <div className="bg-white flex justify-center items-center p-24">
          <a href="/Appointment" className="inline-block bg-blue-500 text-white py-4 px-12 rounded-full text-2xl hover:bg-blue-600 hover:shadow-2xl transition">
            Book an Appointment 
          </a>
      </div>
    </div>
    </>
  );
}
