import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createWorkout,
  getUserWorkouts,
  // getAllWorkouts,
  // getWorkoutById,
  // updateWorkout,
  // deleteWorkout
} from "../controllers/workoutController.js";

const router = express.Router();
// Create a workout for a user
router.post("/create-workouts", protect,authorizeRole("trainer"), createWorkout);
// Get user Work out
router.get(
  "/trainer/user-workout/:userId",
  protect,
  getUserWorkouts
);
// Trainer creates workout
//router.post("/create-workout", createWorkout);

// // Get all workouts


// // Get workout by ID

// router.get("/:id", getWorkoutById);

// // Update workout
// router.put("/:id", updateWorkout);

// // Delete workout
// router.delete("/:id", deleteWorkout);

export default router;
