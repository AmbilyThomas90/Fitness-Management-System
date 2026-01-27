import { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added
  const [loadingId, setLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/trainer/my-users-details");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      setErrorMessage("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  // APPROVE ASSIGNMENT (DO NOT REMOVE CARD)
  const approveAssignment = async (assignmentId) => {
    try {
      setLoadingId(assignmentId);

      await api.put(`/trainer/assignments/${assignmentId}/action`, {
        action: "approve",
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.assignmentId === assignmentId
            ? { ...u, assignmentStatus: "approved" }
            : u
        )
      );

      setSuccessMessage("Assignment approved successfully");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Approval failed", err);
      setErrorMessage("Failed to approve assignment");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  // REJECT ASSIGNMENT
  const rejectAssignment = async (assignmentId) => {
    try {
      setLoadingId(assignmentId);

      await api.put(`/trainer/assignments/${assignmentId}/action`, {
        action: "reject",
      });

      setUsers((prev) =>
        prev.filter((u) => u.assignmentId !== assignmentId)
      );

      setSuccessMessage("Assignment rejected successfully");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Rejection failed", err);
      setErrorMessage("Failed to reject assignment");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0B0F1A] rounded-2xl shadow-lg border border-gray-800 p-5 sm:p-6">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-600 bg-green-900/20 px-4 py-3 text-sm text-green-400">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-600 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-6 text-center sm:text-left">
          Trainer Assignments
        </h2>

        {/*  LOADER / EMPTY STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No assignments available
          </p>
        ) : null}

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.assignmentId}
              className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:shadow-md transition flex flex-col justify-between"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-100 break-words">
                  {user.name}
                </h3>

                <div className="sm:text-right">
                  <p className="text-xs uppercase font-semibold text-gray-400">
                    Time Slot
                  </p>
                  <span className="inline-block mt-1 text-xs font-medium bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-gray-200">
                    {user.timeSlot}
                  </span>
                </div>
              </div>

              {/* BODY */}
              <div className="space-y-2 text-sm text-gray-300">
                <p className="break-all">
                  <span className="font-medium text-gray-100">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-100">Phone:</span>{" "}
                  {user.phoneNumber}
                </p>
                <p>
                  <span className="font-medium text-gray-100">
                    Health Condition:
                  </span>{" "}
                  {user.healthCondition}
                </p>
                <p>
                  <span className="font-medium text-gray-100">Goal:</span>{" "}
                  {user.goalType}
                </p>
                <p>
                  <span className="font-medium text-gray-100">Plan:</span>{" "}
                  {user.planName} ({user.planType})
                </p>
                <p>
                  <span className="font-medium text-gray-100">Amount:</span>{" "}
                  ₹{user.planAmount}
                </p>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {user.assignmentStatus === "approved" && (
                  <span className="self-start text-xs font-semibold text-green-400 bg-green-900/30 px-3 py-1 rounded-full">
                    Approved
                  </span>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => approveAssignment(user.assignmentId)}
                    disabled={
                      loadingId === user.assignmentId ||
                      user.assignmentStatus === "approved"
                    }
                    className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg text-white transition
                      ${
                        user.assignmentStatus === "approved" ||
                        loadingId === user.assignmentId
                          ? "bg-green-700/50 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {user.assignmentStatus === "approved"
                      ? "Approved"
                      : loadingId === user.assignmentId
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    onClick={() => rejectAssignment(user.assignmentId)}
                    disabled={loadingId === user.assignmentId}
                    className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg text-white transition
                      ${
                        loadingId === user.assignmentId
                          ? "bg-red-700/50 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TrainerUsers;
