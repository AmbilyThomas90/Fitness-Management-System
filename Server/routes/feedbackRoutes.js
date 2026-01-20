import express from "express";
import {
  createFeedback,
  getTrainerFeedback,
} from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User submits feedback
router.post(
  "/user-feedback",
  protect,
  authorizeRole("user"),
  createFeedback
);

// Trainer views feedback
router.get("/trainer-feedback", protect, getTrainerFeedback);
// router.get(
//   "/trainer/feedback",
//   protect,
//   authorizeRole("trainer"),
//   getTrainerFeedbacks
// );

export default router;
