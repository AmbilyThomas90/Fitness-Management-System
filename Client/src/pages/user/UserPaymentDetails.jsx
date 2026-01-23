import React, { useEffect, useState } from "react";
import api from "../../api/api";


const UserPaymentDetails = () => {
  const [subscription, setSubscription] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get("/user/my-payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubscription(res.data.subscription);
        setPayment(res.data.payment); // ✅ capture payment
      } catch (error) {
        console.error(
          "No active subscription",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

 if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  const { plan, planType,planAmount, startDate, endDate, status } = subscription;

  return (
   <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200 mt-10">
  <h1 className="text-2xl font-bold text-gray-800 mb-6">My Subscription</h1>

  {/* Subscription Info */}
  <div className="space-y-3 text-gray-700">
    <p>
      <strong>Plan:</strong> {plan?.planName || "N/A"}
    </p>
    <p>
      <strong>Plan Type:</strong>{" "}
      <span className="capitalize">{planType || "N/A"}</span>
    </p>
    <p>
      <strong>Amount:</strong> ₹{planAmount || 0}
    </p>
    <p>
      <strong>Subscription Status:</strong>{" "}
      <span className="text-green-600 font-semibold">{status || "N/A"}</span>
    </p>
    <p>
      <strong>Start Date:</strong>{" "}
      {startDate ? new Date(startDate).toLocaleDateString() : "-"}
    </p>
    <p>
      <strong>End Date:</strong>{" "}
      {endDate ? new Date(endDate).toLocaleDateString() : "-"}
    </p>
  </div>

  {/* Payment Info */}
  {payment && (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Payment Details</h2>

      <p>
        <strong>Amount Paid:</strong> ₹{payment.amount || planAmount || 0}
      </p>
      <p>
        <strong>Payment Method:</strong> {payment.paymentMethod || "N/A"}
      </p>
      <p>
        <strong>Payment Status:</strong>{" "}
        <span className="uppercase text-blue-600 font-semibold">
          {payment.status || "N/A"}
        </span>
      </p>
    </div>
  )}
</div>

  );
};

export default UserPaymentDetails;
