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
    { name: "Trainers", path: "/user/select-trainer", icon: <FaUserTie /> },
    { name: "Workout", path: "/user/workouts", icon: <FaDumbbell /> },
    { name: "Nutrition", path: "/user/nutrition", icon: <FaAppleAlt /> },
    { name: "Progress", path: "/user/progress", icon: <FaChartLine /> },
    { name: "Payments", path: "/user/payments", icon: <FaCreditCard /> },
    { name: "Feedback", path: "/user/feedback", icon: <FaStar /> }
  ];

  const menu = role === "user" ? userMenu : [];

  return (
<aside
  className="
    fixed inset-y-0 left-0 z-40 w-64
    -translate-x-full lg:translate-x-0
    bg-gray-900 text-white
    flex flex-col
    transition-transform duration-300 ease-in-out
    lg:static lg:min-h-screen
  "
>
  {/* Logo / Branding */}
  <div className="flex items-center justify-center p-4 sm:p-6 border-b border-gray-700">
    <span className="text-xl sm:text-2xl font-bold tracking-wide">
     
    </span>
  </div>

  {/* Navigation Menu */}
  <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1.5">
    {menu.map((item, index) => (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) =>
          `
          flex items-center gap-3
          px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
          text-xs sm:text-sm font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }
        `
        }
      >
        <span className="text-base sm:text-lg shrink-0">
          {item.icon}
        </span>
        <span className="truncate">{item.name}</span>
      </NavLink>
    ))}
  </nav>

  {/* Footer */}
  <div className="p-3 sm:p-4 border-t border-gray-700 text-[10px] sm:text-xs text-center text-gray-400">
    © {new Date().getFullYear()} Smart Fitness Suite
  </div>
</aside>



  );
};

export default Sidebar;
