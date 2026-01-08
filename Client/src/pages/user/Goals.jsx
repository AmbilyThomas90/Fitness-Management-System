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

  if (loading) return <div className="p-6 text-center">Loading goals...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">FitHub: My Fitness Goals</h2>

      {message && (
        <div className={`mb-4 p-2 rounded text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <select
          className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        >
          {goalOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddGoal}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No goals set yet. Start by adding one above!</p>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className="font-bold text-gray-700">
                  {goalOptions.find((g) => g.value === goal.goalType)?.label || goal.goalType}
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span
                  className={`text-sm font-semibold uppercase ${
                    goal.status === "completed"
                      ? "text-green-600"
                      : goal.status === "paused"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              <div className="flex gap-3">
                <select
                  value={goal.status}
                  onChange={(e) => handleStatusChange(goal._id, e.target.value)}
                  className="border text-sm p-1 rounded bg-white cursor-pointer"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(goal._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Goal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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