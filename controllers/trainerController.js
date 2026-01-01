import Trainer from "../models/Trainer.js"
import User from "../models/User.js";

/**
 * CREATE TRAINER PROFILE
 */
export const createTrainerProfile = async (req, res) => {
  try {
    const { phoneNumber, specialization, experience } = req.body;

    const profileImage = req.file ? req.file.path : "";

    const trainer = await Trainer.findOneAndUpdate(
      { user: req.user._id },
      {
        phoneNumber,
        specialization,
        experience,
        profileImage,
      },
      { new: true, upsert: true }
    );

    res.json({ message: "Profile created", trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
