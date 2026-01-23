import React, { useEffect, useState } from "react";
import api from "../../api/api";

const UserNutrition = () => {
  const [nutritionList, setNutritionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH USER NUTRITION =================
const fetchNutrition = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/nutrition/user-nutrition", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNutritionList(res.data?.nutrition || []);
  } catch (err) {
    console.error(
      "Error fetching nutrition:",
      err.response?.data || err.message
    );
    setError("Failed to load nutrition");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNutrition();
  }, []);

 if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}
  if (error)
    return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">

  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
    <span className="text-4xl">🥗</span> My Nutrition
  </h2>

  {nutritionList.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg italic">
        No nutrition logged yet.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nutritionList.map((n) => (
        <div
          key={n._id}
          className="bg-gradient-to-br from-green-400 via-green-100 to-green-200 rounded-2xl shadow-lg p-5 hover:scale-105 transform transition-all duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-white bg-green-600 px-3 py-1 rounded-full">
              {n.meal}
            </span>
            <span className="text-xs text-gray-600">
              {new Date(n.date).toLocaleDateString()}
            </span>
          </div>

          {/* Nutrition Details */}
          <ul className="space-y-2">
            <li className="bg-white rounded-xl border p-3 shadow-sm">
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <span>Calories: {n.calories}</span>
                <span>Protein: {n.protein}g</span>
                <span>Carbs: {n.carbs}g</span>
                <span>Fats: {n.fats}g</span>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default UserNutrition;
