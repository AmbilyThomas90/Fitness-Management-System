import mongoose from "mongoose";
import Nutrition from "../models/Nutrition.js";
import Trainer from "../models/Trainer.js";

// CREATE NUTRITION
export const createNutrition = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const { userId, goalId, planId, meal, calories, protein, carbs, fats } = req.body;

    const nutrition = await Nutrition.create({
      user: userId,
      trainer: trainer._id,
      plan: planId,
      goal: goalId,
      meal,
      calories,
      protein,
      carbs,
      fats
    });

    res.status(201).json({ nutrition });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER NUTRITION (for----Trainer)
export const getUserNutritionForTrainer = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({ nutrition });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET USER NUTRITION (for----user)
export const getUserNutrition = async (req, res) => {
  try {
    const userId = req.user._id; // <-- use logged-in user ID

    const nutrition = await Nutrition.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ nutrition });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
