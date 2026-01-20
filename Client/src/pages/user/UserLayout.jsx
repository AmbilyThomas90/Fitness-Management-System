import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; 
import Navbar from "../../components/Navbar";

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-gray-800 overflow-hidden">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar is now defined because of the import above */}
        <Navbar /> 

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> 
          
        </main>
        
      </div>
      
    </div>
  );
};

export default UserLayout;