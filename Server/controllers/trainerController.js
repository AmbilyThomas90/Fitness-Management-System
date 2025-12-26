import Trainer from "../models/Trainer.js"
import User from "../models/User.js";

/**
 * CREATE TRAINER PROFILE
 */
export const createTrainerProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingTrainer = await Trainer.findOne({
      user: req.user.id
    });

    if (existingTrainer) {
      return res
        .status(400)
        .json({ message: "Trainer profile already exists" });
    }

    const {
      phoneNumber,
      specialization,
      experience,
      profileImage
    } = req.body;

    if (!phoneNumber || !specialization || experience === undefined) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Get name & email from User model
    const user = await User.findById(req.user.id);

    const trainer = await Trainer.create({
      user: req.user.id,
      name: user.name,
      email: user.email,
      phoneNumber,
      specialization,
      experience,
      profileImage
    });

    res.status(201).json({
      message: "Trainer profile created (pending admin approval)",
      trainer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
;

// export const createTrainer = async (req, res) => {
//   const trainer = await Trainer.create({
//     userId: req.user.id,
//     certifications: req.body.certifications
//   });
//   res.json(trainer);
// };
