import Subscription from "../models/Subscription.js";
import TrainerAssignment from "../models/TrainerAssignment.js";

export const getUserDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id || req.user.id;

    // =====================
    // 1️⃣ Subscription
    // =====================
    const subscription = await Subscription.findOne({
      user: userId,
      $or: [{ isActive: true }, { endDate: { $gte: new Date() } }]
    })
      .populate("plan", "planName monthlyPlanAmount yearlyPlanAmount")
      .sort({ createdAt: -1 })
      .lean();

    // =====================
    // 2️⃣ Trainer Assignment
    // =====================
    const trainerAssignment = await TrainerAssignment.findOne({ user: userId })
      .populate({
        path: "trainer",              // Trainer model
        populate: {
          path: "user",               // User model inside Trainer
          select: "name email"
        }
      })
      .lean();

    // =====================
    // 3️⃣ Trainer Data
    // =====================
    let trainerData = null;
    if (trainerAssignment?.trainer?.user) {
      trainerData = {
        name: trainerAssignment.trainer.user.name,
        specialization:
          trainerAssignment.trainer.specialization || "General Fitness"
      };
    }

    // =====================
    // 4️⃣ Subscription Data
    // =====================
    let subscriptionData = null;
    if (subscription?.plan) {
      subscriptionData = {
        planName: subscription.plan.planName,
        planType: subscription.planType,
        amount:
          subscription.planType === "yearly"
            ? subscription.plan.yearlyPlanAmount
            : subscription.plan.monthlyPlanAmount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.isActive
      };
    }

    // =====================
    // 5️⃣ Response
    // =====================
    res.status(200).json({
      subscription: subscriptionData,
      trainer: trainerData,
      workoutsCompleted: 24,
      unreadMessages: 3
    });

  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
