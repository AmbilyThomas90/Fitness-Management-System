// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import Features from "../components/Features";
// import Trainers from "../components/Trainers";
// import Reviews from "../components/Reviews";
// import Footer from "../components/Footer";

// import Login from "../pages/Login";
// import ForgotPassword from "../pages/ForgotPassword";
// import Register from "../pages/Register";
// import PlanListModal from "../components/PlanListModal";

// const HomePage = () => {
//   // ===== Modal State =====
//   const [showAuth, setShowAuth] = useState(false);
//   const [authView, setAuthView] = useState("login");
//   const [showPlans, setShowPlans] = useState(false);

//   // ===== Auth Modal Handlers =====
//   const openLogin = () => {
//     setAuthView("login");
//     setShowAuth(true);
//   };

//   const openRegister = () => {
//     setAuthView("register");
//     setShowAuth(true);
//   };

//   const openForgot = () => {
//     setAuthView("forgot");
//     setShowAuth(true);
//   };

//   // ===== Plan Modal Handlers =====
//   const openPlans = () => {
//     setShowPlans(true);
//   };

//   const closeAuthModal = () => {
//     setShowAuth(false);
//   };

//   const closePlanModal = () => {
//     setShowPlans(false);
//   };

//   return (
//     <div className="font-sans">
//       {/* Navbar */}
//       <Navbar openLogin={openLogin} openRegister={openRegister} />

//       {/* Hero */}
//       <Hero openRegister={openRegister} openPlanCard={openPlans} />

//       {/* Plans Modal */}
//       {showPlans && (
//         <PlanListModal
//           onClose={closePlanModal}
//           onLogin={openLogin}
//         />
//       )}

//       <Features />
//       {/* <Trainers /> */}
//       <Reviews />
//       <Footer />

//       {/* Auth Modals */}
//       {showAuth && authView === "login" && (
//         <Login
//           isModal
//           closeModal={closeAuthModal}
//           switchView={setAuthView}
//         />
//       )}

//       {showAuth && authView === "register" && (
//         <Register
//           isModal
//           closeModal={closeAuthModal}
//           switchView={setAuthView}
//         />
//       )}

//       {showAuth && authView === "forgot" && (
//         <ForgotPassword
//           isModal
//           closeModal={closeAuthModal}
//           switchView={setAuthView}
//         />
//       )}
//     </div>
//   );
// };

// export default HomePage;






// // import React from "react";
// // import Navbar from "../components/Navbar"; 
// // import Hero from "../components/Hero";
// // import Features from "../components/Features";
// // import Trainers from "../components/Trainers";
// // import Reviews from "../components/Reviews";

// // import Footer from "../components/Footer";

// // const HomePage = () => {
// //   return (
// //     <div className="font-sans">
// //       <Navbar />
// //       <Hero />
// //       <Features />
// //       <Trainers />
// //    <Reviews />
     
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default HomePage;
