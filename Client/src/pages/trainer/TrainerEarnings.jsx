import { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerEarnings = () => {
  const [data, setData] = useState({
    totalEarnings: 10000,
    earnings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/trainer/earnings");
        setData(res.data || { totalEarnings: 0, earnings: [] });
      } catch (error) {
        console.error("Failed to load earnings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* <h2>₹{data.totalEarnings}</h2> */}
     <h2> Total Earning: ₹150000</h2> 



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
