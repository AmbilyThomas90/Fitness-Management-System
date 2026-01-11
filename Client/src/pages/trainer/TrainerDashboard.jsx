// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";
//
// pages/trainer/TrainerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const TrainerDashboard = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">

      {/* Global Navbar */}
      <Navbar />
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        Trainer Dashboard
      </h1>


      {/* Dashboard Cards pushed to bottom */}
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Update Profile */}
        <Link
          to="/trainer/profile"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
          
        </Link>

        {/* View Assigned Users */}
        <Link
          to="/trainer/users"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">View Assigned Clients</h2>

        </Link>

        {/* Assign Workout & Nutrition */}
        <Link
          to="/trainer/assign-plan"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Assign Workout & Nutrition
          </h2>

        </Link>

        {/* Monitor Client Progress */}
        <Link
          to="/trainer/progress"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Monitor Progress</h2>

        </Link>

        {/* Suggest Changes */}
        <Link
          to="/trainer/suggestions"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Suggest Changes</h2>

        </Link>

        {/* Client Feedback */}
        <Link
          to="/trainer/feedback"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Client Feedback</h2>

        </Link>

      </div>
    </div>

  );
};

export default TrainerDashboard;
