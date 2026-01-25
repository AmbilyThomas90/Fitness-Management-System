import { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerEarnings = () => {
  const [data, setData] = useState({
    totalEarnings: 0,
    payments: [], // ✅ always array
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/trainer/earnings");

        setData({
          totalEarnings: res.data?.totalEarnings || 0,
          payments: Array.isArray(res.data?.payments)
            ? res.data.payments
            : [],
        });
         console.log("✅ Trainer Earnings:", res.data);
      } catch (error) {
        console.error("Failed to load earnings", error);
        setData({ totalEarnings: 0, payments: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

   if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}

  const payments = data.payments || []; // ✅ absolute safety

  return (
 <div className="bg-[#0f172a] rounded-2xl p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-white">
      Total Earnings
    </h2>
    <span className="text-lg font-bold text-emerald-400">
      ₹{data.totalEarnings}
    </span>
  </div>

  {/* Earnings Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {payments.length === 0 ? (
      <p className="text-gray-400 text-sm">
        No approved earnings yet
      </p>
    ) : (
      payments.map((e, i) => (
        <div
          key={i}
          className="bg-[#020617] border border-gray-800 rounded-xl p-4 hover:border-emerald-500 transition"
        >
          {/* User Info */}
          <div className="mb-3">
            <p className="text-white font-semibold text-base">
              {e.user?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-400">
              {e.user?.email || "N/A"}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-3" />

          {/* Payment Details */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Plan</span>
              <span className="text-gray-100">
                {e.planName || "N/A"}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Plan Amount</span>
              <span className="text-gray-100">
                ₹{e.planAmount || 0}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Your Earning</span>
              <span className="text-emerald-400 font-semibold">
                ₹{e.trainerEarning}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Payment</span>
              <span className="uppercase text-xs tracking-wide text-gray-400">
                {e.paymentMethod}
              </span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
};

export default TrainerEarnings;
