import Trainer from "../models/Trainer.js"
import User from "../models/User.js";

/**
 * CREATE TRAINER PROFILE
 */
export const createTrainerProfile = async (req, res) => {
  try {
    const { phoneNumber, specialization, experience } = req.body;

    // 🔥 req.user MUST exist
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Prevent duplicate profile
    const exists = await Trainer.findOne({ user: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "Trainer profile already exists" });
    }

    const trainer = await Trainer.create({
      user: req.user._id,
      phoneNumber,
      specialization,
      experience,
      profileImage: req.file ? req.file.filename : null,
    });
console.log("USER:", req.user);
console.log("FILE:", req.file);
console.log("BODY:", req.body);

    res.status(201).json({
      message: "Trainer profile created",
      trainer,
    });
  } catch (err) {
    console.error("Trainer create error:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * UPDATE TRAINER PROFILE
 */
export const updateTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trainer) {
      return res
        .status(404)
        .json({ message: "Trainer profile not found" });
    }

    res.json({
      message: "Trainer profile updated",
      trainer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET MY TRAINER PROFILE
 */
export const getMyTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({
      user: req.user.id
    }).populate("user", "name email role");

    if (!trainer) {
      return res
        .status(404)
        .json({ message: "Trainer profile not found" });
    }

    res.json({
      message: "Trainer profile fetched",
      trainer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * GET all active trainers
 * USER can view & select trainer
 */

export const getAllTrainersForUser = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate({
        path: "user",
        select: "name email role profileImage",
      })
      .sort({ createdAt: -1 });

    //  Debug logs
    // console.log(" Raw Trainers Count:", trainers.length);
    console.log(
      " Raw Trainers Data:",
      JSON.stringify(trainers, null, 1)
    );

    return res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error("❌ Get trainers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trainers",
    });
  }
};



// export const getAllTrainersForUser = async (req, res) => {
//   try {
//     const trainers = await Trainer.find({ isActive: true })
//       .select("name specialization experience profileImage")
//       .lean();

//     res.status(200).json({
//       success: true,
//       trainers: trainers || []
//     });
//   } catch (error) {
//     console.error("GET_TRAINERS_ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch trainers"
//     });
//   }
// };
/**
 * SELECT/ASSIGN TRAINER
 */
export const selectTrainer = async (req, res) => {
  try {
    const { trainerId, planId, timeSlot } = req.body;

    // Create the assignment record
    const assignment = await TrainerAssignment.create({
      user: req.user._id, // From auth middleware
      trainer: trainerId,
      plan: planId,
      timeSlot: timeSlot,
      status: "active"
    });

    res.status(201).json({
      success: true,
      message: "Trainer assigned successfully!",
      assignment
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const createTrainer = async (req, res) => {
//   const trainer = await Trainer.create({
//     userId: req.user.id,
//     certifications: req.body.certifications
//   });
//   res.json(trainer);
// };
