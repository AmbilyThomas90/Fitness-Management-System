import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

const PlanForm = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleViewDetails = (id) => {
    // Check if we are currently inside the dashboard or on public home
    if (location.pathname.startsWith("/user")) {
      // Stay inside the dashboard layout
      navigate(`/user/planview/${id}`);
    } else {
      // Public route view
      navigate(`/plans/${id}`);
    }
  };

  if (loading) return <div className="p-10 text-center font-semibold">Loading plans...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-gray-900 tracking-tight">
        Choose Your Fitness Journey
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            className="group flex flex-col justify-between border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 bg-white border-t-4 border-t-indigo-500"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {plan.planName}
              </h3>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Monthly</span>
                  <span className="text-xl font-bold text-gray-900">₹{plan.monthlyPlanAmount}</span>
                </div>
                <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg">
                  <span className="text-indigo-600 text-sm font-semibold">Yearly (Save)</span>
                  <span className="text-xl font-bold text-indigo-700">₹{plan.yearlyPlanAmount}</span>
                </div>
              </div>

              {/* Optional: Short list of perks */}
              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                {plan.personalTrainer && <li>• Personal Training Included</li>}
                {plan.wifiService && <li>• Free Gym Wi-Fi</li>}
              </ul>
            </div>
            
            <button
              onClick={() => handleViewDetails(plan._id)}
              className="mt-8 w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
            >
              View Details & Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanForm;