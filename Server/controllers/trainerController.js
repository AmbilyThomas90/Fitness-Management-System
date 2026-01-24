import Trainer from "../models/Trainer.js"
import User from "../models/User.js";
import fs from "fs";
import path from "path";
/**
 * CREATE TRAINER PROFILE
 */
export const createTrainerProfile = async (req, res) => {
  try {
    const { phoneNumber, specialization, experience } = req.body;

    //  req.user MUST exist
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

// Update trainer profile including profile image
export const updateTrainerProfile = async (req, res) => {
  try {
    // Find the trainer by logged-in user
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    // Update fields from req.body
    const { phoneNumber, specialization, experience, bio } = req.body;
    if (phoneNumber !== undefined) trainer.phoneNumber = phoneNumber;
    if (specialization !== undefined) trainer.specialization = specialization;
    if (experience !== undefined) trainer.experience = experience;
    if (bio !== undefined) trainer.bio = bio;

    // Handle profile image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (trainer.profileImage) {
        const oldImagePath = path.join(
          process.cwd(),
          "uploads",
          trainer.profileImage
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      // Save new image filename
      trainer.profileImage = req.file.filename;
    }

    await trainer.save();

    res.json({
      message: "Trainer profile updated successfully",
      trainer,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
/**
 * GET MY TRAINER PROFILE
 */
export const getMyTrainerProfile = async (req, res) => {
  try {
    console.log("📥 Fetching trainer profile for user:", req.user.id);

    const trainer = await Trainer.findOne({
      user: req.user.id
    }).populate("user", "name email role");

    if (!trainer) {
      console.log("❌ Trainer profile not found for user:", req.user.id);
      return res
        .status(404)
        .json({ success: false, message: "Trainer profile not found. Please create your profile first." });
    }

    console.log("✅ Trainer profile found:", trainer._id);

    res.status(200).json({
      success: true,
      message: "Trainer profile fetched",
      trainer
    });
  } catch (error) {
    console.error("❌ Error fetching trainer profile:", error.message);
    res.status(500).json({ success: false, message: error.message });
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


