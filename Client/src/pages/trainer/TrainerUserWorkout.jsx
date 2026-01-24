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
      console.log("📥 Fetching assigned users...");
      const res = await api.get("/trainer-assignment/my-users");
      console.log("✅ Assigned users response:", res.data);
      
      const data = res.data?.assignments || [];
      setAssignments(data);

      if (data.length > 0) {
        selectAssignment(data[0]); // auto select first user
      } else {
        console.log("⚠️ No assigned users found");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Fetch trainer users error:", err.message);
      console.error("📋 Error response:", err.response?.status, err.response?.data);
      setError("Failed to load users: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerUsers();
  }, []);
 // ================= FETCH USER WORKOUTS =================
const fetchUserWorkouts = async (assignment) => {
  try {
    console.log("📥 Fetching workouts for user:", assignment.user._id);
    const res = await api.get(`/trainer/user-workout/${assignment.user._id}`);
    console.log("✅ Workouts response:", res.data);
    return res.data?.workouts || [];
  } catch (err) {
    console.error("❌ Fetch user workouts error:", err.message);
    console.error("📋 Error response:", err.response?.status, err.response?.data);
    console.error("🔗 Requested URL:", `/trainer/user-workout/${assignment.user._id}`);
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
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          duration: ex.duration,
          rest: ex.rest,
        })),
      };

      console.log(" CREATE WORKOUT PAYLOAD:", payload);

      await api.post("/workout/create-workouts", payload);

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
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 space-y-6">

  {/* ===== APPROVED USERS LIST ===== */}
  <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">
      👥 Approved Users
    </h2>

    {assignments.length === 0 ? (
      <p className="text-gray-500 text-sm">No approved users</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <div
            key={a._id}
            onClick={() => selectAssignment(a)}
            className={`cursor-pointer rounded-xl border p-4 transition
              ${
                selectedAssignmentId === a._id
                  ? "border-blue-600 bg-blue-50"
                  : Array.isArray(a.workouts) && a.workouts.length > 0
                  ? "border-green-600 bg-green-50"
                  : "hover:border-gray-400"
              }`}
          >
            <p className="font-semibold text-gray-900 truncate">
              {a.user?.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {a.user?.email}
            </p>

            <p className="text-xs text-blue-600 mt-1">
              Goal: {a.goal?.goalType || "Not Assigned"}
            </p>

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
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* USER INFO */}
    <div>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" /> User Information
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        {[
          ["Name", user.name],
          ["Gender", userProfile.gender],
          ["Health Condition", userProfile.healthCondition],
          ["Fitness Level", userProfile.fitnessLevel],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <span className="text-gray-900">{label}</span>
            <span className="font-medium text-right">{value || "-"}</span>
          </div>
        ))}

        <div className="flex justify-between gap-3 items-center">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" /> Email
          </span>
          <span className="font-medium truncate max-w-[200px]">
            {user.email || "-"}
          </span>
        </div>

        <div className="flex justify-between gap-3 items-center">
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" /> Phone
          </span>
          <span className="font-medium">
            {userProfile.phoneNumber || "-"}
          </span>
        </div>
      </div>
    </div>

    {/* BODY METRICS */}
    <div>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-600" /> Body Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          ["Weight", userProfile.weight, "kg"],
          ["Height", userProfile.height, "cm"],
        ].map(([label, value, unit]) => (
          <div
            key={label}
            className="bg-gray-50 border rounded-xl p-5 text-center"
          >
            <p className="text-xs uppercase text-gray-500">{label}</p>
            <p className="text-2xl font-bold">
              {value || "-"}
              <span className="text-sm text-gray-500 ml-1">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* ===== GOAL ===== */}
  <div className="rounded-2xl bg-gradient-to-r from-blue-800 to-blue-950 text-white p-6 text-center shadow-lg">
    <p className="text-sm text-blue-200">🎯 Fitness Goal</p>
    <p className="text-2xl font-bold mt-1">
      {goal.goalType || "No Goal Assigned"}
    </p>
  </div>

  {/* ===== WORKOUTS ===== */}
  <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
      <h3 className="text-lg sm:text-xl font-semibold">
        🏋️ Workout Plan
      </h3>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        + Add Workout
      </button>
    </div>

    {Array.isArray(validWorkouts) && validWorkouts.length > 0 ? (
      <div className="space-y-6">
        {validWorkouts.map((w, i) => (
          <div
            key={w._id}
            className="border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Workout Category
                </p>
                <p className="font-semibold">{w.category}</p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  w.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {w.status}
              </span>
            </div>

            {Array.isArray(w.exercises) && w.exercises.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Exercise</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-center">Sets</th>
                      <th className="px-4 py-2 text-center">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {w.exercises.map((ex, j) => (
                      <tr key={`${i}-${j}`} className="border-t">
                        <td className="px-4 py-2 font-medium">{ex.name}</td>
                        <td className="px-4 py-2">{ex.category}</td>
                        <td className="px-4 py-2 text-center">{ex.sets || "-"}</td>
                        <td className="px-4 py-2 text-center">{ex.reps || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm italic text-gray-400 mt-2">
                No exercises added.
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center italic text-gray-400">
        No workouts assigned yet.
      </p>
    )}
  </div>
</div>

  );
};

export default TrainerUserWorkout;
