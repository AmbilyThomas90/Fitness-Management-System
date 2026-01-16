import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/api";

const UserHome = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/user/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const { subscription, trainer, workoutsCompleted, unreadMessages } = data || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  

      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold">User Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Plan */}
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">
            Active Plan
          </h3>
          <p className="text-blue-600 text-xl font-bold">
            {subscription?.planName || "No Active Plan"}
          </p>
        </div>

        {/* Trainer */}
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">
            Your Trainer
          </h3>
          <p className="text-green-600 text-xl font-bold">
            {trainer?.name || "Not Assigned"}
          </p>
        </div>

        {/* Workouts */}
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">
            Workouts
          </h3>
          <p className="text-purple-600 text-xl font-bold">
            {workoutsCompleted ?? 0}
          </p>
        </div>

        {/* Messages */}
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">
            Messages
          </h3>
          <p className="text-red-600 text-xl font-bold">
            {unreadMessages ?? 0} New
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Plan Details</h2>
          {subscription ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Type:</span>
                <span className="font-medium capitalize">{subscription.planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₹{subscription.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="font-medium text-red-500">
                  {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No subscription details found.</p>
          )}
        </div>

       {/* Trainer Details */}
<div className="bg-white p-6 rounded-lg shadow">
  <h2 className="text-xl font-bold mb-4 border-b pb-2">
    Trainer Profile
  </h2>

  {trainer ? (
    <div className="space-y-4">
      {/* Name */}
      <div className="flex justify-between">
        <span className="text-gray-600">Name:</span>
        <span className="font-medium">
          {trainer.name || "N/A"}
        </span>
      </div>

      {/* Specialization */}
      <div className="flex justify-between">
        <span className="text-gray-600">Specialization:</span>
        <span className="font-medium">
          {trainer.specialization || "General Fitness"}
        </span>
      </div>

      {/* Status Badge */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Status:</span>

        {trainer.status === "active" && (
          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
            Waiting for Trainer Approval
          </span>
        )}

        {trainer.status === "approved" && (
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
            Approved
          </span>
        )}

        {trainer.status === "rejected" && (
          <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
            Rejected
          </span>
        )}

        {trainer.status === "completed" && (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
            Completed
          </span>
        )}
      </div>

      {/* Action Button */}
      <button
        disabled={trainer.status !== "approved"}
        className={`w-full mt-4 py-2 rounded text-white transition ${
          trainer.status === "approved"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Contact Trainer
      </button>
    </div>
  ) : (
    <p className="text-gray-500 italic">
      No trainer assigned to your profile yet.
    </p>
  )}
</div>


      </div>
    </div>
  );
};

export default UserHome;
