import React, { useState, useEffect } from "react";
import api from "../../api/api";

const ProgressTracker = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user goals to populate dropdown
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get("/goals");
        // FIX: Handle cases where goals might be undefined/empty
        const fetchedGoals = res.data.goals || [];
        setGoals(fetchedGoals);
        if (fetchedGoals.length > 0) setSelectedGoal(fetchedGoals[0]._id);
      } catch (err) {
        console.error("Error fetching goals", err);
      }
    };
    fetchGoals();
  }, []);

  // Fetch history when selectedGoal changes
  useEffect(() => {
    if (selectedGoal) {
      fetchProgressHistory();
    }
  }, [selectedGoal]);

  const fetchProgressHistory = async () => {
    try {
      const res = await api.get(`/progress/${selectedGoal}`);
      // FIX: Ensure history is always an array
      setHistory(res.data.progressLogs || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]); // Reset history on error
    }
  };

const handleLogProgress = async (e) => {
  e.preventDefault();
  if (!selectedGoal || !currentValue) return alert("Please fill in all fields");

  try {
    setLoading(true);
    await api.post("/progress/create-progress", {
      goalId: selectedGoal,
      currentValue: currentValue, // Removed Number() to allow strings
      note: note
    });

    setCurrentValue("");
    setNote("");
    fetchProgressHistory();
    alert("Progress recorded! 🚀");
  } catch (err) {
    console.error("Submission error:", err.response?.data);
    alert(err.response?.data?.message || "Failed to log progress");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">

  <h2 className="text-2xl font-bold mb-6 text-gray-800">Track Your Progress</h2>

  {/* Form */}
  <form onSubmit={handleLogProgress} className="space-y-5 mb-10 bg-gray-50 p-5 rounded-xl shadow-inner">
    
    {/* Select Goal */}
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Select Goal</label>
      <select 
        value={selectedGoal} 
        onChange={(e) => setSelectedGoal(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        {goals.map(g => (
          <option key={g._id} value={g._id}>
            {g.goalType?.replace('_', ' ').toUpperCase() || "GOAL"}
          </option>
        ))}
      </select>
    </div>

    {/* Current Value */}
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Current Value (kg/km/reps, sec)</label>
      <input 
        type="text"
        required
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        placeholder="e.g. 75kg, 5km, 12 reps or 45 sec"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    </div>

    {/* Daily Note */}
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Daily Note</label>
      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How did it feel today?"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        rows={3}
      />
    </div>

    {/* Submit Button */}
    <button 
      type="submit" 
      disabled={loading}
      className={`w-full py-3 rounded-xl font-bold text-white transition ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
      }`}
    >
      {loading ? "Saving..." : "Log Progress"}
    </button>
  </form>

  {/* History */}
  <div className="history">
    <h3 className="font-bold border-b pb-2 mb-5 text-gray-800">Recent History</h3>

    {history.length === 0 ? (
     <div className="flex justify-center items-center py-6">
  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
</div>

    ) : (
      <div className="space-y-4">
        {history.map(log => (
          <div key={log._id} className="flex flex-col sm:flex-row sm:justify-between p-4 border-l-4 border-green-500 bg-white shadow-sm rounded-lg">
            <div className="mb-2 sm:mb-0">
              <p className="font-bold text-lg text-gray-800">{log.currentValue}</p>
              <p className="text-xs text-gray-400">
                {log.recordedAt ? new Date(log.recordedAt).toLocaleDateString() : "Date N/A"}
              </p>
            </div>
            <p className="text-sm italic text-gray-600">"{log.note || 'No note added'}"</p>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default ProgressTracker;