import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const UserWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    try {
      const res = await api.get("/user/workouts");
      setWorkouts(res.data.workouts || []);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  //  STATUS UPDATE HANDLER
const handleStatusUpdate = async (workoutId, currentStatus) => {
  try {
    const newStatus = currentStatus === "COMPLETED" ? "ACTIVE" : "COMPLETED";

    //  Correct URL, no quotes
await api.patch(`/user/work/${workoutId}/status`, { status: newStatus });

    // Optimistic UI update
    setWorkouts((prev) =>
      prev.map((w) =>
        w._id === workoutId ? { ...w, status: newStatus } : w
      )
    );
  } catch (error) {
    console.error("Status update failed:", error);
    alert("Failed to update workout status");
  }
};


 if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-4xl">🏋️</span> My Workouts
      </h2>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg italic">
            No workouts assigned yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((w) => (
            <div
              key={w._id}
              className="bg-gradient-to-br from-blue-800 via-blue-100 to-indigo-400 rounded-2xl shadow-lg p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full">
                  {w.category}
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(w.startDate).toLocaleDateString()}
                </span>
              </div>

              {/* Status + Button */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    w.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {w.status}
                </span>

                <button
                  onClick={() => handleStatusUpdate(w._id, w.status)}
                  className={`text-xs px-4 py-1.5 rounded-lg font-semibold ${
                    w.status === "COMPLETED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {w.status === "COMPLETED"
                    ? "Mark Active"
                    : "Mark Completed"}
                </button>
              </div>

              {/* Exercises */}
              <ul className="space-y-3">
                {w.exercises?.map((ex, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-xl border p-3 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">{ex.name}</p>
                      <span className="text-xs text-blue-600 uppercase">
                        {ex.category}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-700 grid grid-cols-2 gap-2">
                      <span>Sets: {ex.sets || "-"}</span>
                      <span>Reps: {ex.reps || "-"}</span>
                      {ex.duration && <span>Duration: {ex.duration}</span>}
                      {ex.rest && <span>Rest: {ex.rest}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
<Link
  to="/exercise"
  className="font-semibold hover:text-blue-600 transition"
>
  
</Link>
    </div>
  );
};

export default UserWorkouts;
