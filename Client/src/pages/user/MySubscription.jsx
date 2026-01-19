import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Target, CalendarCheck } from "lucide-react";


const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        //  Corrected URL to match backend route
        const res = await api.get("/subscriptions/my-subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubscription(res.data.subscription);
      } catch (error) {
        console.error("No active subscription", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}


  if (!subscription) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No Active Subscription</h2>
        <p className="text-gray-600 mt-2">
          Please subscribe to a plan to access premium features.
        </p>
      </div>
    );
  }

  const { plan, planType, planAmount, startDate, endDate, status } =
    subscription;

  return (
<div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
  <h1 className="mb-4 text-2xl font-semibold text-slate-800">
    My Subscription
  </h1>

  {/* Subscription Details */}
  <div className="space-y-2 text-slate-700">
    <p>
      <strong>Plan:</strong> {plan.planName}
    </p>
    <p>
      <strong>Plan Type:</strong> {planType}
    </p>
    <p>
      <strong>Amount:</strong> ₹{planAmount}
    </p>
    <p>
      <strong>Status:</strong>{" "}
      <span className="font-semibold text-emerald-600">
        {status}
      </span>
    </p>
    <p>
      <strong>Start Date:</strong>{" "}
      {new Date(startDate).toLocaleDateString()}
    </p>
    <p>
      <strong>End Date:</strong>{" "}
      {new Date(endDate).toLocaleDateString()}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex gap-3">
    <button
      onClick={() => navigate("/user/goals")}
      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      <Target className="h-4 w-4" />
      Set Goal
    </button>

    <button
      onClick={() => navigate("/user/select-trainer")}
      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
    >
      <CalendarCheck className="h-4 w-4" />
      Trainer Appointment
    </button>
  </div>
</div>

  );
};

export default MySubscription;
