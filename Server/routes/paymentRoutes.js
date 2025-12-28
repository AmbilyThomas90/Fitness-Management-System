import express from "express";
import { makePayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Make payment
router.post("/pay", protect, makePayment);

export default router;
