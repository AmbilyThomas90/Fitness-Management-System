import Feedback from "../models/feedback.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
/**
    Create user feedback  */
export const createFeedback = async (req, res) => {
  try {
    const { trainerId, rating, comments } = req.body;

    if (!trainerId || !rating) {
      return res.status(400).json({ message: "Trainer and rating are required" });
    }
// create feedback
    const feedback = await Feedback.create({
      user: req.user._id,
      trainer: trainerId,
      rating,
      comments,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

//  Get feedback for trainer-->Triner views feedback of users

export const getTrainerFeedback = async (req, res) => {
  try {
    console.log("🔹 getTrainerFeedback called");

    // Logged-in USER
    const userId = req.user?._id;
    console.log("👤 Logged-in userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //  Find trainer document for this user
    const trainer = await Trainer.findOne({ user: userId });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    console.log(" Trainer document ID:", trainer._id);

    //  Fetch feedbacks using Trainer._id
    const feedbacks = await Feedback.find({
      trainer: trainer._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    console.log(" Feedback count:", feedbacks.length);

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("❌ Error fetching trainer feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

