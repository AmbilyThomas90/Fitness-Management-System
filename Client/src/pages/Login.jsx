import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

const Login = ({ isModal = false, closeModal, switchView }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- CHANGE HANDLER ----------------
  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { email, password } = formData;

    // ---------- FRONTEND VALIDATION ----------
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(
        "/auth/login",
        formData,
        {
          validateStatus: (status) => status < 500, // prevents console error
        }
      );

      // ---------- INVALID LOGIN ----------
      if (res.status === 401) {
        setError("Invalid email or password");
        return;
      }

      // ---------- OTHER CLIENT ERRORS ----------
      if (res.status !== 200) {
        setError(res.data?.message || "Login failed");
        return;
      }

      // ---------- SUCCESS ----------
      const { token, user, trainerStatus } = res.data;

      if (user?.role === "trainer" && trainerStatus !== "active") {
        setError(
          trainerStatus === "new"
            ? "Your trainer profile is under admin review."
            : "Your trainer account is inactive. Please contact support."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "trainer") navigate("/trainer/dashboard");
      else navigate("/user/dashboard");

      if (isModal && closeModal) closeModal();

    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  const modalWrapperClass = isModal
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "min-h-screen flex items-center justify-center bg-gray-100 px-4";

  const modalContentClass = isModal
    ? "bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
    : "w-full max-w-md bg-white p-6 rounded-lg shadow-lg";

  return (
    <div className={modalWrapperClass}>
      <div className={modalContentClass}>
        {isModal && closeModal && (
          <button
            onClick={closeModal}
            className="absolute top-2 right-3 text-xl font-bold"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <div className="text-right">
            {switchView ? (
              <span
                onClick={() => switchView("forgot")}
                className="text-sm text-blue-500 cursor-pointer"
              >
                Forgot password?
              </span>
            ) : (
              <Link to="/forgot-password" className="text-sm text-blue-500">
                Forgot password?
              </Link>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          {switchView ? (
            <span
              onClick={() => switchView("register")}
              className="text-blue-500 cursor-pointer"
            >
              Sign Up
            </span>
          ) : (
            <Link to="/register" className="text-blue-500">
              Sign Up
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;



// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import api from "../api/api";

// // const Login = () => {
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       const res = await api.post("/auth/login", formData);

// //       const { token, user } = res.data;

// //       console.log("user:", user);
// //       // Save auth data
// //       localStorage.setItem("token", token);
// //       localStorage.setItem("role", user.role);
// //       localStorage.setItem("name", user.name);

// //       // Role-based redirect
// //       if (user.role === "admin") {
// //         navigate("/admin/dashboard");
// //       } else if (user.role === "trainer") {
// //         navigate("/trainer/dashboard");
// //       }
// //       else {
// //         navigate("/user/dashboard");
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Invalid email or password");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //       <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
// //         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
// //           Login
// //         </h2>

// //         {error && (
// //           <p className="text-red-500 text-center mb-4">{error}</p>
// //         )}

// //         {/* ✅ FORM */}
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             value={formData.email}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
// //             required
// //           />

// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
// //             required
// //           />
// //           <div className="text-right">
// //             <Link
// //               to="/forgot-password"
// //               className="text-sm text-blue-500 hover:underline"
// //             >
// //               Forgot password?Reset Password
// //             </Link>
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
// //           >
// //             {loading ? "Logging in..." : "Login"}
// //           </button>
// //         </form>

// //         <p className="mt-4 text-center text-gray-600 text-sm">
// //           Don't have an account?{" "}
// //           <Link to="/register" className="text-blue-500 hover:underline">
// //             Sign Up
// //           </Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
