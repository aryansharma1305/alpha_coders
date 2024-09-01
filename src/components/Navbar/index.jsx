export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 fixed w-screen z-20 shadow-xl">
      <div className="container flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">OPD System</h1>
        <div className="flex gap-4 items-center font-semibold">
            <a className="text-white hover:underline" href="/">Home</a>
            <a className="text-white hover:underline" href="/Appointment">Appointment</a>
            <a className="text-gray-100 bg-purple-500 hover:bg-violet-500 rounded-lg p-2" href="/SignIn">Sign In</a>
        </div>
      </div>
    </nav>
  );
}
