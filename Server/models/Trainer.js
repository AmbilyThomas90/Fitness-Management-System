import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true   // one profile per user
            },
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    specialization: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "flexibility"],
      required: true
    },

    experience: {
      type: Number, // years
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", trainerSchema);
