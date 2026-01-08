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


  if (loading) return <div className="p-6 text-center">Loading payment records...</div>;

  return (
    <div className="p-6">
  <h2 className="text-2xl font-bold mb-4">All Payments</h2>

  <div className="overflow-x-auto shadow rounded-lg">
    <table className="w-full border-collapse bg-white">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 border">User</th>
          <th className="p-3 border">Plan</th>
          <th className="p-3 border">Amount</th>
          <th className="p-3 border">Start</th>
          <th className="p-3 border">End</th>
          <th className="p-3 border">Plan Status</th>
          <th className="p-3 border">Payment Status</th>
          <th className="p-3 border">Method</th>
        </tr>
      </thead>

      <tbody>
        {payments.length === 0 ? (
          <tr>
            <td colSpan="8" className="p-4 text-center">
              No payment history found.
            </td>
          </tr>
        ) : (
          payments.map((p) => (
            <tr
              key={p._id}
              className="border-t text-center hover:bg-gray-50"
            >
              {/* USER */}
              <td className="p-3 border">
                {p.userName || "Deleted User"}
              </td>

              {/* PLAN */}
              <td className="p-3 border">{p.planName}</td>

              {/* AMOUNT */}
              <td className="p-3 border">₹{p.planAmount}</td>

              {/* START DATE */}
              <td className="p-3 border">
                {p.subscriptionStartDate
                  ? new Date(p.subscriptionStartDate).toLocaleDateString()
                  : "-"}
              </td>

              {/* END DATE */}
              <td className="p-3 border">
                {p.subscriptionEndDate
                  ? new Date(p.subscriptionEndDate).toLocaleDateString()
                  : "-"}
              </td>

              {/* PLAN STATUS */}
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    p.subscriptionStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : p.subscriptionStatus === "expired"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {p.subscriptionStatus?.toUpperCase() || "N/A"}
                </span>
              </td>

              {/* PAYMENT STATUS */}
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    p.paymentStatus === "success"
                      ? "bg-green-100 text-green-700"
                      : p.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.paymentStatus?.toUpperCase()}
                </span>
              </td>

              {/* PAYMENT METHOD */}
              <td className="p-3 border uppercase text-xs font-bold">
                {p.paymentMethod}
              </td>
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