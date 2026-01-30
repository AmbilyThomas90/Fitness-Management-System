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
  FaCreditCard,
  FaStar,
} from "react-icons/fa";

const Sidebar = ({ role = "user", isOpen, onClose }) => {
  const navigate = useNavigate();

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
    { name: "Feedback", path: "/user/feedback", icon: <FaStar /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Logo */}
        <div className="p-5 text-xl font-bold border-b border-gray-700">
         
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {userMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-400">
          © {new Date().getFullYear()} Smart Fitness Suite
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
