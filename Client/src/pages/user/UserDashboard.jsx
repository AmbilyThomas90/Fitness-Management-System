import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../../components/Navbar";

const UserDashboard = () => {
  return (
  <div className="min-h-screen bg-gray-100 flex flex-col">

  {/* Body */}
  <div className="flex flex-1 min-h-[calc(100vh-64px)]">

    {/* Sidebar */}
    <Sidebar role="user" />

    {/* Main Content */}
    <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
      <Outlet />
    </main>

  </div>
</div>

  );
};

export default UserDashboard;



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// const UserDashboard = () => {

//     const navigate = useNavigate();
  
  
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Global Navbar */}
//       <Navbar />
//         {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
//         User Dashboard
//       </h1>

       
//       </div>
     

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="font-semibold">Active Plan</h3>
//           <p className="text-blue-500 text-xl">Premium</p>
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="font-semibold">Trainer</h3>
//           <p className="text-green-500 text-xl">John Doe</p>
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="font-semibold">Workouts Completed</h3>
//           <p className="text-purple-500 text-xl">24</p>
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="font-semibold">Messages</h3>
//           <p className="text-red-500 text-xl">3 New</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
