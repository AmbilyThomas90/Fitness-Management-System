import React, { useEffect, useState } from "react";
import { Mail, Phone, User, Activity } from "lucide-react";
import api from "../../api/api";

const TrainerUserWorkout = ({ refreshWorkouts }) => {
  // ================= STATES =================
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [exercises, setExercises] = useState([
    { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
  ]);
  const [saving, setSaving] = useState(false);

  // ================= SAFE DESTRUCTURING =================
  const { user = {}, userProfile = {}, goal = {}, workouts = [] } = pageData;

  // ================= FETCH TRAINER USERS =================
  const fetchTrainerUsers = async () => {
    try {
      const res = await api.get("/trainer-assignment/my-users");
      const data = res.data?.assignments || [];
      setAssignments(data);

      if (data.length > 0) {
        selectAssignment(data[0]); // auto select first user
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
 // ================= FETCH USER WORKOUTS =================
const fetchUserWorkouts = async (assignment) => {
  try {
    // Correct backend route for trainer fetching a user's workouts
    // Make sure your backend has: router.get("/trainer/user-workout/:userId", protect, getUserWorkouts);
    const res = await api.get(`/trainer/user-workout/${assignment.user._id}`);
    return res.data?.workouts || [];
  } catch (err) {
    console.error("❌ Fetch user workouts error:", err);
    return [];
  }
};

// ================= SELECT USER =================
const selectAssignment = async (assignment) => {
  setSelectedAssignmentId(assignment._id);

  // Fetch workouts of selected user
  const workouts = await fetchUserWorkouts(assignment);

  setPageData({
    user: assignment.user || {},
    userProfile: assignment.userProfile || {},
    goal: {
      _id: assignment.goal?._id,
      goalType: assignment.goal?.goalType,
      goalName: assignment.plan?.planName,
      planType: assignment.plan?.planType,
      amount: assignment.plan?.amount,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
    },
    workouts: workouts, // <-- set workouts here
  });
};




  // ================= HELPERS =================
  const addExercise = () => {
    setExercises([
      ...exercises,
      { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  // ================= CREATE WORKOUT =================
  const handleCreateWorkout = async () => {
  const userId = pageData?.user?._id;
  const goalId = pageData?.goal?._id;

  if (!userId || !goalId) {
    alert("Please select a user with a goal");
    return;
  }

  if (!exercises.length || exercises.some((e) => !e.name || !e.category)) {
    alert("Fill all exercise names and categories");
    return;
  }

  setSaving(true);

  try {
    const payload = {
      userId,
      goalId,
      category: exercises[0].category.toUpperCase(), // <-- use selected category
      startDate: new Date().toISOString(),
      exercises: exercises.map((ex) => ({
        name: ex.name,
        category: ex.category.toUpperCase(),
        sets: Number(ex.sets) || 0,
        reps: Number(ex.reps) || 0,
        duration: ex.duration,
        rest: ex.rest,
      })),
    };

    console.log(" CREATE WORKOUT PAYLOAD:", payload);

    await api.post("/work/create-workouts", payload);

    alert("Workout created successfully ✅");
    setShowModal(false);
    setExercises([{ category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" }]);
    fetchTrainerUsers();
    refreshWorkouts?.();
  } catch (err) {
    console.error("❌ Create workout error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to create workout");
  } finally {
    setSaving(false);
  }
};


  // ================= LOADING / ERROR =================

  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }


  // ================= NORMALIZED WORKOUTS =================
const validWorkouts = Array.isArray(workouts)
  ? workouts.filter(
      (w) => w.status === "ACTIVE" || w.status === "COMPLETED"
    )
  : [];

  // ================= UI =================
  return (
 <div className="min-h-screen bg-gray-900 px-4 sm:px-6 py-6 space-y-6">

  {/* ===== APPROVED USERS LIST ===== */}
  <div className="bg-gray-900 rounded-2xl shadow-md p-5 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-100">
      👥 Approved Users
    </h2>

    {assignments.length === 0 ? (
      <p className="text-gray-400 text-sm">No approved users</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <div
            key={a._id}
            onClick={() => selectAssignment(a)}
            className={`cursor-pointer rounded-xl border p-4 transition
              ${
                selectedAssignmentId === a._id
                  ? "border-blue-500 bg-blue-700/30"
                  : Array.isArray(a.workouts) && a.workouts.length > 0
                  ? "border-green-500 bg-green-700/20"
                  : "hover:border-gray-500"
              }`}
          >
            <p className="font-semibold text-gray-100 truncate">
              {a.user?.name}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {a.user?.email}
            </p>

            <p className="text-xs text-blue-400 mt-1">
              Goal: {a.goal?.goalType || "Not Assigned"}
            </p>

            {Array.isArray(a.workouts) && a.workouts.length > 0 && (
              <span className="inline-block mt-2 text-xs font-semibold text-green-300 bg-green-800/20 px-2.5 py-1 rounded-full">
                Workout Assigned
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* ===== USER PROFILE ===== */}
  <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* USER INFO */}
    <div>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-100">
        <User className="w-5 h-5 text-blue-400" /> User Information
      </h2>

      <div className="space-y-2 text-sm text-gray-300">
        {[
          ["Name", user.name],
          ["Gender", userProfile.gender],
          ["Health Condition", userProfile.healthCondition],
          ["Fitness Level", userProfile.fitnessLevel],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <span className="text-gray-100">{label}</span>
            <span className="font-medium text-right">{value || "-"}</span>
          </div>
        ))}

        <div className="flex justify-between gap-3 items-center">
          <span className="flex items-center gap-1 text-gray-100">
            <Mail className="w-4 h-4" /> Email
          </span>
          <span className="font-medium truncate max-w-[200px] text-gray-200">
            {user.email || "-"}
          </span>
        </div>

        <div className="flex justify-between gap-3 items-center">
          <span className="flex items-center gap-1 text-gray-100">
            <Phone className="w-4 h-4" /> Phone
          </span>
          <span className="font-medium text-gray-200">
            {userProfile.phoneNumber || "-"}
          </span>
        </div>
      </div>
    </div>

    {/* BODY METRICS */}
    <div>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-100">
        <Activity className="w-5 h-5 text-green-400" /> Body Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          ["Weight", userProfile.weight, "kg"],
          ["Height", userProfile.height, "cm"],
        ].map(([label, value, unit]) => (
          <div
            key={label}
            className="bg-gray-700 border border-gray-600 rounded-xl p-5 text-center"
          >
            <p className="text-xs uppercase text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-100">
              {value || "-"}
              <span className="text-sm text-gray-400 ml-1">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* ===== GOAL ===== */}
  <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 text-center shadow-lg">
    <p className="text-sm text-blue-300">🎯 Fitness Goal</p>
    <p className="text-2xl font-bold mt-1">
      {goal.goalType || "No Goal Assigned"}
    </p>
  </div>

  {/* WORKOUT SECTION */}
  <div className="bg-gray-900 rounded-2xl shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-gray-100">🏋️ Workout Plan</h3>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Add Workout
      </button>
    </div>

    {workouts.length === 0 ? (
      <p className="text-gray-400 text-sm">No workouts assigned yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead>
            <tr className="bg-gray-700 text-left text-gray-300">
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
                <tr key={`${i}-${idx}`} className="border-b border-gray-700">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl space-y-4 text-gray-200">
        <h2 className="text-xl font-semibold text-gray-100">Add Workout</h2>

        {exercises.map((ex, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-2">
            <input
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              placeholder="Exercise Name"
              value={ex.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
            />
            <select
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              value={ex.category}
              onChange={(e) => handleChange(idx, "category", e.target.value)}
            >
              <option value="GENERAL">General</option>
              <option value="STRENGTH">Strength</option>
              <option value="CARDIO">Cardio</option>
              <option value="CORE">Core</option>
              <option value="FLEXIBILITY">Flexibility</option>
              <option value="BALANCE">Balance</option>
              <option value="FUNCTIONAL">Functional</option>
              <option value="RECOVERY">Recovery</option>
            </select>
            <input
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              type="number"
              placeholder="Sets"
              value={ex.sets}
              onChange={(e) => handleChange(idx, "sets", e.target.value)}
            />
            <input
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              type="number"
              placeholder="Reps"
              value={ex.reps}
              onChange={(e) => handleChange(idx, "reps", e.target.value)}
            />
            <input
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              placeholder="Duration"
              value={ex.duration}
              onChange={(e) => handleChange(idx, "duration", e.target.value)}
            />
            <input
              className="border border-gray-600 bg-gray-700 p-2 rounded text-gray-200"
              placeholder="Rest"
              value={ex.rest}
              onChange={(e) => handleChange(idx, "rest", e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-between">
          <button onClick={addExercise} className="bg-gray-700 text-gray-200 px-4 py-2 rounded">
            + Add Row
          </button>

          <div className="space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="border border-gray-600 px-4 py-2 rounded text-gray-200"
            >
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
