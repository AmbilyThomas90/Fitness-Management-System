import express from "express";
import { getAllPlans } from "../controllers/planController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in user can view plans
router.get("/", protect, getAllPlans);

export default router;

