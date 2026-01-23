import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";
import Login from "../../pages/auth/Login";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import Register from "../../pages/auth/Register";
import TrainerRegister from "../../pages/auth/TrainerRegister";

const Contact = () => {
   const [showAuth, setShowAuth] = useState(false);
    const [authView, setAuthView] = useState("login");
    const [showPlans, setShowPlans] = useState(false);
  
    /* ===== Auth handlers ===== */
    const openLogin = () => {
      setAuthView("login");
      setShowAuth(true);
    };
  
    const openRegister = () => {
      setAuthView("register");
      setShowAuth(true);
    };
  
    const openTrainerRegister = () => {
      setAuthView("trainer-register");
      setShowAuth(true);
    };
  
    const openForgot = () => {
      setAuthView("forgot");
      setShowAuth(true);
    };
  
    const closeAuthModal = () => {
      setShowAuth(false);
    };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required");
      return;
    }

    setSuccess("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/*  Navbar now works */}
          <Navbar
      openLogin={openLogin}
        openRegister={openRegister}
        openTrainerRegister={openTrainerRegister}/>

      {/* -------- HEADER -------- */}
      <section
  className="relative text-white py-16 px-6 bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://media.istockphoto.com/id/1129113676/photo/got-a-problem-contact-us.jpg?s=612x612&w=0&k=20&c=ioyOUc3GeUaSqfbl5qVMoRYdyY-Nk6cMfFf6zgqa1rg=')",
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/70"></div>

  <div className="relative z-10 max-w-5xl mx-auto text-center">
    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
      Contact Smart Fitness Suite
    </h1>
    <p className="text-gray-300 text-lg">
      We’d love to hear from you. Get in touch with us anytime.
    </p>
  </div>
</section>


      {/* -------- CONTACT CONTENT -------- */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* CONTACT INFO */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-4 text-gray-700">
                <FaEnvelope className="text-blue-500 text-xl" />
                <span>support@smart-fitnes-suite.com</span>
              </div>

              <div className="flex items-center gap-4 text-gray-700">
                <FaPhoneAlt className="text-green-500 text-xl" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-4 text-gray-700">
                <FaMapMarkerAlt className="text-red-500 text-xl" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send a Message
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
        {/* -------- FOOTER NOTE -------- */}
      <section className="bg-gray-900 text-white py-8 text-center">
        <Footer/>
      </section>
      {/* ================= AUTH MODALS ================= */}
      {showAuth && authView === "login" && (
        <Login isModal closeModal={closeAuthModal} switchView={setAuthView} />
      )}

      {showAuth && authView === "register" && (
        <Register
          isModal
          closeModal={closeAuthModal}
          switchView={setAuthView}
        />
      )}

      {showAuth && authView === "trainer-register" && (
        <TrainerRegister
          isModal
          closeModal={closeAuthModal} // Consistent with other modals
          switchView={setAuthView}
        />
      )}

      {showAuth && authView === "forgot" && (
        <ForgotPassword
          isModal
          closeModal={closeAuthModal}
          switchView={setAuthView}
        />
      )}
    </div>
  );
};

export default Contact;
