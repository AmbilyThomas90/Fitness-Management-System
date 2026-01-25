import React, { useState } from "react";
import api from "../../api/api";

const TrainerRegister = ({ isModal = true, closeModal, switchView }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    experience: "",
    specialization: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(""); // ✅ added
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Image validation handler (FIXED)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      setProfileImage(null);
      setPreview("");
      e.target.value = null;
      return;
    }

    setError("");
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!profileImage) return setError("Profile image is required");

    setLoading(true);
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", "trainer");

      data.append("phoneNumber", formData.phoneNumber);
      data.append("experience", formData.experience);
      data.append("specialization", formData.specialization);
      data.append("profileImage", profileImage);

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Trainer registered successfully! Please wait for admin approval.");
      closeModal();
      switchView?.("login");
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4"
      onClick={closeModal}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Join as a professional fitness trainer
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            required
            onChange={handleChange}
          />

        <input
        name="email"
        type="email"
   placeholder="📧 your email"
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

          <input
            name="password"
            type="password"
            placeholder="🔒 your password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          />

          <input
            className="w-full border p-2 rounded"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            required
            onChange={handleChange}
          />

          <input
            className="w-full border p-2 rounded"
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={formData.experience}
            required
            onChange={handleChange}
          />

          <select
            className="w-full border p-2 rounded"
            name="specialization"
            value={formData.specialization}
            required
            onChange={handleChange}
          >
            <option value="">Select Specialization</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="yoga and endurance">Yoga and Endurance</option>
            <option value="flexibility">Flexibility</option>
          </select>

          <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="text-sm w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register as Trainer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerRegister;
