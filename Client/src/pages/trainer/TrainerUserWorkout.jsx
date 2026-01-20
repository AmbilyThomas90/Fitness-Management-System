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
        category: "GENERAL",
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
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ===== APPROVED USERS LIST ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">👥 Approved Users</h2>

        {assignments.length === 0 ? (
          <p className="text-gray-500 text-sm">No approved users</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((a) => (
              <div
                key={a._id}
                onClick={() => selectAssignment(a)}
                className={`cursor-pointer border rounded-xl p-4 transition
                  ${
                    selectedAssignmentId === a._id
                      ? "border-blue-600 bg-blue-50"
                      : Array.isArray(a.workouts) && a.workouts.length > 0
                      ? "border-green-600 bg-green-50"
                      : "hover:border-gray-400"
                  }`}
              >
                <p className="font-semibold">{a.user?.name}</p>
                <p className="text-sm text-gray-500">{a.user?.email}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Goal: {a.goal?.goalType || "Not Assigned"}
                </p>

                {/* ✅ Workout Assigned Badge */}
                {Array.isArray(a.workouts) && a.workouts.length > 0 && (
                  <span className="inline-block mt-2 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    Workout Assigned
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== USER PROFILE ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* USER INFORMATION */}
        <div>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
            <User className="w-5 h-5 text-blue-600" /> User Information
          </h2>

          <div className="space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-900">Name</span>
              <span className="font-medium">{user.name || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-900 flex items-center gap-1">
                <Mail className="w-4 h-4" /> Email
              </span>
              <span className="font-medium truncate max-w-[180px]">{user.email || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-900 flex items-center gap-1">
                <Phone className="w-4 h-4" /> Phone
              </span>
              <span className="font-medium">{userProfile.phoneNumber || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-900">Gender</span>
              <span className="font-medium">{userProfile.gender || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-900">Health Condition</span>
              <span className="font-medium">{userProfile.healthCondition || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-900">Fitness Level</span>
              <span className="font-medium">{userProfile.fitnessLevel || "-"}</span>
            </div>
          </div>
        </div>

        {/* BODY METRICS */}
        <div>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-4 text-gray-800">
            <Activity className="w-5 h-5 text-green-600" /> Body Metrics
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Weight</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {userProfile.weight || "-"}
                <span className="text-sm font-medium text-gray-500 ml-1">kg</span>
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Height</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {userProfile.height || "-"}
                <span className="text-sm font-medium text-gray-500 ml-1">cm</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== GOAL ===== */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-950 text-white p-6 rounded-2xl shadow-lg flex items-center justify-center gap-3">
        <span className="text-blue-200 text-xl">🎯</span>
        <h3 className="text-lg font-medium">Fitness Goal:</h3>
        <p className="text-2xl font-bold">{goal.goalType || "No Goal Assigned"}</p>
      </div>

    {/* ===== WORKOUTS ===== */}

<div className="bg-white rounded-2xl shadow-md p-6">
  <div className="flex justify-between mb-4">
    <h3 className="text-xl font-semibold">🏋️ Workout Plan</h3>
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-2 py-2 rounded-lg"
    >
      + Add Workout
    </button>
  </div>

{Array.isArray(validWorkouts) && validWorkouts.length > 0 ? (
  <div className="space-y-6">
    {validWorkouts.map((w, i) => (
      <div
        key={w._id}
        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
      >
        {/* Workout Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Workout Category
            </p>
            <p className="text-base font-semibold text-gray-900">
              {w.category}
            </p>
          </div>

          <div className="text-right  ">
            <p className="text-xs font-medium  text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <span
              className={`inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full ${
                w.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {w.status}
            </span>
          </div>
        </div>

        {/* Exercises Table */}
        {Array.isArray(w.exercises) && w.exercises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    Exercise Name
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">
                    Sets
                  </th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">
                    Reps
                  </th>
                </tr>
              </thead>

              <tbody>
                {w.exercises.map((ex, j) => (
                  <tr key={`${i}-${j}`} className="border-t">
                    <td className="px-4 py-2 text-gray-900 font-medium">
                      {ex.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {ex.category || w.category}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {ex.sets || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {ex.reps || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic mt-3">
            No exercises added for this workout.
          </p>
        )}
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-400 text-sm italic text-center">
    No workouts assigned yet.
  </p>
)}

</div>



      {/* ===== ADD WORKOUT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40">
          <div className="bg-blue-950 rounded-xl p-6 w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold text-white">Add Workout</h2>

            {exercises.map((ex, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-2 text-white">
                <input
                  className="border p-2 rounded"
                  placeholder="Name"
                  value={ex.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
                <select
                  className="border p-2 rounded bg-blue-800 text-white"
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
                <input className="border p-2 rounded" placeholder="Sets" onChange={(e) => handleChange(idx, "sets", e.target.value)} />
                <input className="border p-2 rounded" placeholder="Reps" onChange={(e) => handleChange(idx, "reps", e.target.value)} />
                <input className="border p-2 rounded" placeholder="Duration" onChange={(e) => handleChange(idx, "duration", e.target.value)} />
                <input className="border p-2 rounded" placeholder="Rest" onChange={(e) => handleChange(idx, "rest", e.target.value)} />
              </div>
            ))}

            <div className="flex justify-between">
              <button onClick={addExercise} className="bg-gray-200 px-4 py-2 rounded">+ Add Row</button>
              <div>
                <button onClick={() => setShowModal(false)} className="mr-2 text-white">Cancel</button>
                <button onClick={handleCreateWorkout} className="bg-blue-600 text-white px-4 py-2 rounded">
                  {saving ? "Saving..." : "Assign Workout"}
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
