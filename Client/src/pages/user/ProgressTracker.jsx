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
        setGoals(res.data.goals);
        if (res.data.goals.length > 0) setSelectedGoal(res.data.goals[0]._id);
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
      setHistory(res.data.progressLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogProgress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/progress", {
        goalId: selectedGoal,
        currentValue: Number(currentValue),
        note
      });
      setCurrentValue("");
      setNote("");
      fetchProgressHistory(); // Refresh list
      alert("Progress recorded! 🚀");
    } catch (err) {
      alert("Failed to log progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-6">Track Your Progress</h2>

      <form onSubmit={handleLogProgress} className="space-y-4 mb-10 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Select Goal</label>
          <select 
            value={selectedGoal} 
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {goals.map(g => (
              <option key={g._id} value={g._id}>{g.goalType.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Value (kg/km/reps)</label>
          <input 
            type="number" 
            required 
            value={currentValue} 
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your current stats"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Daily Note</label>
          <textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="How did it feel today?"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800"
        >
          {loading ? "Saving..." : "Log  Progress"}
        </button>
      </form>

      <div className="history">
        <h3 className="font-bold border-b pb-2 mb-4">Recent History</h3>
        {history.length === 0 ? <p className="text-gray-400">No logs found for this goal.</p> : (
          <div className="space-y-3">
            {history.map(log => (
              <div key={log._id} className="flex justify-between items-center p-3 border-l-4 border-green-500 bg-white shadow-sm rounded">
                <div>
                  <p className="font-bold text-lg">{log.currentValue}</p>
                  <p className="text-xs text-gray-400">{new Date(log.recordedAt).toLocaleDateString()}</p>
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