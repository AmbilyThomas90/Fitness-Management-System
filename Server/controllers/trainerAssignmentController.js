import TrainerAssignment from "../models/TrainerAssignment.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Goal from "../models/Goal.js";
// User<----  select and appointment for trainer
export const assignTrainer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { trainerId, planId, goalId, timeSlot } = req.body;

    // =====================
    //  Validation
    // =====================
    if (!trainerId || !planId || !goalId || !timeSlot) {
      return res.status(400).json({
        message: "Trainer, plan, goal and time slot are required"
      });
    }

    // =====================
    //  Check user
    // =====================
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // =====================
    //  Get User Profile (🔥 REQUIRED)
    // =====================
    const userProfile = await UserProfile.findOne({ user: userId });
    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not found. Please complete your profile."
      });
    }

    // =====================
    //  Check trainer
    // =====================
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // =====================
    //  Check goal
    // =====================
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // =====================
    //  Prevent duplicate assignment
    // =====================
    const existingAssignment = await TrainerAssignment.findOne({
      user: userId,
      status: { $in: ["active", "approved"] }
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "You already have an active trainer"
      });
    }

    // =====================
    //  Create assignment 
    // =====================
    const assignment = await TrainerAssignment.create({
      user: userId,
      userProfile: userProfile._id, // 🔥 FIX
      trainer: trainerId,
      plan: planId,
      goal: goalId,
      timeSlot,
      status: "active"
    });

    res.status(201).json({
      success: true,
      message: "Trainer assigned successfully. Waiting for approval.",
      assignment
    });

  } catch (error) {
    console.error("ASSIGN TRAINER ERROR:", error);
    res.status(500).json({
      message: "Trainer assignment failed",
      error: error.message
    });
  }
};


// Get all users assigned to logged-in trainer---->Trainer
// Triner approved users  // view all Users approved by trainer  and trainer'sClient
export const getMyAssignedUsers = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    const assignments = await TrainerAssignment.find({
      trainer: trainer._id,
    })
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "userProfile",
        select: "phoneNumber age gender height weight healthCondition fitnessLevel",
      })
      .populate({
        path: "plan",
        select: "planName planType amount startDate endDate",
      })
      .populate({
        path: "goal",
        select: "goalType",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Assigned users fetched successfully",
      count: assignments.length,
      assignments,
    });
    console.log("Get assigned users:", assignments);
  } catch (error) {
    console.error("Get assigned users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// GET logged-in user's approved trainer--->User
export const getMyApprovedTrainer = async (req, res) => {
  try {
    console.log("➡️ getMyApprovedTrainer called");

    const userId = req.user?._id;
    console.log("👤 Logged-in User ID:", userId);

    if (!userId) {
      console.log("❌ User not authenticated");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("🔍 Searching for approved trainer assignment...");

    // Find approved trainer assignment + populate trainer -> user
    const trainerAssignment = await TrainerAssignment.findOne({
      user: userId,
      status: "approved",
    })
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .lean();

    console.log("📦 Trainer Assignment Result:", trainerAssignment);

    if (!trainerAssignment) {
      console.log("⚠️ No approved trainer assignment found");
      return res.status(404).json({
        success: false,
        message: "No approved trainer found for this user",
      });
    }

    console.log("🧑‍🏫 Trainer Object:", trainerAssignment.trainer);
    console.log("👤 Trainer User Object:", trainerAssignment.trainer?.user);

    // =====================
    // Trainer Data
    // =====================
    const trainerData = {
      trainerId: trainerAssignment.trainer?._id || null,
      name: trainerAssignment.trainer?.user?.name || null,
      email: trainerAssignment.trainer?.user?.email || null,
      phoneNumber: trainerAssignment.trainer?.phoneNumber || null,
      specialization:
        trainerAssignment.trainer?.specialization || "General Fitness",
      status: trainerAssignment.status,
      timeSlot: trainerAssignment.timeSlot,
      assignedAt: trainerAssignment.createdAt,
      planName: trainerAssignment.plan,
      goal: trainerAssignment.goal,
    };

    console.log("✅ Final Trainer Data Sent to Frontend:", trainerData);

    res.status(200).json({
      success: true,
      trainerAssignment: trainerData,
    });
  } catch (error) {
    console.error("🔥 Get approved trainer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
