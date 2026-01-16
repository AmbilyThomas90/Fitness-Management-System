import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");  //  Get logged-in user role 

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login page
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;  // Redirect to home
  }

  return children;
};

export default ProtectedRoute;
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ allowedRole }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const location = useLocation();

//   // If no token, redirect to login, but stay if already on login page
//   if (!token && location.pathname !== "/login") {
//     return <Navigate to="/login" replace />;
//   }

//   // If role is not allowed, redirect to home
//   if (allowedRole && role !== allowedRole) {
//     return <Navigate to="/" replace />;
//   }

//   // Render protected content (children routes)
//   return <Outlet />;
// };

// export default ProtectedRoute;
