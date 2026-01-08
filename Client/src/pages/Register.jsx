import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import TrainerProfileModal from "../components/TrainerProfileModal";

const Register = ({ isModal = false, closeModal, switchView }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FORM SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    // Trainer → open modal first to collect profile info
    if (form.role === "trainer") {
      setShowTrainerModal(true);
      return;
    }

    registerUser();
  };

  /* ================= REGISTER API ================= */
  const registerUser = async (trainerProfile = null) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        trainerProfile, // null for user, object for trainer
      });

      alert(
        form.role === "trainer"
          ? "Trainer profile submitted. Await admin approval."
          : "Registration successful"
      );

      if (isModal && switchView) {
        switchView("login");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
      setShowTrainerModal(false);
    }
  };

  /* ================= UI ================= */
  const wrapperClass = isModal
    ? "fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
    : "min-h-screen flex items-center justify-center bg-gray-100 px-4";

  return (
    <>
      <div className={wrapperClass}>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative">
          {isModal && closeModal && (
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              ✕
            </button>
          )}

          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          {switchView && (
            <p className="mt-4 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => switchView("login")}
                className="text-indigo-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ================= TRAINER PROFILE MODAL ================= */}
      {showTrainerModal && (
        <TrainerProfileModal
          loading={loading}
          onClose={() => setShowTrainerModal(false)}
          onSubmit={(trainerData) => registerUser(trainerData)}
        />
      )}
    </>
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
