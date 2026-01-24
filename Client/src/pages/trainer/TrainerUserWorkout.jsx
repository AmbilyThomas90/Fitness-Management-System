import React, { useEffect, useState } from "react";
import { Mail, Phone, User, Activity } from "lucide-react";
import api from "../../api/api";

const TrainerUserWorkout = ({ data = {}, refreshWorkouts }) => {
  // ===== STATES (ALL HOOKS AT TOP) =====
  const [assignments, setAssignments] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [exercises, setExercises] = useState([
    { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
  ]);
  const [saving, setSaving] = useState(false);

  // ===== SAFE DESTRUCTURING =====
  const { user = {}, userProfile = {}, goal = {}, workouts = [] } = pageData;

  // ===== FETCH TRAINER USERS =====
  const fetchTrainerUsers = async () => {
    try {
      const res = await api.get("/trainer-assignment/my-users");
      const assignmentsData = res.data?.assignments || [];
      setAssignments(assignmentsData);

      if (assignmentsData.length > 0) {
        const a = assignmentsData[0];
        setPageData({
          user: a.user || {},
          userProfile: a.userProfile || {},
          goal: {
            goalType: a.goal?.goalType,
            goalName: a.plan?.planName,
            planType: a.plan?.planType,
            amount: a.plan?.amount,
            startDate: a.startDate,
            endDate: a.endDate,
          },
          workouts: a.workouts || [],
        });
      }
    } catch (err) {
      console.error("❌ Fetch trainer users error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerUsers();
  }, []);

  // ===== HELPERS =====
  const addExercise = () => {
    setExercises([
      ...exercises,
      { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

const handleCreateWorkout = async () => {
  // ✅ Get the latest userId and goalId from pageData
  const userId = pageData?.user?._id;
  const goalId = pageData?.goal?._id;

  if (!userId || !goalId) {
    alert("Please select a user and a goal");
    return;
  }

  if (!exercises?.length || exercises.some((e) => !e.name || !e.category)) {
    alert("Please fill in all exercise names and categories");
    return;
  }

  setSaving(true);

  try {
    await api.post("/workouts", {
      userId,
      goalId,
      category: "GENERAL", // or use dropdown if needed
      startDate: new Date(),
      exercises: exercises.map((ex) => ({
        ...ex,
        category: ex.category.toUpperCase(),
      })),
    });

    alert("Workout created successfully ✅");
    setShowModal(false);

    setExercises([
      { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
    ]);

    refreshWorkouts?.();
  } catch (err) {
    console.error("Create workout error:", err);
    alert(err.response?.data?.message || "Failed to create workout");
  } finally {
    setSaving(false);
  }
};

  // ===== LOADING / ERROR UI =====
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading workout details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // ===== MAIN UI  =====
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* USER PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> User Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Name:</strong> {user.name || "-"}</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email || "-"}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {userProfile.phoneNumber || "-"}</p>
            <p><strong>Gender:</strong> {userProfile.gender || "-"}</p>
            <p><strong>Health Condition:</strong> {userProfile.healthCondition || "None"}</p>
            <p><strong>Fitness Level:</strong> {userProfile.fitnessLevel || "None"}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" /> Body Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-500">Weight</p>
              <p className="text-lg font-bold">{userProfile.weight || "-"} kg</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-500">Height</p>
              <p className="text-lg font-bold">{userProfile.height || "-"} cm</p>
            </div>
          </div>
        </div>
      </div>

      {/* GOAL SUMMARY */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">🎯 Fitness Goal</h3>
        <p className="text-2xl font-bold mt-2">{goal.goalType || "No Goal Assigned"}</p>
      </div>

      {/* WORKOUT SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🏋️ Workout Plan</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Workout
          </button>
        </div>

        {workouts.length === 0 ? (
          <p className="text-gray-500 text-sm">No workouts assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3">Exercise</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Sets</th>
                  <th className="px-4 py-3">Reps</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Rest</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, i) =>
                  workout.exercises.map((ex, idx) => (
                    <tr key={`${i}-${idx}`} className="border-b">
                      <td className="px-4 py-3 font-medium">{ex.name}</td>
                      <td className="px-4 py-3">{ex.category || "-"}</td>
                      <td className="px-4 py-3">{ex.sets || "-"}</td>
                      <td className="px-4 py-3">{ex.reps || "-"}</td>
                      <td className="px-4 py-3">{ex.duration || "-"}</td>
                      <td className="px-4 py-3">{ex.rest || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD WORKOUT MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-gray-400 rounded-xl p-6 w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold">Add Workout</h2>

            {exercises.map((ex, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Exercise Name"
                  value={ex.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
                <select
                  className="border p-2 rounded"
                  value={ex.category}
                  onChange={(e) => handleChange(idx, "category", e.target.value)}
                >
                  <option value="STRENGTH">Strength</option>
                  <option value="CARDIO">Cardio</option>
                  <option value="CORE">Core</option>
                  <option value="FLEXIBILITY">Flexibility</option>
                  <option value="BALANCE">Balance</option>
                  <option value="FUNCTIONAL">Functional</option>
                  <option value="RECOVERY">Recovery</option>
                </select>
                <input
                  className="border p-2 rounded"
                  type="number"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => handleChange(idx, "sets", e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  type="number"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => handleChange(idx, "reps", e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Duration"
                  value={ex.duration}
                  onChange={(e) => handleChange(idx, "duration", e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Rest"
                  value={ex.rest}
                  onChange={(e) => handleChange(idx, "rest", e.target.value)}
                />
              </div>
            ))}

            <div className="flex justify-between">
              <button onClick={addExercise} className="bg-gray-200 px-4 py-2 rounded">
                + Add Row
              </button>

              <div className="space-x-2">
                <button onClick={() => setShowModal(false)} className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkout}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {saving ? "Saving..." : "Save Workout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerUserWorkout;
