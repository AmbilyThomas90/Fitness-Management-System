import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema(
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
        planType:{
       type:String,
        required:true,
    },


    planAmount:{
        type:String,
        required:true
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: Date,

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid"
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
