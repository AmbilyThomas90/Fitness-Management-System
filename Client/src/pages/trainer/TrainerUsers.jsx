import React, { useEffect, useState } from "react";
import api from "../../api/api";
 import {
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  HeartPulse,
  Target,
  ClipboardList,
  Clock,
  Activity,
  CalendarCheck
} from "lucide-react";


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

  
  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}

  if (error) {
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
   
<div className="space-y-6">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-100">
        <Users className="h-5 w-5 text-indigo-600" />
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
        Assigned Users
      </h2>
    </div>
  </div>

  {assignments.length === 0 ? (
    /* Empty State */
    <div className="rounded-xl border border-dashed bg-slate-50 p-8 sm:p-10 text-center">
      <Users className="mx-auto mb-3 h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-600">
        No users assigned yet
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Assigned users will appear here once available
      </p>
    </div>
  ) : (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Health</th>
              <th className="px-4 py-3 text-left">Goal</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Time Slot</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Assigned</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {assignments.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.user?.name || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
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
                  {item.userProfile?.healthCondition || "-"}
                </td>
                <td className="px-4 py-3">
                  {item.goal?.goalType || "-"}
                </td>
                <td className="px-4 py-3">
                  {item.plan?.planName || "-"}
                </td>
                <td className="px-4 py-3">{item.timeSlot}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "completed"
                        ? "bg-sky-100 text-sky-700"
                        : item.status === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(item.assignDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE / TABLET CARD VIEW ================= */}
      <div className="grid gap-4 lg:hidden">
        {assignments.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                {item.user?.name || "-"}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "completed"
                    ? "bg-sky-100 text-sky-700"
                    : item.status === "rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-500">{item.user?.email}</p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Phone:</span> {item.userProfile?.phoneNumber || "-"}</p>
              <p><span className="font-medium">Age:</span> {item.userProfile?.age || "-"}</p>
              <p><span className="font-medium">Gender:</span> {item.userProfile?.gender || "-"}</p>
              <p><span className="font-medium">Goal:</span> {item.goal?.goalType || "-"}</p>
              <p><span className="font-medium">Plan:</span> {item.plan?.planName || "-"}</p>
              <p><span className="font-medium">Time:</span> {item.timeSlot}</p>
            </div>

            <p className="text-xs text-slate-400">
              Assigned on {new Date(item.assignDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </>
  )}
</div>



  );
};

export default TrainerUsers;
