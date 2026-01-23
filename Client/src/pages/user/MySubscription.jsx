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
<div className="mx-auto mt-10 w-full max-w-xl
                rounded-2xl bg-white
                p-5 sm:p-6
                shadow-lg border border-gray-100">

  {/* Header */}
  <h1 className="mb-5 text-xl sm:text-2xl
                 font-semibold text-slate-800">
    My Subscription
  </h1>

  {/* Subscription Details */}
  <div className="divide-y divide-gray-100
                  rounded-xl border border-gray-100
                  bg-gray-50 px-4 py-3
                  text-sm text-slate-700">

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">Plan</span>
      <span className="font-semibold">{plan.planName}</span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">Plan Type</span>
      <span>{planType}</span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">Amount</span>
      <span className="font-semibold text-indigo-600">
        ₹{planAmount}
      </span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">Status</span>
      <span className="rounded-full bg-emerald-100
                       px-3 py-0.5
                       text-xs font-semibold
                       text-emerald-700">
        {status}
      </span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">Start Date</span>
      <span>{new Date(startDate).toLocaleDateString()}</span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-medium text-slate-600">End Date</span>
      <span>{new Date(endDate).toLocaleDateString()}</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
    <button
      onClick={() => navigate("/user/goals")}
      className="flex w-full flex-1 items-center justify-center
                 gap-2 rounded-lg
                 bg-indigo-600 px-4 py-2.5
                 text-sm font-semibold text-white
                 hover:bg-indigo-700
                 transition"
    >
      <Target className="h-4 w-4" />
      Set Goal
    </button>

    <button
      onClick={() => navigate("/user/select-trainer")}
      className="flex w-full flex-1 items-center justify-center
                 gap-2 rounded-lg
                 bg-emerald-600 px-4 py-2.5
                 text-sm font-semibold text-white
                 hover:bg-emerald-700
                 transition"
    >
      <CalendarCheck className="h-4 w-4" />
      Trainer Appointment
    </button>
  </div>
</div>


  );
};

export default MySubscription;
