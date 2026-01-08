import express from "express";
import {
  createNutrition,
  getUserNutrition,
  getDailyNutritionSummary,
  deleteNutrition
} from "../controllers/nutritionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Trainer creates nutrition plan
router.post("/create-nutrition", protect, authorizeRole("trainer"), createNutrition);

// User / Trainer get nutrition by user
router.get("/user/:userId", protect, getUserNutrition);

// Daily summary (calories + macros)
router.get("/summary/:userId", protect, getDailyNutritionSummary);

// Delete nutrition entry
router.delete("/:id", protect, authorizeRole("trainer"), deleteNutrition);

export default router;
