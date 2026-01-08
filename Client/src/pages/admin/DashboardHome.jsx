import { useEffect, useState } from "react";
import api from "../../api/api";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    trainers: 0,
    revenue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStats(res.data))
      .catch(err => console.error("Dashboard load failed", err));
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-semibold">{stats.users}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <p className="text-gray-500">Trainers</p>
          <p className="text-2xl font-semibold">{stats.trainers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <p className="text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold">₹{stats.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

// import { useEffect, useState } from "react";
// import api from "../../api/api";

// const DashboardHome = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     trainers: 0,
//     revenue: 0,
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     api
//       .get("/admin/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => setStats(res.data))
//       .catch(err => console.error("Dashboard load failed", err));
//   }, []);

//   return (
//     <div className="p-4 md:p-6">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
//           <p className="text-gray-500">Users</p>
//           <p className="text-2xl font-semibold">{stats.users}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
//           <p className="text-gray-500">Trainers</p>
//           <p className="text-2xl font-semibold">{stats.trainers}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-2xl font-semibold">₹{stats.revenue}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;
