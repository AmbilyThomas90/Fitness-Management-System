import express from "express";
import { recordProgress, getGoalProgress,getUsersProgressForTrainer } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
// create  progress By user
router.post("/create-progress", protect, recordProgress);
// get progrees of approved users for trainer-->trainer
router.get(
  "/approved-users-progress",
  protect,
 getUsersProgressForTrainer
);
// get progress By goalId
// Get progress history for a specific goal
router.get("/:goalId", protect, getGoalProgress);



export default router;