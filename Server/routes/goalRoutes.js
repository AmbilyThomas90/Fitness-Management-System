import express from "express";
import {
  createGoal,
  getMyGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Create goal
router.post("/create-goal", protect, createGoal);
// Get all goals of user
router.get("/", protect, getMyGoals);
// Get single goal
router.get("/:id", protect, getGoalById);
// Update goal
router.put("/:id", protect, updateGoal);
//// Delete goal
router.delete("/:id", protect, deleteGoal);

export default router;
