import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./common/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-2xl font-bold hover:cursor-pointer" style={{color: "#1a7dc3"}} onClick={() => navigate("/")}>TaskMaster</h1>
        <nav>
          
          <button
            onClick={() => navigate("/login")}
            className="text-[#1a7dc3] font-semibold py-1.5 px-4 border-2 border-[#1a7dc3] rounded-xl shadow mx-2 hover:bg-[#1a7dc3] hover:text-white duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#1a7dc3] hover:bg-[#166ca9] active:bg-[#1a7dc3] text-white font-semibold py-2 px-4 rounded-xl shadow transition duration-300"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 flex-grow bg-gray-50 ">
        <div className="md:w-1/3 mb-12 md:mb-0 m-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Organize your day
            <div className="mt-4">with <span style={{color: "#1a7dc3"}}>TaskMaster</span></div>
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            A simple, powerful Todo app to manage your tasks, stay productive, 
            and never forget anything important again.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#1a7dc3] hover:bg-[#166ca9] active:bg-[#1a7dc3] text-white font-semibold py-3 px-6 rounded-xl shadow transition duration-300"
          >
            Get Started Free
          </button>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 m-10">
          <img
            src="/image.png"
            alt="App Preview"
            className="w-full h-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-8">
        <h3 className="text-3xl font-bold text-center mb-12" style={{color: "#1a7dc3"}}>Features</h3>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="text-center bg-opacity-95 px-10 py-10 rounded-3xl ml-20 duration-200 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
            <h4 className="text-xl font-semibold mb-2" style={{color: "#1a7dc3"}}>Fast & Simple</h4>
            <p className="text-gray-400" >Add, edit, and delete tasks in a snap with a clean and intuitive UI.</p>
          </div>
          
          <div className="text-center  bg-opacity-95 px-10 py-10 rounded-3xl mr-20 duration-200 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
            <h4 className="text-xl font-semibold mb-2" style={{color: "#1a7dc3"}}>Sync Across Devices</h4>
            <p className="text-gray-400">Access your tasks anytime, anywhere — on desktop or mobile.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;
