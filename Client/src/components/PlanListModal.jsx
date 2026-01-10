import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCardModal";
import api from "../api/api";

const PlanListModal = ({ onClose, onLogin }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");

        // ✅ Works for BOTH formats:
        // 1) res.data = []
        // 2) res.data = { plans: [] }
        const planData = Array.isArray(res.data)
          ? res.data
          : res.data?.plans ?? [];

        setPlans(planData);
      } catch (err) {
        console.error("Fetch plans error:", err);
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">
          Choose Your Plan
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading plans...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-500 font-medium">
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading && !error && plans.length === 0 && (
          <p className="text-center text-gray-500">
            No plans available
          </p>
        )}

        {/* Plans Grid */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id || plan.id}
                plan={plan}
                onViewDetails={onLogin} // 🔐 login required
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanListModal;
