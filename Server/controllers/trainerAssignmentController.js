import TrainerAssignment from "../models/TrainerAssignment.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";


/**
 * Assign trainer to logged-in user
 */
export const assignTrainer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { trainerId, planId, timeSlot } = req.body;

    if (!trainerId || !planId || !timeSlot) {
      return res.status(400).json({
        message: "Trainer, plan, and time slot are required"
      });
    }

    // Prevent duplicate active assignment
    const existingAssignment = await TrainerAssignment.findOne({
      user: userId,
      status: "active"
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "You already have an active trainer"
      });
    }

    const assignment = await TrainerAssignment.create({
      user: userId,
      trainer: trainerId,
      plan: planId,
      timeSlot
    });

    res.status(201).json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error("ASSIGN_TRAINER_ERROR:", error);
    res.status(500).json({
      message: "Trainer assignment failed"
    });
  }
};
