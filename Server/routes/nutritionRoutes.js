import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createNutrition
} from "../controllers/nutritionController.js";

const router = express.Router();

// Test route - remove after debugging
router.get("/test", (req, res) => {
  res.json({ message: "Nutrition route is working" });
});

// Trainer creates nutrition plan
router.post(
  "/create-nutrition",
  protect,
  authorizeRole("trainer"),
  createNutrition
);
// Get user nutrition --By User
//router.get("/user-nutrition", protect,getUserNutrition);
// // User / Trainer get nutrition by user
// router.get(
//   "/user-nutrition/:userId",
//   protect,
//   authorizeRole("trainer"),
//   getUserNutrition
// );



export default router;
