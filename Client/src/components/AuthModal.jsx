// import React from "react";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import ForgotPassword from "../pages/ForgotPassword";

// const AuthModal = ({ authView, setAuthView, closeModal }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md p-6 rounded-lg relative">

//         {/* Close button */}
//         <button
//           onClick={closeModal}
//           className="absolute top-2 right-3 text-xl"
//         >
//           ✕
//         </button>

//         {authView === "login" && (
//           <Login setAuthView={setAuthView} isModal />
//         )}

//         {authView === "register" && (
//           <Register setAuthView={setAuthView} isModal />
//         )}

//         {authView === "forgot" && (
//           <ForgotPassword setAuthView={setAuthView} isModal />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
