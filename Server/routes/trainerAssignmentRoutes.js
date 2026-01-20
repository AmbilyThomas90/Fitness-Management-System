import express from "express";
import { assignTrainer ,getMyAssignedUsers,getMyApprovedTrainer} from "../controllers/trainerAssignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Assign trainer to logged-in user 
// select and appointment for trainer
router.post("/assign-trainer", protect,authorizeRole("user"), assignTrainer);
//Triner approved users
router.get("/my-users", protect, getMyAssignedUsers);

// GET logged-in user's approved trainer--->user
router.get("/my-approved-trainer", protect, authorizeRole("user"), getMyApprovedTrainer);



export default router;
