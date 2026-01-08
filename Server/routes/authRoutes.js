import express from "express";
import { register, login , forgotPassword,
  resetPassword } from  "../controllers/authController.js";
  import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

//router.post("/register", register);
router.post(
  "/register",
  upload.single("profileImage"), // 🔥 VERY IMPORTANT
  register
);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
