import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createNutrition,getUserNutrition 
} from "../controllers/nutritionController.js";

const router = express.Router();

// Trainer creates nutrition plan
router.post(
  "/create-nutrition",
  protect,
  authorizeRole("trainer"),
  createNutrition
);
// Get user nutrition --By User
router.get("/user-nutrition", protect, authorizeRole("user"), getUserNutrition);
// // User / Trainer get nutrition by user
// router.get(
//   "/user-nutrition/:userId",
//   protect,
//   authorizeRole("trainer"),
//   getUserNutrition
// );



export default router;
