import express from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} from "../controllers/workoutController.js";

const router = express.Router();

// Trainer creates workout
router.post("/create-workout", createWorkout);

// Get all workouts
router.get("/", getAllWorkouts);

// Get workout by ID
router.get("/:id", getWorkoutById);

// Update workout
router.put("/:id", updateWorkout);

// Delete workout
router.delete("/:id", deleteWorkout);

export default router;
