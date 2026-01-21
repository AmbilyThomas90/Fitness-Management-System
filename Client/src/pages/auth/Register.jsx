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
          ? "fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          : "min-h-screen flex items-center justify-center bg-gray-100 px-4"
      }`}
      onClick={isModal ? closeModal : undefined}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isModal && closeModal && (
          <button
            onClick={closeModal}
            className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-black"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center">
          User Registration
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
            className="w-full border p-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* 🔹 LINKS */}
     <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
  {/* Login link (for modal usage) */}
  {switchView && (
    <p>
      Already have an account?{" "}
      <span
        onClick={() => switchView("login")}
        className="text-indigo-600 cursor-pointer hover:underline"
      >
        Login
      </span>
    </p>
  )}

  {/* Trainer registration link (page usage) */}
  {switchView && (
    <p>
      Are you a trainer?{" "}
      
     <span
        onClick={() => switchView("trainer-register")}
        className="text-indigo-600 cursor-pointer hover:underline"
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
