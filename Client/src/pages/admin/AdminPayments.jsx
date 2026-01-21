import React, { useEffect, useState } from "react";
import api from "../../api/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/adminpayments");

      // FULL server response
      console.log("Admin Payments Response:", response.data);

      if (response.data?.success && Array.isArray(response.data.data)) {
        // ✅ CORRECT KEY
        setPayments(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback if backend sends array directly
        setPayments(response.data);
      } else {
        console.warn("Unexpected data format:", response.data);
        setPayments([]);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      console.error("Failed to load payments:", errorMsg);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPayments();
}, []);


  if (loading)  {
return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
);
    }

  return (
 <div className="p-4 md:p-6">
  {/* Section Header */}
  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
    All Payments
  </h2>

  {/* Table Container */}
  <div className="overflow-x-auto shadow-lg rounded-lg">
    <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-slate-800">
      <thead className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
        <tr>
          <th className="p-3 text-left">User</th>
          <th className="p-3 text-left">Plan</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Service Fee</th>
          <th className="p-3 text-left">Trainer Income</th>
          <th className="p-3 text-left">Start</th>
          <th className="p-3 text-left">End</th>
          <th className="p-3 text-left">Plan Status</th>
          <th className="p-3 text-left">Payment Status</th>
          <th className="p-3 text-left">Method</th>
        </tr>
      </thead>

      <tbody>
        {payments.length === 0 ? (
          <tr>
            <td colSpan="10" className="p-4 text-center text-gray-500 dark:text-gray-300">
              No payment history found.
            </td>
          </tr>
        ) : (
          payments.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 transition">
              {/* USER */}
              <td className="p-3">{p.userName || "Deleted User"}</td>

              {/* PLAN */}
              <td className="p-3">{p.planName}</td>

              {/* AMOUNT */}
              <td className="p-3">₹{p.planAmount}</td>

              {/* SERVICE FEE */}
              <td className="p-3">₹{p.platformFee}</td>

              {/* TRAINER INCOME */}
              <td className="p-3">₹{p.trainerEarning}</td>

              {/* START DATE */}
              <td className="p-3">
                {p.subscriptionStartDate
                  ? new Date(p.subscriptionStartDate).toLocaleDateString()
                  : "-"}
              </td>

              {/* END DATE */}
              <td className="p-3">
                {p.subscriptionEndDate
                  ? new Date(p.subscriptionEndDate).toLocaleDateString()
                  : "-"}
              </td>

              {/* PLAN STATUS */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.subscriptionStatus === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
                      : p.subscriptionStatus === "expired"
                      ? "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-300"
                  }`}
                >
                  {p.subscriptionStatus?.toUpperCase() || "N/A"}
                </span>
              </td>

              {/* PAYMENT STATUS */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.paymentStatus === "success"
                      ? "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
                      : p.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-600/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400"
                  }`}
                >
                  {p.paymentStatus?.toUpperCase()}
                </span>
              </td>

              {/* PAYMENT METHOD */}
              <td className="p-3 uppercase text-xs font-semibold">{p.paymentMethod}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


  );
};

export default AdminPayments;