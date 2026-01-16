import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
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
      ref: "Plan"
    },

    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },
category: {
  type: String,
  enum: ["GENERAL","STRENGTH", "CARDIO", "CORE", "FLEXIBILITY", "BALANCE", "FUNCTIONAL", "RECOVERY"],
  required: true
},
    exercises: [
      {
        name: {
          type: String,
          required: true
        },
        sets: {
          type: Number
        },
        reps: {
          type: Number
        },
        duration: {
          type: String // "30 mins"
        },
        rest: {
          type: String // "60 sec"
        }
      }
    ],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
