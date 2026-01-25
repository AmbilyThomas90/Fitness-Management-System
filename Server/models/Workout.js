import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,

    exercises: [
      {
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: [
            "GENERAL",
            "STRENGTH",
            "CARDIO",
            "CORE",
            "FLEXIBILITY",
            "BALANCE",
            "FUNCTIONAL",
            "RECOVERY",
          ],
          required: true,
        },
        sets: Number,
        reps: Number,
        duration: String,
        rest: String,
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
