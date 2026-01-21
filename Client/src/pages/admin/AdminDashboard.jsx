import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col">

  {/* Global Navbar */}
  <Navbar />

  {/* Main content area */}
  <div className="flex flex-1 overflow-hidden">

    {/* Sidebar */}
    <aside className="
        hidden md:block
        w-64
        bg-white dark:bg-slate-800
        border-r border-gray-200 dark:border-slate-700
        h-full
        flex-shrink-0
      "
    >
      <Sidebar />
    </aside>

    {/* Mobile Sidebar (optional drawer) */}
    {/* You can add a toggle for small screens here if needed */}

    {/* Main Content */}
    <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>

  </div>
</div>

  );
};

export default AdminDashboard;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";


// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   // ✅ Logout ONLY here
//   // const handleLogout = () => {
//   //   localStorage.removeItem("token");
//   //   localStorage.removeItem("role");
//   //   navigate("/", { replace: true });
//   // };

 
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Global Navbar */}
//       <Navbar />

//       {/* Dashboard Content */}
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold">
//             Admin Dashboard
//           </h1>

//           {/* <div className="flex gap-3">
           

//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </div> */}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold">Total Users</h3>
//             <p className="text-blue-500 text-xl">320</p>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold">Total Trainers</h3>
//             <p className="text-green-500 text-xl">45</p>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold">Total Revenue</h3>
//             <p className="text-purple-500 text-xl">₹2,40,000</p>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold">Pending Approvals</h3>
//             <p className="text-red-500 text-xl">6</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
