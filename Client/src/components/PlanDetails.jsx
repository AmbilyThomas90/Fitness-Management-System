import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState("monthly");

  const [subscription, setSubscription] = useState(null);
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const planRes = await api.get(`/plans/${id}`);
        setPlan(planRes.data);

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const subRes = await api.get("/subscriptions/my-subscription");
          const sub = subRes.data?.subscription;

          if (!sub?.endDate) {
            setSubscription(null);
            setIsExpired(true);
            return;
          }

          const today = new Date();
          const endDate = new Date(sub.endDate);

          if (endDate >= today) {
            setSubscription(sub);
            setIsExpired(false);
          } else {
            setSubscription(null);
            setIsExpired(true);
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Subscription error:", err);
          }
          setSubscription(null);
          setIsExpired(true);
        }
      } catch (err) {
        console.error("Plan fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBuyPlan = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (subscription && !isExpired) {
      alert(
        `Active plan till ${new Date(
          subscription.endDate
        ).toLocaleDateString()}`
      );
      return;
    }

    const amount =
      planType === "monthly"
        ? plan.monthlyPlanAmount
        : plan.yearlyPlanAmount;

    navigate(`/user/plan-subscription/${id}`, {
      state: { planType, amount, planName: plan.planName },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );

  if (!plan)
    return (
      <p className="p-10 text-center text-red-500">
        Plan not found
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-semibold text-blue-600 hover:text-green-900 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900">
        {plan.planName}
      </h1>

      {/* Duration */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl">
        <label className="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">
          Select Duration
        </label>
        <select
          value={planType}
          onChange={(e) => setPlanType(e.target.value)}
          className="w-full bg-white border border-blue-200 p-3 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="monthly">
            Monthly Plan — ₹{plan.monthlyPlanAmount}
          </option>
          <option value="yearly">
            Yearly Plan — ₹{plan.yearlyPlanAmount}
          </option>
        </select>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Included Premium Facilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.waterStations && <div className="text-gray-600">✅ Water Stations</div>}
          {plan.lockerRooms && <div className="text-gray-600">✅ Locker Rooms</div>}
          {plan.wifiService && <div className="text-gray-600">✅ Wi-Fi Service</div>}
          {plan.cardioClass && <div className="text-gray-600">✅ Cardio Classes</div>}
          {plan.personalTrainer && <div className="text-gray-600">✅ Personal Trainer</div>}
          {plan.groupFitnessClasses && <div className="text-gray-600">✅ Group Fitness</div>}
        </div>
      </div>

      <button
        onClick={handleBuyPlan}
        disabled={subscription && !isExpired}
        className={`mt-8 w-full py-4 font-bold rounded ${
          subscription && !isExpired
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {subscription && !isExpired ? (
          <span>
            Your current subscription plan{" "}
            <span className="font-semibold">
              {subscription.plan?.planName}
            </span>{" "}
            (Valid up to:{" "}
            <span className="text-red-600 font-bold">
              {new Date(subscription.endDate).toLocaleDateString()}
            </span>
            )
          </span>
        ) : (
          "Proceed to Payment"
        )}
      </button>

    </div>
  );
};

export default PlanDetails;
