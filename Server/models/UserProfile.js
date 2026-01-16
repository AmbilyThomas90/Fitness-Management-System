import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true   // one profile per user
        },

        phoneNumber: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true,
            min: 10,
            max: 100
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true

        },

        height: {
            type: Number, // cm
            required: true
        },

        weight: {
            type: Number, // kg
            required: true
        },

       healthCondition: {
    type: String,
    enum: ["NONE", "DIABETES", "HYPERTENSION", "ASTHMA", "CARDIAC", "THYROID", "OTHER"],
    default: "NONE",
    set: value => value.toUpperCase() // automatically converts input to uppercase
  },
    fitnessLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], // options for the user
      required: true,
      default: "BEGINNER",
      set: value => value ? value.toUpperCase() : value
    },

        isActive: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
