import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";


// User Profile
import {
  createProfile,
  updateProfile,
  getMyProfile
} from "../controllers/userController.js";
// GOAL setting
import {
  createGoal,
  getMyGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} from "../controllers/goalController.js";
import { getAllTrainersForUser } from "../controllers/trainerController.js";
import { getMySubscription } from "../controllers/subscriptionController.js";
import { getUserDashboard } from "../controllers/dashboardController.js";
import {getMyPayments} from "../controllers/paymentController.js";
import { getUserWorkouts,updateWorkoutStatus } from "../controllers/workoutController.js";
//import {getUserNutrition} from "../controllers/nutritionController.js";

const router = express.Router();

//-------------USER PROFILE---------------//
// Create profile
router.post("/create-profile", protect,authorizeRole("user"), createProfile);

// Update profile
router.put("/update-profile", protect, authorizeRole("user"), updateProfile);

// View my profile
router.get("/profile", protect, authorizeRole("user"), getMyProfile);

//-------------USER PROFILE---------------//

// Create goal
router.post("/create-goal", protect,authorizeRole("user"), createGoal);

// Get all goals of user
router.get("/goal", protect, authorizeRole("user"), getMyGoals);
// Get single goal
router.get("goal/:id", protect, authorizeRole("user"),getGoalById);
// Update goal
router.put("goal/:id", protect, authorizeRole("user"),updateGoal);
//// Delete goal
router.delete("goal/:id", protect, authorizeRole("user"),deleteGoal);

//-------------USER Get all active Trainer---------------//
// GET all active trainers
router.get("/trainers", protect,authorizeRole("user"), getAllTrainersForUser);

//-------------USER Get Aproved  Trainer---------------//

//------------- GET active subscription of logged-in user---------------//
router.get("/my-subscription", protect, authorizeRole("user"), getMySubscription);

//------------- user dashboard details---------------//
router.get("/dashboard", protect, authorizeRole("user"), getUserDashboard);

//--------------User buys a plan (payment)----------------//
 router.get("/my-payments", protect,  authorizeRole("user"), getMyPayments);

 //--------------User- Workout ----------------//
router.get("/workouts", protect, authorizeRole("user"), getUserWorkouts);

// Update status of a specific workout  --By User
router.patch("/work/:workoutId/status", protect, authorizeRole("user"), updateWorkoutStatus);



// // Get logged-in user's payments


// router.post("/workout", protect, authorizeRole("user"), addWorkout);
// router.get("/workout", protect, authorizeRole("user"), getWorkouts);

export default router;