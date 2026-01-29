import { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import api from "../../api/api";

// Backend URL (local + production safe)
const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://fitness-management-system-yl6n.onrender.com";


const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/trainers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainers(res.data.trainers);
    } catch (error) {
      console.error("Failed to load trainers", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (trainerId, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/admin/trainers/${trainerId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI instantly
      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer._id === trainerId ? { ...trainer, status } : trainer
        )
      );
    } catch (error) {
      console.error("Status update failed", error);
      alert("Action failed");
    }
  };

  if (loading)  {
return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
);
    }

  return (
<div className="p-2 sm:p-5 md:p-6">
  {/* Section Header */}
  <h2 className="flex items-center text-xl sm:text-2xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-4 gap-2">
    <FaUserTie className="w-5 h-5 text-blue-500" /> {/* Icon */}
    Trainer Management
  </h2>

  {/* Trainer List */}
  <div className="space-y-3">
    {trainers.map((trainer) => {
      const avatarSrc = trainer?.profileImage
        ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
        : "/default-avatar.png";

      return (
        <div
          key={trainer._id}
          className="
            flex flex-col md:flex-row justify-between items-start md:items-center
            border border-gray-200 dark:border-slate-700
            p-3 sm:p-4
            rounded-xl
            bg-white dark:bg-slate-800
            shadow-sm hover:shadow-md
            transition-all duration-300
          "
        >
          {/* Trainer Info */}
          <div className="flex items-start md:items-center gap-3">
            <img
              src={avatarSrc}
              alt={trainer?.user?.name || "Trainer"}
        className="w-16 h-20 sm:w-20 sm:h-25 rounded-full object-cover object-center border"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar.png";
              }}
            />

            <div className="flex flex-col gap-1 text-sm sm:text-base">
              <p className="font-semibold text-gray-900 dark:text-white">
                Name: {trainer.user?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Email: {trainer.user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Phone: {trainer.phoneNumber || "-"}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Specialization: {trainer.specialization || "-"}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Experience: {trainer.experience || 0} yrs
              </p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-2 sm:px-3 py-0.5 text-xs font-semibold rounded-full ${
                  trainer.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
                    : trainer.status === "inactive"
                    ? "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-600/20 dark:text-yellow-400"
                }`}
              >
                {trainer.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3 md:mt-0 text-sm sm:text-base">
            {trainer.status !== "active" && (
              <button
                onClick={() => updateStatus(trainer._id, "active")}
                className="bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition"
              >
                Activate
              </button>
            )}

            {trainer.status === "active" && (
              <button
                onClick={() => updateStatus(trainer._id, "inactive")}
                className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition"
              >
                Deactivate
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>


  );
};

export default Trainers;
