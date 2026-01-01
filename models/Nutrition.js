import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true
    },

    meal: {
      type: String,
      required: true
    },

    calories: {
      type: Number,
      required: true
    },

    protein: {
      type: Number, // grams
      required: true
    },

    carbs: {
      type: Number, // grams
      required: true
    },

    fats: {
      type: Number, // grams
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Nutrition", nutritionSchema);
