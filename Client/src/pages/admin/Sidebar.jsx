import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-lg"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 h-screen bg-gray-900 p-4 flex flex-col">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" end className={navLinkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/dashboard/users" className={navLinkClasses} >
          Users
        </NavLink>

        <NavLink to="/admin/dashboard/trainers" className={navLinkClasses}>
          Trainers
        </NavLink>

        <NavLink to="/admin/dashboard/plans" className={navLinkClasses}>
          Plans
        </NavLink>

        <NavLink to="/admin/dashboard/adminpayments" className={navLinkClasses}>
          Payments
        </NavLink>

        <NavLink to="/admin/dashboard/analytics" className={navLinkClasses}>
          Analytics
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-sm text-gray-400 text-center">
        © 2025 Admin
      </div>
    </aside>
  );
};

export default Sidebar;
