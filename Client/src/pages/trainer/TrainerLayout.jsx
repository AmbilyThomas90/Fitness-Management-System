import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const TrainerLayout = () => {
  return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content Area */}
          <div className="p-6 bg-gray-900 text-white">
        <Outlet /> {/* Child pages load HERE */}
      </div>

    </div>
  );
};

export default TrainerLayout;
