import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createNutrition, 
} from "../controllers/nutritionController.js";

const router = express.Router();

// Trainer creates nutrition plan
router.post(
  "/create-nutrition",
  protect,
  authorizeRole("trainer"),
  createNutrition
);

// // User / Trainer get nutrition by user
// router.get(
//   "/user-nutrition/:userId",
//   protect,
//   authorizeRole("trainer"),
//   getUserNutrition
// );



export default router;
