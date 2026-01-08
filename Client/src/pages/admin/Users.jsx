import { useEffect, useState } from "react";
import api from "../../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Unable to load users");
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

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid gap-4 md:hidden">
        {users.map(user => {
          const isActive = user.profile?.isActive;

          return (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow p-4 space-y-2"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{user.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isActive ? "Active" : "Blocked"}
                </span>
              </div>

              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm">📞 {user.profile?.phoneNumber || "-"}</p>
              <p className="text-sm">
                🎯 Goal: {user.goal?.goalType || "-"}
              </p>

              <button
                onClick={() => toggleBlock(user._id)}
                className={`w-full mt-2 py-2 rounded text-white text-sm font-medium ${
                  isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isActive ? "Block User" : "Unblock User"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Goal</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => {
              const isActive = user.profile?.isActive;

              return (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.profile?.phoneNumber || "-"}</td>
                  <td className="p-3">{user.profile?.age || "-"}</td>
                  <td className="p-3">{user.profile?.gender || "-"}</td>
                  <td className="p-3">{user.goal?.goalType || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isActive ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className={`px-3 py-1 rounded text-white text-xs font-medium ${
                        isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isActive ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
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
