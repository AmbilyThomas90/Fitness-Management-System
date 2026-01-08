import React, { useState } from "react";
import Navbar from "../components/Navbar"; 
import Hero from "../components/Hero";
import Features from "../components/Features";
import Trainers from "../components/Trainers";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

import Login from "../pages/Login"; // modal-ready Login page
import ForgotPassword from "../pages/ForgotPassword"; // modal-ready Forgot Password
import Register from "../pages/Register"; // modal-ready Register

const HomePage = () => {
  //  Only one state for auth view
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState("login"); // can be 'login', 'register', or 'forgot'

  return (
    <div className="font-sans">
      {/* Navbar with modal open functions */}
      <Navbar
        openLogin={() => {
          setAuthView("login");
          setShowAuth(true);
        }}
        openRegister={() => {
          setAuthView("register");
          setShowAuth(true);
        }}
      />

      {/* Hero section can also trigger modal */}
      <Hero
        openLogin={() => {
          setAuthView("login");
          setShowAuth(true);
        }}
      />

      <Features />
      <Trainers />
      <Reviews />
      <Footer />

      {/* Auth Modal Rendering */}
      {showAuth && authView === "login" && (
        <Login
          isModal={true}
          closeModal={() => setShowAuth(false)}
          switchView={setAuthView}
        />
      )}

      {showAuth && authView === "register" && (
        <Register
          isModal={true}
          closeModal={() => setShowAuth(false)}
          switchView={setAuthView}
        />
      )}

      {showAuth && authView === "forgot" && (
        <ForgotPassword
          isModal={true}
          closeModal={() => setShowAuth(false)}
          switchView={setAuthView}
        />
      )}
    </div>
  );
};

export default HomePage;




// import React from "react";
// import Navbar from "../components/Navbar"; 
// import Hero from "../components/Hero";
// import Features from "../components/Features";
// import Trainers from "../components/Trainers";
// import Reviews from "../components/Reviews";

// import Footer from "../components/Footer";

// const HomePage = () => {
//   return (
//     <div className="font-sans">
//       <Navbar />
//       <Hero />
//       <Features />
//       <Trainers />
//    <Reviews />
     
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;
