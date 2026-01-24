import { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/trainer/earnings");
        setData(res.data);
      } catch (error) {
        console.error("Failed to load earnings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading earnings...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">
        💰 Trainer Earnings
      </h2>

      {/* Total */}
      <div className="bg-green-100 p-4 rounded-xl">
        <p className="text-sm text-gray-600">Total Earnings</p>
        <p className="text-2xl font-bold text-green-700">
          ₹{data.totalEarnings.toLocaleString()}
        </p>
      </div>

      {/* Earnings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.earnings.map((e, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <p className="font-semibold">{e.user.name}</p>
            <p className="text-sm text-gray-500">{e.user.email}</p>

            <div className="mt-2 text-sm text-gray-700">
              <p>Plan: {e.planName}</p>
              <p>Earning: ₹{e.amount}</p>
              <p>Method: {e.paymentMethod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerEarnings;
