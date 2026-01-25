import React, { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerApprovedUsersProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        // Ensure this endpoint matches your backend route exactly
        const res = await api.get("/progress/approved-users-progress");
        
        console.log("📥 API Response:", res.data);

        // ✅ FIX: Access 'data' instead of 'progress' to match backend res.json({ data: ... })
        if (res.data && res.data.data) {
          setProgress(res.data.data);
        } else {
          setProgress([]);
        }
      } catch (error) {
        console.error("❌ Failed to load progress", error);
        setErrorMsg("Could not fetch progress data.");
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);


  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}
  if (errorMsg) return <div className="p-6 text-red-500">{errorMsg}</div>;

  return (
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-gray-100 border-b border-gray-700 pb-3">
    Approved Users Progress
  </h2>

  {progress.length === 0 ? (
    <div className="bg-gray-800 p-8 sm:p-10 rounded-xl text-center text-gray-400 shadow-sm">
      No progress records submitted by your assigned users yet.
    </div>
  ) : (
    <div className="grid gap-6">
      {progress.map((item) => (
        <div
          key={item._id}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-indigo-400">
                {item.user?.name || "Unknown User"}
              </h3>
              <p className="text-sm text-gray-400 break-all">
                {item.user?.email}
              </p>
            </div>

            <span className="w-fit bg-indigo-900/30 text-indigo-200 text-xs font-medium px-3 py-1 rounded-full uppercase">
              Goal: {item.goalType}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-700 p-4 rounded-lg mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                Current Value
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-100">
                {item.currentValue}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                Date
              </p>
              <p className="text-gray-300">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Note */}
          {item.note && (
            <div className="mt-3 text-sm text-gray-300 italic border-l-4 border-indigo-600 pl-4">
              “{item.note}”
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>



  );
};

export default TrainerApprovedUsersProgress;