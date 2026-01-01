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
            enum: ["none", "diabetes", "bp", "asthma", "heart"],
            default: "none"
        },  
          isActive: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
