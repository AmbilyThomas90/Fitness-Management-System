import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createTrainerProfile,
  updateTrainerProfile,
  getMyTrainerProfile
 
} from "../controllers/trainerController.js";
import { getTrainerUsersFullDetails,approveTrainerAssignment} from "../controllers/appointmentController.js";
import {
getUserWorkoutsForTrainer

} from "../controllers/workoutController.js";
const router = express.Router();

// Trainer create profile
router.post(
  "/create-profile",
  protect,
  authorizeRole("trainer"),upload.single("profileImage"),
  createTrainerProfile
);

// Trainer get own profile
router.get( "/profile",protect,authorizeRole("trainer"),getMyTrainerProfile);

// Trainer update profile
router.put("/update-profile", protect, authorizeRole("trainer"),upload.single("profileImage"), updateTrainerProfile);

// Trainer get users full detail

router.get("/my-users-details", protect, authorizeRole("trainer"), getTrainerUsersFullDetails);

// Trainer approve/reject // Trainer approve assignment

router.put("/assignments/:id/action",protect,authorizeRole("trainer"),approveTrainerAssignment);


// Fetch workouts of a specific user (Trainer view)
router.get("/user-workout/:userId", protect, getUserWorkoutsForTrainer);

// Trainer dashboard

router.get("/dashboard",protect,authorizeRole("trainer"),
  (req, res) => {
    res.json({ message: "Trainer dashboard" });
  }
);



export default router;
