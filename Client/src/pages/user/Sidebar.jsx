import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBullseye,
  FaChartLine,
  FaDumbbell,
  FaAppleAlt,
  FaUserTie,
  FaCalendarCheck,
  FaComments,
  FaCreditCard,
  FaStar,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = ({ role = "user" }) => {
  const navigate = useNavigate();
 // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const name = localStorage.getItem("name");
  
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userMenu = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaHome /> },
    { name: "Profile", path: "/user/profile", icon: <FaUser /> },
       { name: "Plan Booking", path: "/user/planview", icon: <FaCalendarCheck /> },
    { name: "Goals", path: "/user/goals", icon: <FaBullseye /> },
    { name: "Progress", path: "/user/progress", icon: <FaChartLine /> },
    { name: "Workout", path: "/user/workouts", icon: <FaDumbbell /> },
    { name: "Nutrition", path: "/user/nutrition", icon: <FaAppleAlt /> },
    { name: "Trainers", path: "/user/select-trainer", icon: <FaUserTie /> },
 
    //{ name: "Messages", path: "/user/messages", icon: <FaComments /> },
    { name: "Payments", path: "/user/payments", icon: <FaCreditCard /> },
    { name: "Feedback", path: "/user/feedback", icon: <FaStar /> }
  ];

  const menu = role === "user" ? userMenu : [];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        {/* User name  */}
        {/* Hi,<span className="text-blue-400">{name || "Profile"}</span> */}
        
        
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                isActive
                  ? "bg-blue-600"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout
      <button
        onClick={logoutHandler}
        className="flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 transition"
      >
        <FaSignOutAlt />
        Logout
      </button> */}
    </aside>
  );
};

export default Sidebar;
