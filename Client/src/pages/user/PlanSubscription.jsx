import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

const PlanSubscription = () => {
  const { id } = useParams(); // planId from URL
  const location = useLocation();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  // Get plan type from location state (default to monthly)
  const planType = location.state?.planType || "monthly";

  // Fetch plan details on component load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (error) {
        console.error("Failed to load plan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, navigate]);

  // Determine amount before declaring the function
  const displayAmount = plan ? (planType === "yearly" ? plan.yearlyPlanAmount : plan.monthlyPlanAmount) : 0;

  // Main Subscription Logic
  const handleSubscribe = async () => {
    try {
      setSubscribing(true);
      const token = localStorage.getItem("token");

      if (!token || !plan) {
        alert("Session expired. Please login again.");
        return;
      }

      // STEP 1: Create Order on the Backend
      // This sends the amount and planId to your Node.js server
      const { data } = await api.post(
        "/subscriptions/create-order",
        {
          amount: displayAmount,
          planId: plan._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const order = data.order;

      // STEP 2: Configure Razorpay Checkout Options
      const options = {
        key: "rzp_test_S0UHDUsxK2zjHN", // Your actual Razorpay Test Key
        amount: order.amount,
        currency: order.currency,
        name: "Smart Fitness Suite",
        image: "https://your-domain.com/fithub-logo.png",
        description: `Buying ${plan.planName} (${planType})`,
        order_id: order.id, // Links this checkout to your backend order
        handler: async function (response) {
          try {
            // STEP 3: Verify Payment on Backend after success
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
              planType: planType,
              planAmount: displayAmount,
            };

            const result = await api.post("/subscriptions/verify", verifyData, {
              headers: { Authorization: `Bearer ${token}` },
            });

            alert(result.data.message || "Payment Successful!");
            navigate("/user/my-subscription");
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        
        prefill: {
          name: "User Name", // You can pass dynamic user data here
          email: "user@example.com",
        },
        theme: {
        color: "#1e293b", // Changes header to Black
      },
   
    modal: {
      
    backdropclose: true,   // Click outside to close
    escape: true,        // Esc key to close
    handleback: true,  // Better mobile experience
    confirm_close: true,
  },
      };

      // STEP 4: Open the Razorpay Modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initialization failed", error);
      alert(error.response?.data?.message || "Failed to initiate payment. Check server console.");
    } finally {
      setSubscribing(false);
    }
  };

  if (loading)
   {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}

  if (!plan) return <p className="p-6 text-center">Plan not found.</p>;

  return (
    <div className="mx-auto mt-10 w-full max-w-xl
                rounded-2xl bg-white
                p-6 sm:p-8
                shadow-xl border border-gray-100">

  {/* Header */}
  <h1 className="mb-6 text-xl sm:text-2xl
                 font-semibold text-gray-800
                 border-b border-gray-200 pb-4">
    Confirm Subscription
  </h1>

  {/* Plan Summary */}
  <div className="space-y-4 rounded-xl
                  bg-gray-50 p-4 sm:p-5
                  text-sm text-gray-700
                  border border-gray-100">

    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-500">
        Selected Plan
      </span>
      <span className="font-semibold text-gray-800">
        {plan.planName}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-500">
        Billing Cycle
      </span>
      <span className="capitalize">
        {planType}
      </span>
    </div>

    <div className="flex items-center justify-between
                    border-t border-gray-200 pt-4 text-lg">
      <span className="font-semibold text-gray-800">
        Total Amount
      </span>
      <span className="font-extrabold text-emerald-600">
        ₹{displayAmount}
      </span>
    </div>
  </div>

  {/* Action Button */}
  <button
    onClick={handleSubscribe}
    disabled={subscribing}
    className={`mt-8 w-full
                rounded-xl py-3.5
                text-base sm:text-lg
                font-semibold text-white
                transition-all duration-200
                ${
                  subscribing
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                }`}
  >
    {subscribing ? "Processing Payment..." : "Proceed to Pay"}
  </button>

  {/* Footer */}
  <p className="mt-4 text-center text-xs text-gray-400">
    Secure payment powered by Razorpay.
  </p>
</div>

  );
};

export default PlanSubscription;