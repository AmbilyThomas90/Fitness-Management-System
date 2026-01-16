import { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/trainer/my-users-details");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      setErrorMessage("Failed to load assignments");
    }
  };

  //  APPROVE ASSIGNMENT (DO NOT REMOVE CARD)
  const approveAssignment = async (assignmentId) => {
    try {
      setLoadingId(assignmentId);

    api.put(`/trainer/assignments/${assignmentId}/action`, { action: "approve" });


      //  Update status instead of removing
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

  //  REJECT ASSIGNMENT
  const rejectAssignment = async (assignmentId) => {
    try {
      setLoadingId(assignmentId);

 api.put(`/trainer/assignments/${assignmentId}/action`, { action: "reject" });


      // Remove rejected assignment
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-800">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-800">
            {errorMessage}
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Trainer Assignments
        </h2>

        {users.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-10">
            No assignments available
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.assignmentId}
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h3>

                <div className="text-right">
                  <p className="text-xs uppercase font-semibold text-gray-500">
                    Time Slot
                  </p>
                  <span className="inline-block mt-1 text-xs font-medium bg-white border px-3 py-1 rounded-full text-gray-700">
                    {user.timeSlot}
                  </span>
                </div>
              </div>

              {/* BODY */}
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
                 <p><span className="font-medium">Health Condition:</span> {user.healthCondition}</p>
             <p>
  <span className="font-medium">Goal:</span> {user.goalType}
</p>
 
                <p>
                  <span className="font-medium">Plan:</span>{" "}
                  {user.planName} ({user.planType})
                </p>
                <p>
                  <span className="font-medium">Amount:</span> ₹{user.planAmount}
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6">
                {/* STATUS */}
                {user.assignmentStatus === "approved" && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Approved
                  </span>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => approveAssignment(user.assignmentId)}
                    disabled={
                      loadingId === user.assignmentId ||
                      user.assignmentStatus === "approved"
                    }
                    className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition
                      ${
                        user.assignmentStatus === "approved"
                          ? "bg-green-300 cursor-not-allowed"
                          : loadingId === user.assignmentId
                          ? "bg-green-300 cursor-not-allowed"
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition
                      ${
                        loadingId === user.assignmentId
                          ? "bg-red-300 cursor-not-allowed"
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
