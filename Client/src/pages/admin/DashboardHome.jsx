import { useEffect, useState } from "react";
import { FaUsers, FaUserTie, FaDollarSign } from "react-icons/fa";
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
   <div className="p-4 sm:p-6 lg:p-8">
  {/* Header */}
  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
    Dashboard
  </h1>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    
    {/* Users Card */}
 <div className="
    bg-white dark:bg-slate-800
    rounded-2xl
    shadow-md hover:shadow-xl
    p-4 sm:p-6
    flex flex-col items-center justify-center
    transition-transform duration-300 hover:-translate-y-1
">
  {/* Icon + Label */}
  <div className="flex items-center gap-2 mb-2">
    <FaUsers className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
    <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
      Users
    </p>
  </div>

  {/* Value */}
  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-2">
    {stats.users}
  </p>
</div>

{/* Trainers Card */}
<div className="
    bg-white dark:bg-slate-800
    rounded-2xl
    shadow-md hover:shadow-xl
    p-4 sm:p-6
    flex flex-col items-center justify-center
    transition-transform duration-300 hover:-translate-y-1
">
  {/* Icon + Label */}
  <div className="flex items-center gap-2 mb-2">
    <FaUserTie className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
    <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
      Trainers
    </p>
  </div>

  {/* Value */}
  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-2">
    {stats.trainers}
  </p>
</div>

{/* Revenue Card */}
<div className="
    bg-white dark:bg-slate-800
    rounded-2xl
    shadow-md hover:shadow-xl
    p-4 sm:p-6
    flex flex-col items-center justify-center
    transition-transform duration-300 hover:-translate-y-1
">
  {/* Icon + Label */}
  <div className="flex items-center gap-2 mb-2">
    <FaDollarSign className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
    <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
      Revenue
    </p>
  </div>

  {/* Value */}
  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-2">
    ₹{stats.revenue}
  </p>
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
