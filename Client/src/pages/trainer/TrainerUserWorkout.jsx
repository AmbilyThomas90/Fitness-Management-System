import React, { useEffect, useState } from "react";
import { Mail, Phone, User, Activity } from "lucide-react";
import api from "../../api/api";

const TrainerUserWorkout = ({ refreshWorkouts }) => {
  // ================= STATES =================
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [pageData, setPageData] = useState({});
  const [workoutList, setWorkoutList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [exercises, setExercises] = useState([
    { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
  ]);

  // ================= SAFE DESTRUCTURING =================
  const { user = {}, userProfile = {}, goal = {} } = pageData;

  // ================= FETCH TRAINER USERS =================
  const fetchTrainerUsers = async () => {
    try {
      const res = await api.get("/trainer-assignment/my-users");
      const data = res.data?.assignments || [];
      setAssignments(data);

      if (data.length > 0) selectAssignment(data[0]);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerUsers();
  }, []);

  // ================= FETCH USER WORKOUT =================
  const fetchUserWorkouts = async (userId) => {
    try {
      const res = await api.get(`/trainer/user-workout/${userId}`);
      return res.data?.workouts || [];
    } catch {
      return [];
    }
  };

  // ================= SELECT USER =================
  const selectAssignment = async (assignment) => {
    setSelectedAssignmentId(assignment._id);

    const workouts = await fetchUserWorkouts(assignment.user._id);
    setWorkoutList(workouts);

    setPageData({
      user: assignment.user || {},
      userProfile: assignment.userProfile || {},
      goal: assignment.goal || {},
    });
  };

  // ================= FORM HANDLERS =================
  const addExercise = () => {
    setExercises([
      ...exercises,
      { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
    ]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  // ================= CREATE WORKOUT =================
  const handleCreateWorkout = async () => {
    if (!user?._id || !goal?._id) {
      alert("Select a user with a goal");
      return;
    }

    if (exercises.some((e) => !e.name || !e.category)) {
      alert("Fill all exercise names and categories");
      return;
    }

    setSaving(true);
    try {
      await api.post("/work/create-workouts", {
        userId: user._id,
        goalId: goal._id,
        category: "GENERAL",
        exercises: exercises.map((e) => ({
          name: e.name,
          category: e.category.toUpperCase(),
          sets: Number(e.sets) || 0,
          reps: Number(e.reps) || 0,
          duration: e.duration,
          rest: e.rest,
        })),
      });

      setShowModal(false);
      setExercises([
        { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
      ]);

      const updated = await fetchUserWorkouts(user._id);
      setWorkoutList(updated);

      refreshWorkouts?.();
    } catch {
      alert("Failed to assign workout");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING / ERROR =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 space-y-6">
      
      {/* ===== APPROVED USERS ===== */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4">👥 Approved Users</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <div
              key={a._id}
              onClick={() => selectAssignment(a)}
              className={`cursor-pointer border rounded-xl p-4 ${
                selectedAssignmentId === a._id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <p className="font-semibold truncate">{a.user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{a.user?.email}</p>
              <p className="text-xs text-blue-600 mt-1">
                Goal: {a.goal?.goalType || "Not Assigned"}
              </p>
            </div>
          ))}
        </div>
      </div>

     
     {/* ===== USER PROFILE ===== */}
     <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
       <div>
         <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center gap-2">
           <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
           User Information
         </h2>
   
         <div className="space-y-2 text-xs sm:text-sm">
           <div className="flex justify-between gap-2">
             <span className="text-gray-500">Name</span>
             <span className="font-medium text-right">{user.name || "-"}</span>
           </div>
           <div className="flex justify-between gap-2">
             <span className="text-gray-500">Email</span>
             <span className="font-medium text-right break-all">
               {user.email || "-"}
             </span>
           </div>
           <div className="flex justify-between gap-2">
             <span className="text-gray-500">Phone</span>
             <span className="font-medium text-right">
               {userProfile.phoneNumber || "-"}
             </span>
           </div>
           <div className="flex justify-between gap-2">
             <span className="text-gray-500">Health</span>
             <span className="font-medium text-right">
               {userProfile.healthCondition || "-"}
             </span>
           </div>
         </div>
       </div>
   
       <div>
         <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center gap-2">
           <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
           Body Metrics
         </h2>
   
         <div className="grid grid-cols-2 gap-4">
           <div className="bg-gray-50 p-3 sm:p-4 rounded-xl text-center">
             <p className="text-xs text-gray-500">Weight</p>
             <p className="text-lg sm:text-xl font-bold">
               {userProfile.weight || "-"} kg
             </p>
           </div>
           <div className="bg-gray-50 p-3 sm:p-4 rounded-xl text-center">
             <p className="text-xs text-gray-500">Height</p>
             <p className="text-lg sm:text-xl font-bold">
               {userProfile.height || "-"} cm
             </p>
           </div>
         </div>
       </div>
     </div>
   
     {/* ===== GOAL ===== */}
     <div className="bg-green-700 text-white p-5 sm:p-6 rounded-2xl text-center">
       <h3 className="text-sm sm:text-base opacity-90">Fitness Goal</h3>
       <p className="text-xl sm:text-2xl font-bold mt-1">
         {goal.goalType || "-"}
       </p>
     </div>

      {/* ===== WORKOUT PLAN ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">🏋️ Workout Plan</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Workout
          </button>
        </div>

        {workoutList.length > 0 ? (
          workoutList.map((w) => (
            <div key={w._id} className="border rounded-xl p-4 mb-4">
              <p className="font-semibold mb-2">{w.category}</p>

              <table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Exercise</th>
                    <th className="text-center">Sets</th>
                    <th className="text-center">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {w.exercises.map((e, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{e.name}</td>
                      <td className="text-center">{e.sets}</td>
                      <td className="text-center">{e.reps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center italic text-gray-400">
            No workouts assigned yet
          </p>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">
            <h2 className="font-semibold">Add Workout</h2>

            {exercises.map((ex, i) => (
              <input
                key={i}
                placeholder="Exercise Name"
                value={ex.name}
                onChange={(e) =>
                  handleExerciseChange(i, "name", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            ))}

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleCreateWorkout}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerUserWorkout;



// import React, { useEffect, useState } from "react";
// import { Mail, Phone, User, Activity } from "lucide-react";
// import api from "../../api/api";

// const TrainerUserWorkout = ({ data = {}, refreshWorkouts }) => {
//   // ===== STATES (ALL HOOKS AT TOP) =====
//   const [assignments, setAssignments] = useState([]);
//   const [pageData, setPageData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [exercises, setExercises] = useState([
//     { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
//   ]);
//   const [saving, setSaving] = useState(false);

//   // ===== SAFE DESTRUCTURING =====
//   const { user = {}, userProfile = {}, goal = {}, workouts = [] } = pageData;

//   // ===== FETCH TRAINER USERS =====
//   const fetchTrainerUsers = async () => {
//     try {
//       const res = await api.get("/trainer-assignment/my-users");
//       const assignmentsData = res.data?.assignments || [];
//       setAssignments(assignmentsData);

//       if (assignmentsData.length > 0) {
//         const a = assignmentsData[0];
//         setPageData({
//           user: a.user || {},
//           userProfile: a.userProfile || {},
//           goal: {
//             goalType: a.goal?.goalType,
//             goalName: a.plan?.planName,
//             planType: a.plan?.planType,
//             amount: a.plan?.amount,
//             startDate: a.startDate,
//             endDate: a.endDate,
//           },
//           workouts: a.workouts || [],
//         });
//       }
//     } catch (err) {
//       console.error("❌ Fetch trainer users error:", err);
//       setError("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrainerUsers();
//   }, []);

//   // ===== HELPERS =====
//   const addExercise = () => {
//     setExercises([
//       ...exercises,
//       { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
//     ]);
//   };

//   const handleChange = (index, field, value) => {
//     const updated = [...exercises];
//     updated[index][field] = value;
//     setExercises(updated);
//   };

// const handleCreateWorkout = async () => {
//   // ✅ Get the latest userId and goalId from pageData
//   const userId = pageData?.user?._id;
//   const goalId = pageData?.goal?._id;

//   if (!userId || !goalId) {
//     alert("Please select a user and a goal");
//     return;
//   }

//   if (!exercises?.length || exercises.some((e) => !e.name || !e.category)) {
//     alert("Please fill in all exercise names and categories");
//     return;
//   }

//   setSaving(true);

//   try {
//     await api.post("/workouts", {
//       userId,
//       goalId,
//       category: "GENERAL", // or use dropdown if needed
//       startDate: new Date(),
//       exercises: exercises.map((ex) => ({
//         ...ex,
//         category: ex.category.toUpperCase(),
//       })),
//     });

//     alert("Workout created successfully ✅");
//     setShowModal(false);

//     setExercises([
//       { category: "STRENGTH", name: "", sets: "", reps: "", duration: "", rest: "" },
//     ]);

//     refreshWorkouts?.();
//   } catch (err) {
//     console.error("Create workout error:", err);
//     alert(err.response?.data?.message || "Failed to create workout");
//   } finally {
//     setSaving(false);
//   }
// };

//   // ===== LOADING / ERROR UI =====
//   if (loading) {
//     return <div className="p-6 text-center text-gray-500">Loading workout details...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-500">{error}</div>;
//   }

//   // ===== MAIN UI  =====
//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       {/* USER PROFILE CARD */}
//       <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" /> User Information
//           </h2>
//           <div className="space-y-2 text-sm text-gray-700">
//             <p><strong>Name:</strong> {user.name || "-"}</p>
//             <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email || "-"}</p>
//             <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {userProfile.phoneNumber || "-"}</p>
//             <p><strong>Gender:</strong> {userProfile.gender || "-"}</p>
//             <p><strong>Health Condition:</strong> {userProfile.healthCondition || "None"}</p>
//             <p><strong>Fitness Level:</strong> {userProfile.fitnessLevel || "None"}</p>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Activity className="w-5 h-5 text-green-600" /> Body Metrics
//           </h2>
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <p className="text-gray-500">Weight</p>
//               <p className="text-lg font-bold">{userProfile.weight || "-"} kg</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <p className="text-gray-500">Height</p>
//               <p className="text-lg font-bold">{userProfile.height || "-"} cm</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* GOAL SUMMARY */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
//         <h3 className="text-lg font-semibold">🎯 Fitness Goal</h3>
//         <p className="text-2xl font-bold mt-2">{goal.goalType || "No Goal Assigned"}</p>
//       </div>

//       {/* WORKOUT SECTION */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">🏋️ Workout Plan</h3>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
//           >
//             + Add Workout
//           </button>
//         </div>

//         {workouts.length === 0 ? (
//           <p className="text-gray-500 text-sm">No workouts assigned yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th className="px-4 py-3">Exercise</th>
//                   <th className="px-4 py-3">Category</th>
//                   <th className="px-4 py-3">Sets</th>
//                   <th className="px-4 py-3">Reps</th>
//                   <th className="px-4 py-3">Duration</th>
//                   <th className="px-4 py-3">Rest</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {workouts.map((workout, i) =>
//                   workout.exercises.map((ex, idx) => (
//                     <tr key={`${i}-${idx}`} className="border-b">
//                       <td className="px-4 py-3 font-medium">{ex.name}</td>
//                       <td className="px-4 py-3">{ex.category || "-"}</td>
//                       <td className="px-4 py-3">{ex.sets || "-"}</td>
//                       <td className="px-4 py-3">{ex.reps || "-"}</td>
//                       <td className="px-4 py-3">{ex.duration || "-"}</td>
//                       <td className="px-4 py-3">{ex.rest || "-"}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ADD WORKOUT MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
//           <div className="bg-gray-400 rounded-xl p-6 w-full max-w-2xl space-y-4">
//             <h2 className="text-xl font-semibold">Add Workout</h2>

//             {exercises.map((ex, idx) => (
//               <div key={idx} className="grid grid-cols-6 gap-2">
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Exercise Name"
//                   value={ex.name}
//                   onChange={(e) => handleChange(idx, "name", e.target.value)}
//                 />
//                 <select
//                   className="border p-2 rounded"
//                   value={ex.category}
//                   onChange={(e) => handleChange(idx, "category", e.target.value)}
//                 >
//                   <option value="STRENGTH">Strength</option>
//                   <option value="CARDIO">Cardio</option>
//                   <option value="CORE">Core</option>
//                   <option value="FLEXIBILITY">Flexibility</option>
//                   <option value="BALANCE">Balance</option>
//                   <option value="FUNCTIONAL">Functional</option>
//                   <option value="RECOVERY">Recovery</option>
//                 </select>
//                 <input
//                   className="border p-2 rounded"
//                   type="number"
//                   placeholder="Sets"
//                   value={ex.sets}
//                   onChange={(e) => handleChange(idx, "sets", e.target.value)}
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   type="number"
//                   placeholder="Reps"
//                   value={ex.reps}
//                   onChange={(e) => handleChange(idx, "reps", e.target.value)}
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Duration"
//                   value={ex.duration}
//                   onChange={(e) => handleChange(idx, "duration", e.target.value)}
//                 />
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Rest"
//                   value={ex.rest}
//                   onChange={(e) => handleChange(idx, "rest", e.target.value)}
//                 />
//               </div>
//             ))}

//             <div className="flex justify-between">
//               <button onClick={addExercise} className="bg-gray-200 px-4 py-2 rounded">
//                 + Add Row
//               </button>

//               <div className="space-x-2">
//                 <button onClick={() => setShowModal(false)} className="border px-4 py-2 rounded">
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateWorkout}
//                   disabled={saving}
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   {saving ? "Saving..." : "Save Workout"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerUserWorkout;
