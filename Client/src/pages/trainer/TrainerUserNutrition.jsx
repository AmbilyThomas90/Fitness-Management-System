import React, { useEffect, useState } from "react";
import { Mail, Phone, User, Activity } from "lucide-react";
import api from "../../api/api";

const TrainerUserNutrition = () => {
  // ================= STATES =================
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [pageData, setPageData] = useState({});
  const [nutritionList, setNutritionList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nutritionForm, setNutritionForm] = useState({
    meal: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  // ================= SAFE DESTRUCTURING =================
  const { user = {}, userProfile = {}, goal = {}, plan = {} } = pageData;

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

  // ================= FETCH USER NUTRITION =================
  const fetchUserNutrition = async (userId) => {
    try {
      const res = await api.get(`/trainer/user-nutrition/${userId}`);
      return res.data?.nutrition || [];
    } catch {
      return [];
    }
  };

  // ================= SELECT USER =================
  const selectAssignment = async (assignment) => {
    setSelectedAssignmentId(assignment._id);

    const nutrition = await fetchUserNutrition(assignment.user._id);
    setNutritionList(nutrition);

    setPageData({
      user: assignment.user || {},
      userProfile: assignment.userProfile || {},
      goal: assignment.goal || {},
      plan: assignment.plan || {}
    });
  };

  // ================= FORM HANDLERS =================
  const handleChange = (e) =>
    setNutritionForm({ ...nutritionForm, [e.target.name]: e.target.value });

  // ================= CREATE NUTRITION =================
  const handleCreateNutrition = async () => {
    if (!user?._id || !goal?._id || !plan?._id) {
      alert("Select a user with goal & plan");
      return;
    }

    setSaving(true);
    try {
      await api.post("/nutrition/create-nutrition", {
        userId: user._id,
        goalId: goal._id,
        planId: plan._id,
        ...nutritionForm
      });

      setShowModal(false);
      setNutritionForm({
        meal: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
      });

      const updated = await fetchUserNutrition(user._id);
      setNutritionList(updated);
    } catch (err) {
      alert("Failed to assign nutrition");
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

  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;

  // ================= UI =================
  return (
   <div className="min-h-screen bg-gray-50 px-3 sm:px-6 lg:px-8 py-5 space-y-6">

  {/* ===== APPROVED USERS ===== */}
  <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
    <h2 className="text-base sm:text-xl font-semibold mb-4">
      👥 Approved Users
    </h2>

    {assignments.length === 0 ? (
      <p className="text-gray-500 text-sm">No approved users</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <div
            key={a._id}
            onClick={() => selectAssignment(a)}
            className={`cursor-pointer border rounded-xl p-4 transition-all
              ${
                selectedAssignmentId === a._id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
              }`}
          >
            <p className="font-semibold text-sm sm:text-base truncate">
              {a.user?.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 break-all">
              {a.user?.email}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Goal: {a.goal?.goalType || "Not Assigned"}
            </p>
          </div>
        ))}
      </div>
    )}
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

  {/* ===== NUTRITION PLAN ===== */}
  <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <h3 className="text-base sm:text-xl font-semibold">
        Nutrition Plan
      </h3>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
      >
        + Add Nutrition
      </button>
    </div>

    {nutritionList.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Meal</th>
              <th className="text-center">Calories</th>
              <th className="text-center">Protein</th>
              <th className="text-center">Carbs</th>
              <th className="text-center">Fats</th>
            </tr>
          </thead>
          <tbody>
            {nutritionList.map((n) => (
              <tr key={n._id} className="border-t">
                <td className="px-4 py-2 font-medium">{n.meal}</td>
                <td className="text-center">{n.calories}</td>
                <td className="text-center">{n.protein}</td>
                <td className="text-center">{n.carbs}</td>
                <td className="text-center">{n.fats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-400 italic text-center py-4">
        No nutrition assigned yet
      </p>
    )}
  </div>

  {/* ===== MODAL ===== */}
  {showModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-lg space-y-3">
        <h2 className="text-lg font-semibold">Add Nutrition</h2>

        {["meal", "calories", "protein", "carbs", "fats"].map((f) =>
          f === "meal" ? (
            <select
              key={f}
              name="meal"
              value={nutritionForm.meal}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Meal</option>
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          ) : (
            <input
              key={f}
              type="number"
              name={f}
              value={nutritionForm[f]}
              onChange={handleChange}
              placeholder={f.toUpperCase()}
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setShowModal(false)}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateNutrition}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition"
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

export default TrainerUserNutrition;

   