import { useEffect, useState } from "react";
import api from "../../api/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

  if (loading) return <p>Loading trainers...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Trainer Management</h2>

      <div className="space-y-4">
        {trainers.map((trainer) => {
          // ✅ Define avatarSrc inside the map callback
          const avatarSrc = trainer?.profileImage
            ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
            : "/default-avatar.png";

          return (
            <div
              key={trainer._id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              {/* Trainer Info */}
              <div className="flex items-start gap-4">
                <img
                  src={avatarSrc}
                  alt={trainer?.user?.name || "Trainer"}
                  className="w-20 h-20 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <div>
                  <p className="font-semibold">Name: {trainer.user?.name}</p>
                  <p>Email: {trainer.user?.email}</p>
                  <p>Phone: {trainer.phoneNumber}</p>
                  <p>Specialization: {trainer.specialization}</p>
                  <p>Experience: {trainer.experience} yrs</p>

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      trainer.status === "active"
                        ? "bg-green-100 text-green-700"
                        : trainer.status === "inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {trainer.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {trainer.status !== "active" && (
                  <button
                    onClick={() => updateStatus(trainer._id, "active")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                )}

                {trainer.status === "active" && (
                  <button
                    onClick={() => updateStatus(trainer._id, "inactive")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
