import express from "express";
import { assignTrainer } from "../controllers/trainerAssignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Assign trainer to logged-in user
router.post("/assign-trainer", protect,authorizeRole("user"), assignTrainer);

export default router;
