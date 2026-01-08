import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaDumbbell,
  FaClipboardList,
  FaCreditCard,
} from "react-icons/fa";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Trainers", path: "/admin/trainers", icon: <FaDumbbell /> },
    { name: "Plans", path: "/admin/plans", icon: <FaClipboardList /> },
    { name: "Payments", path: "/admin/payments", icon: <FaCreditCard /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition ${
                  isActive ? "bg-blue-500" : "hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
