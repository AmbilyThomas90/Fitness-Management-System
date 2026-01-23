import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const ForgotPassword = ({ isModal = false, closeModal, switchView }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // STEP 1 – Verify email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Email verified. Please set a new password.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 – Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { email, password });

      alert("Password reset successful");

       if (isModal && switchView) {
      // Stay on same page, switch modal to login
      switchView("login");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Wrapper styles (modal vs page)
  const wrapperClass = isModal
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "min-h-screen flex items-center justify-center bg-gray-100 px-4";

  const cardClass =
    "w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative";

  return (
    <div className={`${wrapperClass} flex items-center justify-center px-4`}>
  <div
    className={`${cardClass} relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8`}
  >
    {/* Close button */}
    {isModal && closeModal && (
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl font-semibold transition"
        aria-label="Close"
      >
        ✕
      </button>
    )}

    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
      Forgot Password
    </h2>

    {error && (
      <p className="mb-4 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3">
        {error}
      </p>
    )}

    {message && (
      <p className="mb-4 text-sm text-center text-blue-600 bg-blue-50 border border-blue-200 rounded-md py-2 px-3">
        {message}
      </p>
    )}

    {/* STEP 1 */}
    {step === 1 && (
      <form onSubmit={handleEmailSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white py-2.5
                     text-sm font-medium hover:bg-blue-700
                     disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    )}

    {/* STEP 2 */}
    {step === 2 && (
      <form onSubmit={handleResetPassword} className="space-y-5">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white py-2.5
                     text-sm font-medium hover:bg-blue-700
                     disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    )}

    {/* Back to Login */}
    {switchView && (
      <p className="mt-6 text-center text-sm text-gray-600">
        Remember password?{" "}
        <span
          onClick={() => switchView("login")}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    )}
  </div>
</div>

  );
};

export default ForgotPassword;


