import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
    },

    monthlyPlanAmount: {
      type: Number,
      required: true,
    },

    yearlyPlanAmount: {
      type: Number,
      required: true,
    },

    waterStations: { type: Boolean, default: false },
    lockerRooms: { type: Boolean, default: false },
    wifiService: { type: Boolean, default: false },
    cardioClass: { type: Boolean, default: false },
    refreshment: { type: Boolean, default: false },
    groupFitnessClasses: { type: Boolean, default: false },
    personalTrainer: { type: Boolean, default: false },
    specialEvents: { type: Boolean, default: false },
    cafeOrLounge: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
