import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = ({ isModal = false, closeModal, switchView }) => {
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

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= IMAGE VALIDATION ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files (JPG, PNG, WEBP) are allowed.");
      setProfileImage(null);
      e.target.value = "";
      return;
    }

    setError("");
    setProfileImage(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

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
        data.append("profileImage", profileImage);
      }

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(
        formData.role === "trainer"
          ? "Trainer registered. Await admin approval."
          : "Registration successful"
      );

      if (isModal && closeModal) closeModal();
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={isModal ? closeModal : undefined}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isModal && closeModal && (
          <button
            onClick={closeModal}
            className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && (
          <p className="text-red-500 mb-3 text-center">{error}</p>
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
            minLength="6"
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="user">Register as User</option>
            <option value="trainer">Register as Trainer</option>
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
                <option value="yoga and endurance">Yoga & Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>

              <input type="file" accept="image/*" onChange={handleImageChange} />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;









// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";

// const Register = ({ isModal = false, closeModal, switchView }) => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "user",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (form.password !== form.confirmPassword) {
//     return setError("Passwords do not match");
//   }

//   setLoading(true);

//   try {
//     await api.post("/auth/register", {
//       name: form.name,
//       email: form.email,
//       password: form.password,
//       role: form.role,
//     });

//     // SUCCESS
//     if (isModal && switchView) {
//       // Stay on same page, switch modal to login
//       switchView("login");
//     } else {
//       // Normal page → go to login page
//       navigate("/login");
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || "Registration failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   // Modal vs Page wrapper
//   const wrapperClass = isModal
//     ? "fixed inset-0 flex items-center justify-center z-50"
//     : "min-h-screen flex items-center justify-center bg-gray-100 px-4";

//   const cardClass =
//     "w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-lg relative";

//   return (
//     <div className={wrapperClass}>
//       <div className={cardClass}>
//         {/* Close button */}
//         {isModal && closeModal && (
//           <button
//             onClick={closeModal}
//             className="absolute top-2 right-3 text-xl font-bold"
//           >
//             ✕
//           </button>
//         )}

//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
//           Register
//         </h2>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="user">User</option>
//             <option value="trainer">Trainer</option>
//             <option value="admin">Admin</option>
//           </select>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
//           >
//             {loading ? "Registering..." : "Sign Up"}
//           </button>
//         </form>

//         {/* Switch to Login */}
//         {switchView && (
//           <p className="mt-4 text-center text-gray-600 text-sm">
//             Already have an account?{" "}
//             <span
//               onClick={() => switchView("login")}
//               className="text-blue-500 cursor-pointer hover:underline"
//             >
//               Login
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Register;



// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const Register = () => {
// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     role: "User",
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log(form);
// //     // Call your API here
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
// //       <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-lg">
// //         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
// //           Register
// //         </h2>

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Full Name"
// //             value={form.name}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             required
// //           />

// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             value={form.email}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             required
// //           />

// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             value={form.password}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             required
// //           />

// //           <input
// //             type="password"
// //             name="confirmPassword"
// //             placeholder="Confirm Password"
// //             value={form.confirmPassword}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             required
// //           />

// //           <select
// //             name="role"
// //             value={form.role}
// //             onChange={handleChange}
// //             className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           >
// //             <option value="User">User</option>
// //             <option value="Trainer">Trainer</option>
// //             <option value="Admin">Admin</option>
// //           </select>

// //           <button
// //             type="submit"
// //             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
// //           >
// //             Sign Up
// //           </button>
// //         </form>

// //         <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
// //           Already have an account?{" "}
// //           <a href="/login" className="text-blue-500 hover:underline">
// //             Login
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Register;
