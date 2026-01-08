import express from "express";
import {
  createOrder,
  verifyPayment,
  getMySubscription
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 1. Step 1: Create a Razorpay Order
// Frontend calls this when user clicks "Pay"
router.post("/create-order", protect, createOrder);

// 2. Step 2: Verify the payment signature from Razorpay
// Frontend calls this after the payment modal closes successfully
router.post("/verify", protect, verifyPayment);

// 3. Get the logged-in user's active subscription
router.get("/my-subscription", protect, getMySubscription);

export default router;


// import express from "express";
// import {
//   createSubscription,
//   getMySubscription
// } from "../controllers/subscriptionController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Select & subscribe plan
// router.post("/subscribe", protect, createSubscription);

// // Get logged-in user subscription
// router.get("/my-subscription", protect, getMySubscription);

// export default router;
