import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer"
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
     platformFee: {
      type: Number,
      default: 0
    },

    trainerEarning: {
      type: Number,
      required: true
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "Razorpay","netbanking", "cash"],
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
