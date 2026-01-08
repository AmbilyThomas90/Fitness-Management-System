import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phoneNumber: "",
    experience: "",
    specialization: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Image Validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError("Image size must be less than 2MB");
      e.target.value = "";
      return;
    }

    setError("");
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ❗ Trainer image required
    if (formData.role === "trainer" && !profileImage) {
      setError("Profile image is required for trainers");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);

      if (formData.role === "trainer") {
        data.append("phoneNumber", formData.phoneNumber);
        data.append("experience", formData.experience);
        data.append("specialization", formData.specialization);
      }

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

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
          className="w-full border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="trainer">Trainer</option>
        </select>

        {formData.role === "trainer" && (
          <>
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              name="experience"
              type="number"
              placeholder="Experience (years)"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select specialization</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="yoga_and_endurance">Yoga & Endurance</option>
              <option value="flexibility">Flexibility</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
