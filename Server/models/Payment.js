import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
  
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

  
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    //  Snapshot fields 
    planName: {
      type: String,
      required: true
    },

    planAmount: {
      type: Number,
      required: true
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cash"],
      required: true
    },

    //  Payment status
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
