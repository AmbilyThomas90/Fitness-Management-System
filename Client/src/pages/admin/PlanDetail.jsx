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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-xl"
      >
        <h3 className="text-xl font-bold mb-4">Edit Plan</h3>

        {/* Plan Name */}
        <input
          type="text"
          name="planName"
          value={planData.planName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="monthlyPlanAmount"
            value={planData.monthlyPlanAmount}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="yearlyPlanAmount"
            value={planData.yearlyPlanAmount}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
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
              <label key={feature} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={feature}
                  checked={!!planData[feature]}
                  onChange={handleChange}
                />
                {feature.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
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
