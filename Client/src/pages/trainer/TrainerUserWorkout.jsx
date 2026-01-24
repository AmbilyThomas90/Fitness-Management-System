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
        await selectAssignment(data[0]); // ✅ await added
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
      if (!assignment?.user?._id) return [];

      const res = await api.get(
        `/trainer/user-workout/${assignment.user._id}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      return res.data?.workouts || [];
    } catch (err) {
      console.error("❌ Fetch user workouts error:", err);
      return [];
    }
  };

  // ================= SELECT USER =================
  const selectAssignment = async (assignment) => {
    setSelectedAssignmentId(assignment._id);

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
      workouts,
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

      await api.post("/work/create-workouts", payload);

      alert("Workout created successfully ✅");
      setShowModal(false);
      setExercises([
        { category: "GENERAL", name: "", sets: "", reps: "", duration: "", rest: "" },
      ]);

      await fetchTrainerUsers(); // ✅ ensures fresh workouts
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 space-y-6">
      {/* UI EXACTLY AS YOU PROVIDED */}
    </div>
  );
};

export default TrainerUserWorkout;
