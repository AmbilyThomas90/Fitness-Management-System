import React, { useEffect, useState } from "react";
import api from "../../api/api";

const goalOptions = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "endurance", label: "Endurance" },
  { value: "flexibility", label: "Flexibility" },
];

const statusOptions = ["active", "completed", "paused"];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState(goalOptions[0].value);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all goals for the logged-in user
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // Matches router.get("/", protect, getMyGoals)
        const res = await api.get("/goals"); 
        setGoals(res.data.goals || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load goals ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // Create a new goal
  const handleAddGoal = async () => {
    if (!newGoal) return;
    try {
      // Matches router.post("/create-goal", protect, createGoal)
      const res = await api.post("/goals/create-goal", { goalType: newGoal });
      setGoals((prev) => [...prev, res.data.goal]);
      setMessage("Goal added successfully ✅");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add goal ❌");
    }
  };

  // Update goal status
  const handleStatusChange = async (id, status) => {
    try {
      // Matches router.put("/:id", protect, updateGoal)
      const res = await api.put(`/goals/${id}`, { status });
      setGoals((prev) =>
        prev.map((goal) => (goal._id === id ? res.data.goal : goal))
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to update goal ❌");
    }
  };

  // Delete a goal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      // Matches router.delete("/:id", protect, deleteGoal)
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((goal) => goal._id !== id));
      setMessage("Goal deleted successfully ✅");
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete goal ❌");
    }
  };

  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}


  return (
   <div className="mx-auto mt-10 w-full max-w-xl
                rounded-2xl bg-white
                p-5 sm:p-6
                shadow-lg border border-gray-100">

  {/* Header */}
  <h2 className="mb-6 border-b pb-3
                 text-xl sm:text-2xl
                 font-semibold text-gray-800">
    FitHub: My Fitness Goals
  </h2>

  {/* Message */}
  {message && (
    <div
      className={`mb-5 rounded-lg px-4 py-2
                  text-center text-sm font-medium
                  ${
                    message.includes("✅")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
    >
      {message}
    </div>
  )}

  {/* Add Goal */}
  <div className="mb-6 flex flex-col gap-3 sm:flex-row">
    <select
      value={newGoal}
      onChange={(e) => setNewGoal(e.target.value)}
      className="flex-1 rounded-lg border border-gray-300
                 bg-white px-4 py-2.5 text-sm
                 focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:border-indigo-500
                 transition"
    >
      {goalOptions.map((g) => (
        <option key={g.value} value={g.value}>
          {g.label}
        </option>
      ))}
    </select>

    <button
      onClick={handleAddGoal}
      className="rounded-lg bg-indigo-600
                 px-6 py-2.5 text-sm font-semibold
                 text-white
                 hover:bg-indigo-700
                 transition
                 sm:w-auto w-full"
    >
      Add Goal
    </button>
  </div>

  {/* Goals List */}
  {goals.length === 0 ? (
    <p className="py-6 text-center text-sm text-gray-500">
      No goals set yet. Start by adding one above!
    </p>
  ) : (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div
          key={goal._id}
          className="flex flex-col gap-3
                     rounded-xl border border-gray-200
                     bg-white p-4
                     transition hover:shadow-md
                     sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Goal Info */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-700">
              {goalOptions.find((g) => g.value === goal.goalType)?.label ||
                goal.goalType}
            </span>

            <span className="hidden sm:inline text-gray-300">|</span>

            <span
              className={`text-xs font-bold uppercase tracking-wide
                ${
                  goal.status === "completed"
                    ? "text-green-600"
                    : goal.status === "paused"
                    ? "text-yellow-600"
                    : "text-indigo-600"
                }`}
            >
              {goal.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <select
              value={goal.status}
              onChange={(e) =>
                handleStatusChange(goal._id, e.target.value)
              }
              className="rounded-md border border-gray-300
                         bg-white px-2 py-1.5 text-xs
                         focus:outline-none focus:ring-1
                         focus:ring-indigo-500
                         cursor-pointer"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleDelete(goal._id)}
              title="Delete Goal"
              className="rounded-md p-1.5
                         text-red-500
                         hover:bg-red-50 hover:text-red-700
                         transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Goals;