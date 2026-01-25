import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import api from "../../api/api";
// Backend URL (local + production safe)
const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://fitness-management-system-yl6n.onrender.com";


const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        setLoading(true);
        setError(false);

        console.log("📥 Fetching trainer profile...");
        const res = await api.get("/trainer/profile");

        console.log("✅ Trainer profile response:", res.data);

        if (!res?.data?.trainer) {
          throw new Error("Trainer not found in response");
        }

        setTrainer(res.data.trainer);
      } catch (err) {
        console.error("❌ Trainer profile fetch failed:", err.message);
        console.error("📋 Error details:", err.response?.data || err);
        setError(true);
        setTrainer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerProfile();
  }, []);

  // =====================
  // Error UI
  // =====================
  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold">
        Failed to load trainer dashboard
      </div>
    );
  }

  return (
    <>
      {/* ===================== */}
      {/* DASHBOARD HEADER */}
      {/* ===================== */}
      <div className="mb-8 sm:mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white px-4 sm:px-6 py-5">

          {/* Profile */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={
                  trainer?.profileImage
                    ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
                    : "/default-avatar.png"
                }
                alt="Trainer"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-blue-500"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />

              {/* Online status */}
              <span className="absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-green-500 ring-2 ring-white" />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Welcome back,{" "}
                <span className="text-blue-600">
                  {trainer?.user?.name || "Trainer"}
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Manage your clients efficiently
              </p>

            </div>
          </div>

          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Active Trainer
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* DASHBOARD ACTION CARDS */}
      {/* ===================== */}
      <div className="mb-4 sm:mb-6 mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-1">

        {[
          { to: "profile", label: "Update Profile" },
          { to: "users-approve", label: "Clients Approvals" },
          { to: "trainer-users", label: "All Clients" },
          { to: "workout", label: "Assign Workout" },
          { to: "nutrition", label: "Assign Nutrition" },
          { to: "user-progress", label: "Monitor Progress" },
          { to: "trainer-feedback", label: "Feedback" },
          { to: "trainer-earnings", label: "Earnings" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm
                   transition-all hover:-translate-y-0.5 hover:shadow-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
              {item.label}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {item.label}
            </p>
          </Link>
        ))}
      </div>

      {/* ===================== */}
      {/* DYNAMIC CONTENT AREA */}
      {/* ===================== */}
      <div className="min-h-[300px] rounded-2xl bg-white p-4 sm:p-6 shadow">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm sm:text-base">
            Loading dashboard content...
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </>


  );
};

export default TrainerDashboard;
