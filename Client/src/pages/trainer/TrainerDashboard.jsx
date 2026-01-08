import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const TrainerDashboard = () => {

   const navigate = useNavigate();

 

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Global Navbar */}
      <Navbar />
        {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Trainer Dashboard
      </h1>

      
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total Clients</h3>
          <p className="text-blue-500 text-xl">18</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Monthly Earnings</h3>
          <p className="text-green-500 text-xl">₹25,000</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Active Plans</h3>
          <p className="text-purple-500 text-xl">12</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Messages</h3>
          <p className="text-red-500 text-xl">5 New</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
