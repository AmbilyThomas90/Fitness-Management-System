import { BrowserRouter, Routes, Route } from "react-router-dom";

/* COMMON */
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Login from "./pages/auth/Login";
import Login from "./pages/auth/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
// import Register from "./pages/auth/Register";
import PlanCard from "./components/PlanCardModal";
import About from "./pages/About";
import Contact from "./pages/Contact";

/*Plan */
import ViewPlans from "./components/PlanForm";
import PlanDetailsView  from "./components/PlanDetails";

/* DASHBOARDS */
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import UserDashboard from "./pages/user/UserDashboard";

/* ADMIN PAGES */
import DashboardHome from "./pages/admin/DashboardHome";
import Users from "./pages/admin/Users";
import Trainers from "./pages/admin/Trainers";
import Plans from "./pages/admin/Plans";
import PlanDetail from "./pages/admin/PlanDetail";
import Payments from "./pages/admin/Payments";
import Analytics from "./pages/admin/Analytics";
import AdminPayments from "./pages/admin/AdminPayments";
/* USER PAGES */
import UserHome from "./pages/user/UserHome";
import UserLayout from "./pages/user/UserLayout";
import Profile from "./pages/user/Profile";
import Goals from "./pages/user/Goals";
import Progress from "./pages/user/ProgressTracker";
import PlanSubscription from "./pages/user/PlanSubscription";
import MySubscription from "./pages/user/MySubscription";
import SelectTrainer  from "./pages/user/SelectTrainer";
import MyPayment from "./pages/user/UserPaymentDetails";

/* USER TRAINER */
import TrainerProfile from "./pages/trainer/TrainerProfile";

// import Progress from "./pages/user/Progress";
// import Workouts from "./pages/user/Workouts";
// import Nutrition from "./pages/user/Nutrition";
// import UserTrainers from "./pages/user/Trainers";
// import Bookings from "./pages/user/Bookings";
// import Messages from "./pages/user/Messages";
// import UserPayments from "./pages/user/Payments";
// import Feedback from "./pages/user/Feedback";
/* PROTECTED ROUTE */
import ProtectedRoute from "./routes/ProtectedRoute";
import Sidebar from "./pages/user/Sidebar";

function App() {
  return (
    <BrowserRouter>
   

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         {/* Public plans */}
         <Route path="plancard" element={< PlanCard />} />
         {/* <Route path="/plans/:id" element={<PlanDetailsView />} /> */}
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
               

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="plans" element={<Plans />} />
          {/* <Route path="plans/:id" element={<PlanDetail />} /> */}
      <Route path="adminpayments" element={<AdminPayments />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* ================= TRAINER DASHBOARD ================= */}
       <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
{/*
<Route path="/trainer/users" element={<TrainerUsers />} />
<Route path="/trainer/assign-plan" element={<AssignPlan />} />
<Route path="/trainer/progress" element={<TrainerProgress />} />
<Route path="/trainer/suggestions" element={<TrainerSuggestions />} />
<Route path="/trainer/feedback" element={<TrainerFeedback />} /> */}


       {/* ================= USER DASHBOARD ================= */}
<Route
  path="/user"
  element={
    <ProtectedRoute allowedRole="user">
      <UserLayout /> 
    </ProtectedRoute>
  }
>
  {/* Default /user/ dashboard */}
  <Route index element={<UserHome />} />
  <Route path="dashboard" element={<UserHome />} />

  {/* User pages */}
  <Route path="profile" element={<Profile />} />
  
  {/* Plan Flow - Nested inside /user */}
  <Route path="planview" element={<ViewPlans />} />
  
  {/* FIX: Ensure this matches your navigate(`/user/planview/${id}`) call */}
  <Route path="planview/:id" element={<PlanDetailsView />} />
  
  <Route path="plan-subscription/:id" element={<PlanSubscription />} />
  <Route path="my-subscription" element={<MySubscription />} />
  <Route path="goals" element={<Goals />} />
  <Route path="progress" element={<Progress />} />
  <Route path="select-trainer" element={<SelectTrainer />} />
   <Route path="payments" element={<MyPayment />} />
</Route>
  {/* Future pages */}
  {/*
  <Route path="workouts" element={<Workouts />} />
  <Route path="nutrition" element={<Nutrition />} />
  <Route path="trainers" element={<Trainers />} />
  <Route path="messages" element={<Messages />} />
 
  <Route path="feedback" element={<Feedback />} />
  */}


      </Routes>
    </BrowserRouter>
  );
}

export default App;



// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import Register from "./pages/Register";

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import TrainerDashboard from "./pages/trainer/TrainerDashboard";
// import UserDashboard from "./pages/user/UserDashboard";

// import ProtectedRoute from "./routes/ProtectedRoute";

// // admin pages
// import DashboardHome from "./pages/admin/DashboardHome";
// import Users from "./pages/admin/Users";
// import Trainers from "./pages/admin/Trainers";
// import Plans from "./pages/admin/Plans";
// import Payments from "./pages/admin/Payments";
// import Analytics from "./pages/admin/Analytics";
// import PlanDetail from "./pages/admin/PlanDetail";

// function App() {
  
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/register" element={<Register />} />

//         {/* ADMIN DASHBOARD */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<DashboardHome />} />
//           <Route path="users" element={<Users />} />
//           <Route path="trainers" element={<Trainers />} />
//           <Route path="plans" element={<Plans />} />
//             <Route path="plans/:id" element={<PlanDetail />} />
//           <Route path="payments" element={<Payments />} />
//           <Route path="analytics" element={<Analytics />} />
        
//         </Route>

//         {/* TRAINER DASHBOARD */}
//         <Route
//           path="/trainer/dashboard/*"
//           element={
//             <ProtectedRoute allowedRole="trainer">
//               <TrainerDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* USER DASHBOARD */}
//         <Route
//           path="/user/dashboard/*"
//           element={
//             <ProtectedRoute allowedRole="user">
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
