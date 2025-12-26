import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { addWorkout, getWorkouts } from "../controllers/workoutController.js";
import {
  createProfile,
  updateProfile,
  getMyProfile
} from "../controllers/userController.js";
import {
  createPayment,
  getMyPayments
} from "../controllers/paymentController.js";
const router = express.Router();

// Create profile
router.post("/create-profile", protect,authorizeRole("user"), createProfile);

// Update profile
router.put("/update-profile", protect, authorizeRole("user"), updateProfile);

// View my profile
router.get("/profile", protect, authorizeRole("user"), getMyProfile);


// User buys a plan (payment)
router.post("/buy-plan/:planId", protect,  authorizeRole("user"), createPayment);

// Get logged-in user's payments
router.get("/my-payments", protect,  authorizeRole("user"), getMyPayments);

router.post("/workout", protect, authorizeRole("user"), addWorkout);
router.get("/workout", protect, authorizeRole("user"), getWorkouts);

export default router;
