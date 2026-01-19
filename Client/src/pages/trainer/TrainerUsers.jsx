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
  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-100">
      <Users className="h-5 w-5 text-indigo-600" />
    </div>
    <h2 className="text-2xl font-semibold text-slate-800">
      Assigned Users
    </h2>
  </div>

  {assignments.length === 0 ? (
    /* Empty State */
    <div className="rounded-xl border border-dashed bg-slate-50 p-10 text-center">
      <Users className="mx-auto mb-3 h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-600">
        No users assigned yet
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Assigned users will appear here once available
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        {/* Table Head */}
        <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="h-4 w-4 text-indigo-500" /> User
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" /> Email
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" /> Phone
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" /> Age
              </div>
            </th>

            <th className="px-4 py-3 text-left text-slate-700">
              Gender
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" /> Health
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" /> Goal
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-cyan-500" /> Plan
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> Time Slot
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-500" /> Status
              </div>
            </th>

            <th className="px-4 py-3 text-left">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-teal-500" /> Assigned
              </div>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-200">
          {assignments.map((item) => (
            <tr
              key={item._id}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-800">
                {item.user?.name || "-"}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {item.user?.email || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.userProfile?.phoneNumber || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.userProfile?.age || "-"}
              </td>

              <td className="px-4 py-3 capitalize text-slate-700">
                {item.userProfile?.gender || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.userProfile?.healthCondition || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.goal?.goalType || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.plan?.planName || "-"}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {item.timeSlot}
              </td>

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
  )}
</div>


  );
};

export default TrainerUsers;
