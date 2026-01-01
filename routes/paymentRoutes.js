import express from "express";
import { makePayment,getUserPayments,getTrainerEarnings,adminAllPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Make payment
router.post("/pay", protect, makePayment);
router.get("/user", protect, getUserPayments);
router.get("/trainer", protect, getTrainerEarnings);
router.get("/admin", protect, adminAllPayments);

export default router;
