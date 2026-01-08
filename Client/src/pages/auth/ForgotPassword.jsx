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
    <div className={wrapperClass}>
      <div className={cardClass}>
        {/* Close button */}
        {isModal && closeModal && (
          <button
            onClick={closeModal}
            className="absolute top-2 right-3 text-xl font-bold"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-blue-500 text-center mb-4">{message}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Login */}
        {switchView && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Remember password?{" "}
            <span
              onClick={() => switchView("login")}
              className="text-blue-500 cursor-pointer hover:underline"
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


