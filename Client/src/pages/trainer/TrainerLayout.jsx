import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const TrainerLayout = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col overflow-x-hidden">

      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content Area */}
      <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 bg-gray-900 text-white">
        {/* Center content for large screens without changing UI */}
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default TrainerLayout;
