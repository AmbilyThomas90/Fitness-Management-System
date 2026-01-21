import React, { useEffect, useState } from "react";
import api from "../../api/api";

const PlanDetail = ({ plan, onClose, onRefresh }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PLAN ================= */
  useEffect(() => {
    if (plan) {
      setPlanData({ ...plan });
    }
  }, [plan]);

  if (!planData) return null;

  /* ================= FORM HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // checkbox
    if (type === "checkbox") {
      setPlanData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // plan name
    if (name === "planName") {
      setPlanData((prev) => ({
        ...prev,
        planName: value,
      }));
      return;
    }

    // allow empty
    if (value === "") {
      setPlanData((prev) => ({
        ...prev,
        [name]: "",
        ...(name === "monthlyPlanAmount" && { yearlyPlanAmount: "" }),
      }));
      return;
    }

    // numbers only
    if (!/^\d+$/.test(value)) return;

    if (name === "monthlyPlanAmount") {
      setPlanData((prev) => ({
        ...prev,
        monthlyPlanAmount: value,
        yearlyPlanAmount: Number(value) * 12,
      }));
      return;
    }

    setPlanData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE PLAN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/admin/plans/${planData._id}`, {
        ...planData,
        monthlyPlanAmount: Number(planData.monthlyPlanAmount),
        yearlyPlanAmount: Number(planData.monthlyPlanAmount) * 12,
      });

      alert("Plan updated successfully");
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE PLAN ================= */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await api.delete(`/admin/plans/${planData._id}`);
      alert("Plan deleted successfully");
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan");
    }
  };

  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-xl transition-transform transform scale-100 md:scale-100"
  >
    {/* Header */}
    <h3 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900 dark:text-white">
      Edit Plan
    </h3>

    {/* Plan Name */}
    <input
      type="text"
      name="planName"
      value={planData.planName}
      onChange={handleChange}
      className="w-full border border-gray-300 dark:border-slate-600 p-2 sm:p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
      placeholder="Plan Name"
      required
    />

    {/* Pricing */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <input
        type="text"
        name="monthlyPlanAmount"
        value={planData.monthlyPlanAmount}
        onChange={handleChange}
        className="border border-gray-300 dark:border-slate-600 p-2 sm:p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
        placeholder="Monthly Amount"
        required
      />
      <input
        type="text"
        name="yearlyPlanAmount"
        value={planData.yearlyPlanAmount}
        readOnly
        className="border border-gray-300 dark:border-slate-600 p-2 sm:p-3 rounded w-full bg-gray-100 dark:bg-slate-700 dark:text-white"
        placeholder="Yearly Amount"
      />
    </div>

    {/* Features */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {Object.keys(planData)
        .filter(
          (key) =>
            ![
              "_id",
              "planName",
              "monthlyPlanAmount",
              "yearlyPlanAmount",
              "createdAt",
              "updatedAt",
              "__v",
            ].includes(key)
        )
        .map((feature) => (
          <label key={feature} className="flex items-center gap-2 text-sm sm:text-base cursor-pointer">
            <input
              type="checkbox"
              name={feature}
              checked={!!planData[feature]}
              onChange={handleChange}
              className="accent-indigo-600 w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="dark:text-white">{feature.replace(/([A-Z])/g, " $1")}</span>
          </label>
        ))}
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row justify-between gap-3">
      <button
        type="button"
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded w-full sm:w-auto transition"
      >
        Delete
      </button>

      <div className="flex gap-3 flex-1 sm:flex-none justify-between sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-800 dark:text-white px-4 py-2 sm:px-5 sm:py-3 rounded w-full sm:w-auto transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded w-full sm:w-auto transition"
        >
          {loading ? "Updating..." : "Update Plan"}
        </button>
      </div>
    </div>
  </form>
</div>

  );
};

export default PlanDetail;
