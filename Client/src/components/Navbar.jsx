import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ openLogin, openRegister }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Auth info
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // Dashboard path
  const getDashboardPath = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "trainer") return "/trainer/dashboard";
    if (role === "user") return "/user/dashboard";
    return "/";
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-wide"
          >
            Smart Fitness Suite
          </Link>

          {/* Right side (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/about" className="hover:text-blue-400 transition">About</Link>
            <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            {/* <Link to="/exercise" className="hover:text-blue-400 transition">Exercise</Link> */}

            {/* Logged-in user */}
            {token && (
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
              >
                <FaUserCircle size={18} />
                <span>{name || "Profile"}</span>
              </Link>
            )}

            {/* Login / Logout */}
            {!token ? (
              <>
                <span
                  onClick={openLogin}
                  className="cursor-pointer hover:text-blue-400 transition"
                >
                  Login
                </span>
                <span
                  onClick={openRegister}
                  className="cursor-pointer hover:text-blue-400 transition"
                >
                 Join Now
                </span>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button onClick={toggleMenu}>
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden bg-gray-900 border-t border-gray-800
          transition-all duration-300
          ${isOpen ? "block" : "hidden"}
        `}
      >
        <ul className="flex flex-col items-center py-4 space-y-4">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              Contact
            </Link>
          </li>
          {/* <li>
            <Link to="/exercise" onClick={() => setIsOpen(false)} className="hover:text-blue-400">
              Exercise
            </Link>
          </li> */}

          {token && (
            <li>
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <FaUserCircle size={18} />
                <span>{name || "Profile"}</span>
              </Link>
            </li>
          )}

          {!token ? (
            <>
              <li
                onClick={() => {
                  openLogin && openLogin();
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-blue-400"
              >
                Login
              </li>
              <li
                onClick={() => {
                  openRegister && openRegister();
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-blue-400"
              >
                Register
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;





// import React, { useState } from "react";
// import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsOpen(!isOpen);

//   // ✅ Auth info
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const name = localStorage.getItem("name"); //  logged-in user name

//   // ✅ Dashboard path based on role
//   const getDashboardPath = () => {
//     if (role === "admin") return "/admin/dashboard";
//     if (role === "trainer") return "/trainer/dashboard";
//     if (role === "user") return "/user/dashboard";
//     return "/";
//   };

//   // ✅ Logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//     setIsOpen(false);
//   };

//   return (
//     <nav className="bg-gray-900 text-white px-4 md:px-8 py-4 flex justify-between items-center">
//       {/* Logo */}
//       <Link to="/" className="text-2xl font-bold">
//         FitManage
//       </Link>

//       {/* Hamburger */}
//       <div className="md:hidden">
//         <button onClick={toggleMenu}>
//           {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//         </button>
//       </div>

//       {/* Menu */}
//       <ul
//         className={`
//           md:flex md:items-center md:space-x-6
//           absolute md:static top-16 left-0 w-full md:w-auto
//           bg-gray-900 md:bg-transparent
//           flex flex-col md:flex-row items-center
//           transition-all duration-300
//           ${isOpen ? "block" : "hidden md:block"}
//         `}
//       >
//         <li className="py-2 md:py-0 hover:text-blue-400">
//           <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
//         </li>

//         <li className="py-2 md:py-0 hover:text-blue-400">
//           <Link to="/trainers" onClick={() => setIsOpen(false)}>Trainers</Link>
//         </li>

//         <li className="py-2 md:py-0 hover:text-blue-400">
//           <Link to="/plans" onClick={() => setIsOpen(false)}>Plans</Link>
//         </li>

//         <li className="py-2 md:py-0 hover:text-blue-400">
//           <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
//         </li>

//         <li className="py-2 md:py-0 hover:text-blue-400">
//           <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
//         </li>

//         {/* ✅ Logged-in User Name */}
//         {token && (
//           <li className="py-2 md:py-0">
//             <Link
//               to={getDashboardPath()}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
//             >
//               <FaUserCircle size={18} />
//               <span>{name || "Profile"}</span>
//             </Link>
//           </li>
//         )}

//         {/* ✅ Login / Logout */}
//         {!token ? (
//           <li className="py-2 md:py-0">
//             <Link
//               to="/login"
//               onClick={() => setIsOpen(false)}
//               className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 transition"
//             >
//               Login
//             </Link>
//           </li>
//         ) : (
//           <li className="py-2 md:py-0">
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </li>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
