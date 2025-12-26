import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard",protect,authorizeRole("trainer"),
  (req, res) => {
    res.json({ message: "Trainer dashboard" });
  }
);

export default router;
