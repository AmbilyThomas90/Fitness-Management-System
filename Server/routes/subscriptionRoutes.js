import express from "express";
import {
  createSubscription,
  getMySubscription
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Select & subscribe plan
router.post("/subscribe", protect, createSubscription);

// Get logged-in user subscription
router.get("/my", protect, getMySubscription);

export default router;
