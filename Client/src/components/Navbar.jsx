import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle, FaAlignLeft } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ openLogin, openRegister, onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // ✅ Role-based dashboard detection
  const isDashboard =
    (role === "user" && location.pathname.startsWith("/user")) ||
    (role === "admin" && location.pathname.startsWith("/admin"));

  const getDashboardPath = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "trainer") return "/trainer/dashboard";
    if (role === "user") return "/user/dashboard";
    return "/";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* ✅ Sidebar toggle for USER & ADMIN (mobile only) */}
            {isDashboard && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
                aria-label="Toggle Sidebar"
              >
                <FaAlignLeft size={20} />
              </button>
            )}

            <Link to="/" className="text-xl font-bold">
              Smart Fitness Suite
            </Link>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/exercise" className="hover:text-blue-400 transition">Exercise</Link>

            {token && (
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-lg"
              >
                <FaUserCircle />
                {name || "Profile"}
              </Link>
            )}

            {!token ? (
              <>
                <button onClick={openLogin}>Login</button>
                <button
                  onClick={openRegister}
                  className="bg-blue-600 px-4 py-1.5 rounded-lg"
                >
                  Join Now
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1.5 rounded-lg"
              >
                Logout
              </button>
            )}

            <ThemeToggle />
          </div>

          {/* MOBILE RIGHT */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button onClick={toggleMenu}>
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all ${isOpen ? "max-h-96" : "max-h-0"
          } overflow-hidden`}
      >
        <ul className="flex flex-col items-center py-4 space-y-4">
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
  <li>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/exercise" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              Exercise
            </Link>
          </li>
          {token && (
            <li>
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="text-green-400"
              >
                Dashboard
              </Link>
            </li>
          )}

          {token ? (
            <li>
              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li><button onClick={openLogin}>Login</button></li>
              <li><button onClick={openRegister}>Register</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
