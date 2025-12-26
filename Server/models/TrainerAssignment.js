import mongoose from "mongoose";

const trainerAssignmentSchema = new mongoose.Schema(
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

    assignDate: {
      type: Date,
      default: Date.now
    },

    timeSlot: {
      type: String,
      required: true
      // example: "06:00 AM - 07:00 AM"
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("TrainerAssignment", trainerAssignmentSchema);
