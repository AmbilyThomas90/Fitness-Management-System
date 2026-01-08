import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "yoga and endurance", "flexibility"],
      required: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["new", "active", "inactive"],
      default: "new", // waiting for admin approval
      lowercase: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", trainerSchema);
