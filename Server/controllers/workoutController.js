import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Plan from "../models/Plan.js";

/**
 * Create workout for a user---By Triner
 * POST /api/workout/create-workouts
 */
export const createWorkout = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    console.log("📥 User ID from token:", req.user._id);

    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) {
      return res.status(404).json({
        message: "Trainer profile not found. Please create your trainer profile first.",
      });
    }

    const { userId, goalId, startDate, exercises } = req.body;

    // ================= VALIDATION =================
    if (!userId || !goalId || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        message: "userId, goalId, and exercises are required",
      });
    }

    const validCategories = [
      "GENERAL",
      "STRENGTH",
      "CARDIO",
      "CORE",
      "FLEXIBILITY",
      "BALANCE",
      "FUNCTIONAL",
      "RECOVERY",
    ];

    // Validate exercises
    for (const ex of exercises) {
      if (!ex.name || !ex.category) {
        return res.status(400).json({
          message: "Each exercise must have a name and category",
        });
      }

      if (!validCategories.includes(ex.category)) {
        return res.status(400).json({
          message: `Invalid category "${ex.category}". Allowed: ${validCategories.join(", ")}`,
        });
      }
    }

    // Validate user & goal
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const goalExists = await Goal.findById(goalId);
    if (!goalExists) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // ================= CREATE WORKOUT =================
    const workout = await Workout.create({
      trainer: trainer._id,
      user: userId,
      goal: goalId,
      startDate: startDate || new Date(),
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        category: ex.category.toUpperCase(), // ✅ STORED CORRECTLY
        sets: Number(ex.sets) || 0,
        reps: Number(ex.reps) || 0,
        duration: ex.duration,
        rest: ex.rest,
      })),
    });

    console.log("✅ Workout created:", workout._id);

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    console.error("❌ CREATE WORKOUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create workout",
      error: error.message,
    });
  }
};
// Controller to get the logged-in user's workouts--- For user
export const getUserWorkouts = async (req, res) => {
  try {
    // Option 1: let Mongoose cast string to ObjectId automatically
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    console.log("=== Fetched workouts for user:", req.user._id, "===");
    if (workouts.length === 0) {
      console.log("No workouts found for this user.");
    } else {
      workouts.forEach((w, index) => {
        console.log(`Workout ${index + 1}:`);
        console.log(JSON.stringify(w, null, 2));
      });
    }

    res.status(200).json({ success: true, workouts });

    // Option 2 (if you want explicit ObjectId):
    // const userId = new mongoose.Types.ObjectId(req.user.id);
    // const workouts = await Workout.find({ user: userId }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Update workout status ---- by user

export const updateWorkoutStatus = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "COMPLETED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, user: req.user._id },
      { status },
      { new: true }
    );

    if (!workout)
      return res.status(404).json({ success: false, message: "Workout not found" });

    res.status(200).json({ success: true, workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Get user Workouts--- for Trainer
export const getUserWorkoutsForTrainer = async (req, res) => {
  try {
    const { userId } = req.params; // get the user ID from URL

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const workouts = await Workout.find({ user: userId }).sort({ createdAt: -1 }).lean();

    console.log(`=== Fetched workouts for user: ${userId} ===`);
    if (workouts.length === 0) {
      console.log("No workouts found for this user.");
    }

    res.status(200).json({ success: true, workouts });
  } catch (error) {
    console.error("Error fetching user workouts for trainer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
