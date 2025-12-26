import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { approveTrainer, getReports } from "../controllers/adminController.js";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from "../controllers/planController.js";

const router = express.Router();
// Admin create plan
router.post("/create-plan", protect, authorizeRole("admin"), createPlan);

// Admin view all plans
router.get("/", protect, authorizeRole("admin"), getAllPlans);

// Admin view single plan
router.get("/:id", protect, authorizeRole("admin"), getPlanById);

// Admin update plan
router.put("/:id", protect, authorizeRole("admin"), updatePlan);

// Admin delete plan
router.delete("/:id", protect, authorizeRole("admin"), deletePlan);

router.put( "/approve-trainer/:id", protect,authorizeRole("admin"),approveTrainer
);

router.get( "/reports", protect, authorizeRole("admin"), getReports
);

export default router;
