import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import api from "../../api/api";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrainerProfile = async () => {
  try {
    setLoading(true);
    setError(false);

    const res = await api.get("/trainer/profile");

    if (!res?.data?.trainer) {
      throw new Error("Trainer not found");
    }

    setTrainer(res.data.trainer);
  } catch (err) {
    console.error("Trainer profile fetch failed:", err);
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
  <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] shadow-lg">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white px-6 py-5">

      {/* Profile */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={
              trainer?.profileImage
                ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
                : "/default-avatar.png"
            }
            alt="Trainer"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-500"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />

          {/* Online status */}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back,{" "}
            <span className="text-blue-600">
              {trainer?.user?.name || "Trainer"}
            </span>
          </h1>
          <p className="text-sm text-gray-500">
              Manage Your clients & workouts
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
  <div className="mb-10 mx-auto max-w-5xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

  {[
    { to: "profile", label: "Update Profile" },
    { to: "users-approve", label: "Clients Approvals" },
    { to: "trainer-users", label: "All Clients" },
    { to: "workout", label: "Assign Workout" },
    { to: "progress", label: "Monitor Progress" },
    { to: "suggestions", label: "Suggestions" },
    { to: "feedback", label: "Feedback" }
  ].map((item) => (
    <Link
      key={item.to}
      to={item.to}
      className="group rounded-lg border bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
        {item.label}
      </h3>

      <p className="mt-0.5 text-xs text-gray-500">
        Manage {item.label.toLowerCase()}
      </p>
    </Link>
  ))}
</div>


  {/* ===================== */}
  {/* DYNAMIC CONTENT AREA */}
  {/* ===================== */}
  <div className="min-h-[300px] rounded-2xl bg-white p-6 shadow">
    {loading ? (
      <div className="flex items-center justify-center py-20 text-gray-500">
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
