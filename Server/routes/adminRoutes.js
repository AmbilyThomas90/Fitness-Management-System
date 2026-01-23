import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {

  getAllUsersWithProfile, blockUnblockUser,
  getReports,
  getDashboardStatus, getAllTrainers, updateTrainerStatus,
  approveTrainer
} from "../controllers/adminController.js";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from "../controllers/planController.js";
import{ adminAllPayments } from "../controllers/paymentController.js";

const router = express.Router();

/* =======================
   ADMIN USERS / REPORTS
======================= */
// Get all Users , Trainer and Payments

router.get("/dashboard", protect, authorizeRole("admin"), getDashboardStatus);

//  update User Status-Block-false|| Unblock-true
router.patch("/users/:id/block", protect, authorizeRole("admin"), blockUnblockUser);

// Get users ,profiles and goals
router.get("/users", protect,  getAllUsersWithProfile);

/* =======================
   ADMIN TRAINERS / REPORTS
======================= */

//Get All Trainers
router.get("/trainers",protect,authorizeRole("admin"),  getAllTrainers);
// Update Trainer Status
router.patch("/trainers/:id/status", protect,authorizeRole("admin"), updateTrainerStatus);

// Approve trainer
router.patch("/trainers/:id/approve",protect,authorizeRole("admin"),approveTrainer);


// Get reports
router.get("/reports", protect, authorizeRole("admin"), getReports);

/* =======================
   ADMIN PLANS
======================= */


// Get all plans
router.get("/plans", protect, authorizeRole("admin"), getAllPlans);

// Create plan
router.post("/create-plan", protect, authorizeRole("admin"), createPlan);



// Get single plan
router.get("/plans/:id", protect, authorizeRole("admin"), getPlanById);

// Update plan
router.put("/plans/:id", protect, authorizeRole("admin"), updatePlan);

// Delete plan
router.delete("/plans/:id", protect, authorizeRole("admin"), deletePlan);

/* =======================
   ADMIN Paymentdetails
======================= */
router.get("/adminpayments",protect,authorizeRole("admin"),adminAllPayments );



export default router;
