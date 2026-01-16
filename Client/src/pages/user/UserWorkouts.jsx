import React, { useEffect, useState } from "react";
import api from "../../api/api"; // Axios instance with baseURL & auth token

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

  if (loading) return <p className="text-center text-gray-500 mt-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
<div className="p-6 space-y-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
    <span className="text-4xl">🏋️</span> My Workouts
  </h2>

  {workouts.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg italic">No workouts assigned yet.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((w) => (
        <div
          key={w._id}
          className="bg-gradient-to-br from-blue-800 via-blue-100 to-indigo-400 rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
        >
          {/* Header: Category & Date */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 rounded-full shadow">
              {w.category}
            </span>
            <span className="text-xs text-gray-600">
              {new Date(w.startDate).toLocaleDateString()}
            </span>
          </div>

          {/* Exercises */}
          <div className="mb-2">
            <h3 className="text-md font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Exercises
            </h3>
            <ul className="space-y-2">
              {w.exercises.map((ex, idx) => (
                <li
                  key={idx}
                  className="text-sm text-black-800 bg-white px-3 py-2 rounded-lg border-l-4 border-blue-400 shadow-sm"
                >
                  <span className="font-semibold">{ex.name}</span>{" "}
                  <span className="text-xs text-blue-500 uppercase">({ex.category})</span>
                  <div className="text-xs text-black-800  mt-1">
                    Sets: {ex.sets}, Reps: {ex.reps}
                    {ex.duration && `, Duration: ${ex.duration}`}
                    {ex.rest && `, Rest: ${ex.rest}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* View Details Button */}
          <div className="mt-3 text-right">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow hover:scale-105 transition-transform">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


  );
};

export default UserWorkouts;
