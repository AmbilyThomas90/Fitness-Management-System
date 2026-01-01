import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    goalType: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "flexibility"],
      required: true
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
