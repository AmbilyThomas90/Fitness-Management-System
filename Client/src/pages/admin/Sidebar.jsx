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
<aside
  className="
    w-64
    max-w-full
    min-h-screen
    bg-gray-900
    overflow-y-auto
    overflow-x-hidden
    p-3 sm:p-4
    flex flex-col
  "
>
  {/* Logo */}
  <h2
    className="
      text-2xl sm:text-3xl
      font-bold
      text-white
      mb-6 sm:mb-8
      text-center
      tracking-tight
      whitespace-nowrap
    "
  >
    Admin Panel
  </h2>

  {/* Navigation */}
  <nav className="flex flex-col gap-1 sm:gap-2">
    <NavLink to="/admin/dashboard" end className={navLinkClasses}>
      <FaTachometerAlt className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">Dashboard</span>
    </NavLink>

    <NavLink to="/admin/dashboard/users" className={navLinkClasses}>
      <FaUsers className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">Users</span>
    </NavLink>

    <NavLink to="/admin/dashboard/trainers" className={navLinkClasses}>
      <FaUserTie className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">Trainers</span>
    </NavLink>

    <NavLink to="/admin/dashboard/plans" className={navLinkClasses}>
      <FaClipboardList className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">Plans</span>
    </NavLink>

    <NavLink to="/admin/dashboard/adminpayments" className={navLinkClasses}>
      <FaDollarSign className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">Payments</span>
    </NavLink>
  </nav>

  {/* Footer */}
  <div
    className="
      mt-auto
      pt-4 sm:pt-6
      text-xs sm:text-sm
      text-gray-400
      text-center
      leading-relaxed
    "
  >
    © {new Date().getFullYear()} Admin
  </div>
</aside>


  );
};
  
export default Sidebar;
