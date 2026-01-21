// import React, { useState } from "react";
// import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
// import Navbar from "../components/Navbar"; // ✅ adjust path if needed
// import Footer from "../components/Footer";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setError("");
//     setSuccess("");
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.message) {
//       setError("All fields are required");
//       return;
//     }

//     setSuccess("Thank you! Your message has been sent.");
//     setFormData({ name: "", email: "", message: "" });
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* ✅ Navbar now works */}
//       <Navbar />

//       {/* -------- HEADER -------- */}
//       <section className="bg-gray-900 text-white py-16 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">
//             Contact Smart Fitness Suite
//           </h1>
//           <p className="text-gray-300 text-lg">
//             We’d love to hear from you. Get in touch with us anytime.
//           </p>
//         </div>
//       </section>

//       {/* -------- CONTACT CONTENT -------- */}
//       <section className="py-16 px-6">
//         <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
//           {/* CONTACT INFO */}
//           <div className="bg-white p-8 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Get in Touch
//             </h2>

//             <div className="space-y-5">
//               <div className="flex items-center gap-4 text-gray-700">
//                 <FaEnvelope className="text-blue-500 text-xl" />
//                 <span>support@smart-fitnes-suite.com</span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-700">
//                 <FaPhoneAlt className="text-green-500 text-xl" />
//                 <span>+91 98765 43210</span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-700">
//                 <FaMapMarkerAlt className="text-red-500 text-xl" />
//                 <span>India</span>
//               </div>
//             </div>
//           </div>

//           {/* CONTACT FORM */}
//           <div className="bg-white p-8 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Send a Message
//             </h2>

//             {error && (
//               <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4">
//                 {success}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Your Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//               />

//               <textarea
//                 name="message"
//                 rows="5"
//                 placeholder="Your Message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
//               />

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//               >
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//         {/* -------- FOOTER NOTE -------- */}
//       <section className="bg-gray-900 text-white py-8 text-center">
//         <Footer/>
//       </section>
//     </div>
//   );
// };

// export default Contact;
