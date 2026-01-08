import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js"
import {
  getMyPayments,
  getTrainerEarnings,
  adminAllPayments,
} from "../controllers/paymentController.js";


const router = express.Router();

/* ================= USER ================= */
// GET logged-in user's payments
router.get(
  "/my-payments",
  protect,
  authorizeRole("user"),
  getMyPayments
);

/* ================= TRAINER ================= */
// GET trainer earnings
router.get(
  "/trainer/earnings",
  protect,
  authorizeRole("trainer"),
  getTrainerEarnings
);

/* ================= ADMIN ================= */
// GET all payments
router.get(
  "/admin/all",
  protect,
  authorizeRole("admin"),
  adminAllPayments
);

export default router;



// import express from "express";
// import { getMyPayments,getTrainerEarnings,adminAllPayments } from "../controllers/paymentController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Make paymenty
// // router.post("/pay", protect, makePayment);
// router.get("/user", protect, getMyPayments);
// router.get("/trainer", protect, getTrainerEarnings);
// router.get("/admin", protect, adminAllPayments);

// export default router;
