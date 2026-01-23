import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";

const UserRegister = ({ isModal = false, closeModal, switchView }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user", // 🔒 USER ONLY
      });

      alert("Registration successful");

      if (isModal && closeModal) {
        closeModal();
        switchView?.("login");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
  <div
  className={`${
    isModal
      ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      : "min-h-screen flex items-center justify-center bg-gray-100 px-4"
  }`}
  onClick={isModal ? closeModal : undefined}
>
  <div
    className="relative w-full max-w-md rounded-2xl bg-white
               shadow-xl p-6 sm:p-8"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Close button */}
    {isModal && closeModal && (
      <button
        onClick={closeModal}
        aria-label="Close"
        className="absolute top-3 right-4 text-xl font-semibold
                   text-gray-400 hover:text-gray-800 transition"
      >
        ✕
      </button>
    )}

    <h2 className="mb-6 text-center text-2xl sm:text-3xl
                   font-semibold text-gray-800">
      User Registration
    </h2>

    {error && (
      <div className="mb-4 rounded-lg border border-red-200
                      bg-red-50 px-4 py-2 text-center
                      text-sm text-red-600">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-gray-300
                   px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:border-indigo-500
                   transition"
      />

      {/* Email */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
        title="Please enter a valid email address"
        className="w-full rounded-lg border border-gray-300
                   px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:border-indigo-500
                   transition
                   invalid:border-red-500 invalid:ring-red-500"
      />

      {/* Password */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        minLength={6}
        required
        className="w-full rounded-lg border border-gray-300
                   px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:border-indigo-500
                   transition
                   invalid:border-red-500 invalid:ring-red-500"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600
                   py-2.5 text-sm font-medium text-white
                   hover:bg-indigo-700
                   disabled:opacity-60 disabled:cursor-not-allowed
                   transition"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>

    {/* Links */}
    <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
      {switchView && (
        <p>
          Already have an account?{" "}
          <span
            onClick={() => switchView("login")}
            className="cursor-pointer font-medium
                       text-indigo-600 hover:underline"
          >
            Login
          </span>
        </p>
      )}

      {switchView && (
        <p>
          Are you a trainer?{" "}
          <span
            onClick={() => switchView("trainer-register")}
            className="cursor-pointer font-medium
                       text-indigo-600 hover:underline"
          >
            Register as Trainer
          </span>
        </p>
      )}
    </div>
  </div>
</div>

  );
};

export default UserRegister;
