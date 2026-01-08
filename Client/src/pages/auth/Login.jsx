import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------ CHANGE HANDLER ------------------
  const handleChange = (e) => {
    setError(""); // clear error on typing
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ------------------ FORM SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    const { email, password } = formData;

    // -------- FRONTEND VALIDATION --------
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
      // ---------- API LOGIN ----------
      const res = await api.post("/auth/login", formData);
      const { token, user, trainerStatus } = res.data;

      // ---------- TRAINER APPROVAL CHECK ----------
      if (user?.role === "trainer" && trainerStatus !== "active") {
        setError(
          trainerStatus === "new"
            ? "Your trainer profile is under admin review."
            : "Your trainer account is inactive. Please contact support."
        );
        setLoading(false);
        return;
      }

      // ---------- SAVE AUTH INFO ----------
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("user", JSON.stringify(user));

      // ---------- NAVIGATE BY ROLE ----------
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "trainer") navigate("/trainer/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password");
      else setError(err.response?.data?.message || "Login failed. Please try again.");

      // Clear any leftover auth info
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
