import React, { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerUsers = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrainerUsers();
  }, []);

  const fetchTrainerUsers = async () => {
    try {
      const res = await api.get("/trainer-assignment/my-users");
      setAssignments(res.data?.assignments || []);
    } catch (err) {
      console.error("Fetch trainer users error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading users...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Assigned Users
      </h2>

      {assignments.length === 0 ? (
        <p className="text-gray-500">
          No users assigned yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">
                  Health Condition
                </th>
                <th className="px-4 py-3 text-left">Goal</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Time Slot</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">
                  Assigned Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {assignments.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.user?.name || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.user?.email || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.userProfile?.phoneNumber || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.userProfile?.age || "-"}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {item.userProfile?.gender || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.userProfile?.healthCondition ||
                      "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.goal?.goalType || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.plan?.planName || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.timeSlot}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(
                      item.assignDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainerUsers;
