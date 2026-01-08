import express from "express";
import { getAllPlans,getPlanById } from "../controllers/planController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in user can view plans
//router.get("/", protect, getAllPlans);
// Anyone can view plans
router.get("/", getAllPlans);
router.get("/:id", getPlanById);

export default router;

