import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Trainers from "../../components/Trainers";
import Reviews from "../../components/Reviews";
import Footer from "../../components/Footer";

import Login from "../../pages/auth/Login";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import Register from "../../pages/auth/Register";
import TrainerRegister from "../../pages/auth/TrainerRegister";
import PlanListModal from "../../components/PlanListModal";

const HomePage = () => {
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

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar
        openLogin={openLogin}
        openRegister={openRegister}
        openTrainerRegister={openTrainerRegister}
      />

      {/* Hero Section */}
      <Hero
        openRegister={openRegister}
        openTrainerRegister={openTrainerRegister}
        openPlanCard={() => setShowPlans(true)}
      />

      {/* Plans Modal */}
      {showPlans && (
        <PlanListModal
          onClose={() => setShowPlans(false)}
          onLogin={openLogin}
        />
      )}

      <Features />
      <Reviews />
      <Footer />

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

export default HomePage;
