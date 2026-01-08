import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true
    },
    senderModel: {
      type: String,
      enum: ["User", "Trainer"],
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
      required: true
    },
    receiverModel: {
      type: String,
      enum: ["User", "Trainer"],
      required: true
    },

    text: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
