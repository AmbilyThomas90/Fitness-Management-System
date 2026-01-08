import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true
    },

    goalType: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "flexibility"],
      required: true
    },

    currentValue: {   // weight (kg), running distance (km), reps, flexibility score
      type: String,
      required: true
      
    },

    note: {
      type: String,
      trim: true
      // optional user comment like "felt energetic today"
    },

    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
