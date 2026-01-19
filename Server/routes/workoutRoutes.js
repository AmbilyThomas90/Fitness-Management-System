import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

import {createWorkout} from "../controllers/workoutController.js";


const router = express.Router();
// Create a workout for a user
router.post("/create-workouts", protect,authorizeRole("trainer"), createWorkout);


export default router;
