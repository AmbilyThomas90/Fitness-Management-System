import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUserTie, FaClipboardList, FaDollarSign } from "react-icons/fa";

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-lg"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
<aside className="w-64 h-screen overflow-y-auto bg-gray-900 p-4 flex flex-col">
      {/* Logo */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center tracking-tight">
        Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin/dashboard" end className={navLinkClasses}>
          <FaTachometerAlt className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/admin/dashboard/users" className={navLinkClasses}>
          <FaUsers className="w-5 h-5" />
          Users
        </NavLink>

        <NavLink to="/admin/dashboard/trainers" className={navLinkClasses}>
          <FaUserTie className="w-5 h-5" />
          Trainers
        </NavLink>

        <NavLink to="/admin/dashboard/plans" className={navLinkClasses}>
          <FaClipboardList className="w-5 h-5" />
          Plans
        </NavLink>

        <NavLink to="/admin/dashboard/adminpayments" className={navLinkClasses}>
          <FaDollarSign className="w-5 h-5" />
          Payments
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} Admin
      </div>
    </aside>
  );
};
  
export default Sidebar;
