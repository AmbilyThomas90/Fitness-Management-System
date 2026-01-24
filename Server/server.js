import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";  
import cors from "cors"; 
import path from "path";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import trainerAssignmentRoutes from "./routes/trainerAssignmentRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// CORS Configuration
const corsOptions = {
  origin: [
    "https://fitness-management-system-zeta.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

app.use(express.json());

connectDB(); // connect DB

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/trainer-assignment", trainerAssignmentRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/nutrition",nutritionRoutes);
app.use("/api/feedback", feedbackRoutes);



// Start server
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// mongoos
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(5000, () =>
//       console.log("✅ Server running on port 5000")
//     );
//   })
//   .catch(err => console.log(err));
