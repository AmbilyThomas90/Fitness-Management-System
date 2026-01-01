import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // connect DB

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/nutrition",nutritionRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(5000, () =>
//       console.log("✅ Server running on port 5000")
//     );
//   })
//   .catch(err => console.log(err));
