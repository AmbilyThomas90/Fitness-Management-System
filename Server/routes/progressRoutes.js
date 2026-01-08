import express from "express";
import { recordProgress, getGoalProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, recordProgress);
router.get("/:goalId", protect, getGoalProgress);

export default router;