import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import api from "../../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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


  const toggleBlock = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/admin/users/${userId}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev =>
        prev.map(user =>
          user._id === userId
            ? {
              ...user,
              profile: {
                ...user.profile,
                isActive: !user.profile?.isActive,
              },
            }
            : user
        )
      );
    } catch (err) {
      console.error("Block/unblock failed", err);
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Section Header */}
      <h2 className="flex items-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 gap-2">
        <FaUsers className="w-6 h-6 text-blue-500" />
        Users
      </h2>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid gap-4 md:hidden">
        {users.map((user) => {
          const isActive = user.profile?.isActive;

          return (
            <div
              key={user._id}
              className="
                bg-white dark:bg-slate-800
                rounded-2xl
                shadow-sm hover:shadow-lg
                p-4 sm:p-5
                transition-all duration-300
              "
            >
              {/* Header: Name + Status */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive
                      ? "bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-400"
                    }`}
                >
                  {isActive ? "Active" : "Blocked"}
                </span>
              </div>

              {/* User Info */}
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                📞 {user.profile?.phoneNumber || "-"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                🎯 Goal: {user.goal?.goalType || "-"}
              </p>
              {/* <p className="text-sm text-gray-500 dark:text-gray-300">
                💰 Plan Amount:{" "}
                {user.subscription ? `$${user.subscription.amount}` : "No Plan"}
              </p> */}

              {/* Action Button */}
              <button
                onClick={() => toggleBlock(user._id)}
                className={`w-full mt-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isActive ? "Block User" : "Unblock User"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Goal</th>
              {/* <th className="p-3 text-left">Plan Amount</th>
              <th className="p-3 text-left">Plan Type</th> */}
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const isActive = user.profile?.isActive;

                return (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.profile?.phoneNumber || "-"}</td>
                    <td className="p-3">{user.profile?.age || "-"}</td>
                    <td className="p-3">{user.profile?.gender || "-"}</td>
                    <td className="p-3">{user.goal?.goalType || "-"}</td>

                    {/* <td className="p-3">  {user.payment?.planName || "No Plan"} </td>

                    <td className="p-3 font-semibold text-green-600">{user.payment?.amount
                        ? `₹${user.payment.amount.toLocaleString()}`  : "-"}</td> */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive
                            ? "bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-400"
                          }`}
                      >
                        {isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleBlock(user._id)}
                        className={`px-3 py-1 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-300 ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
