import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const TrainerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content Area */}
      <div className="p-6">
        <Outlet /> {/* Child pages load HERE */}
      </div>

    </div>
  );
};

export default TrainerLayout;
