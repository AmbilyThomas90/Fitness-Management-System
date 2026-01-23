import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import TrainerAssignment from "../models/TrainerAssignment.js";
/**
    Create user feedback  */
export const createFeedback = async (req, res) => {
  try {
    console.log("➡️ createFeedback called");
    console.log("📦 Request body:", req.body);
    console.log("👤 Auth user:", req.user?._id);

    const { rating, comments } = req.body;

    //  Validation
    if (!rating) {
      console.warn("⚠️ Rating missing");
      return res.status(400).json({
        message: "Rating is required",
      });
    }

    //  Security Check (Ensure user is logged in)
    if (!req.user || !req.user._id) {
      console.warn(" Unauthorized access attempt");
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    console.log(" Validation passed");

    //  Create feedback
    const feedback = await Feedback.create({
      user: req.user._id,
      rating: Number(rating),
      comments: comments || "",
    });

    console.log(" Feedback created:", feedback._id);

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("❌ Error in createFeedback:", error);
    res.status(500).json({
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};


//  Get feedback for trainer-->Triner views feedback of users
export const getApprovedUsersFeedback = async (req, res) => {
  try {
    console.log("📥 getApprovedUsersFeedback HIT");

    // 1️⃣ User ID from JWT
    const userId = req.user.id;
    console.log("👤 User ID from token:", userId);

    // 2️⃣ Find Trainer PROFILE using User ID
    const trainerProfile = await Trainer.findOne({ user: userId }).lean();

    if (!trainerProfile) {
      console.log("❌ Trainer profile NOT found for user:", userId);

      return res.status(404).json({
        success: false,
        message: "Trainer profile not found.",
      });
    }

    const trainerProfileId = trainerProfile._id;
    console.log(
      "🆔 Trainer Profile ID (used in assignments):",
      trainerProfileId.toString()
    );

    // 3️⃣ Fetch APPROVED assignments for this trainer profile
    const approvedAssignments = await TrainerAssignment.find({
      trainer: trainerProfileId,
      status: "approved",
    })
      .select("user")
      .lean();

    console.log(
      `✅ Approved assignments found: ${approvedAssignments.length}`
    );
    console.log("📄 Approved assignments data:", approvedAssignments);

    if (!approvedAssignments.length) {
      return res.status(200).json({
        success: true,
        feedbacks: [],
        message: "No approved users found for this trainer.",
      });
    }

    // 4️⃣ Extract approved User IDs
    const approvedUserIds = approvedAssignments.map(a => a.user);
    console.log("🆔 Approved user IDs:", approvedUserIds);

    // 5️⃣ Fetch feedback for approved users only
    const feedbacks = await Feedback.find({
      user: { $in: approvedUserIds },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`💬 Feedback count: ${feedbacks.length}`);
    console.log("💬 Feedback data:", feedbacks);

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });

  } catch (error) {
    console.error("❌ Trainer feedback error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



