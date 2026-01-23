import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const UserHome = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/user/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // ✅ SAFE USER NAME RESOLUTION
  const userName =
    data?.user?.name ||
    data?.user?.username ||
    data?.name ||
    "User";

  const subscription = data?.subscription || null;
  const trainer = data?.trainer || null;

  return (
    <div className="min-h-screen bg-gray-800 p-6">

      {/* ===== Welcome Header ===== */}
      <div className="mb-6 mt-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg px-6 py-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            Welcome back,
            <span className="text-green-600">{userName}</span> 👋
          </h1>

          <p className="mt-3 max-w-xl text-sm sm:text-base font-semibold leading-relaxed tracking-wide
                        bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50
                        text-indigo-800
                        px-4 py-3
                        rounded-xl
                        border border-indigo-200
                        shadow-sm">
            Stay consistent. Stay strong. Your fitness journey continues here.
          </p>
        </div>
      </div>

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">Active Plan</h3>
          <p className="text-blue-600 text-xl font-bold mt-2">
            {subscription?.planName || "No Active Plan"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-500 text-xs uppercase">Your Trainer</h3>
          <p className="text-green-600 text-xl font-bold mt-2">
            {trainer?.name || "Not Assigned"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500 flex items-center">
          <button
            onClick={() => navigate("/user/workouts")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Your Workouts
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex items-center">
          <button
            onClick={() => navigate("/user/nutrition")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Your Nutrition
          </button>
        </div>
      </div>

  {/* ===== Plan & Trainer Details ===== */}
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
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Trainer Profile</h2>
      {trainer ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{trainer.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contact Number:</span>
            <span className="font-medium">{trainer.phoneNumber || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialization:</span>
            <span className="font-medium">{trainer.specialization || "General Fitness"}</span>
          </div>
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
          <button
  disabled={trainer.status !== "approved"}
  onClick={() => {
    if (trainer.status !== "approved") return;

    // WhatsApp number (replace with trainer.phoneNumber if available)
    const whatsappNumber = trainer.phoneNumber
      ? trainer.phoneNumber.replace(/\D/g, "") // remove non-numeric chars
      : "911234567890"; // fallback number

    const message = encodeURIComponent("Hello! I want to connect with you.");
    
    // Open WhatsApp: mobile-friendly
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;

    window.open(url, "_blank");
  }}
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
        <p className="text-gray-500 italic">No trainer assigned to your profile yet.</p>
      )}
    </div>

  </div>
</div>

  );
};

export default UserHome;
