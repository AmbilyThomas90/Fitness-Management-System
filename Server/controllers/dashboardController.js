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
      $or: [{ isActive: true }, { endDate: { $gte: new Date() } }],
    })
      .populate("plan", "planName monthlyPlanAmount yearlyPlanAmount")
      .sort({ createdAt: -1 })
      .lean();

    // =====================
    // 2️⃣ Trainer Assignment (LATEST)
    // =====================
    const trainerAssignment = await TrainerAssignment.findOne({
      user: userId,
    })
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // =====================
    // 3️⃣ Trainer Data (WITH STATUS)
    // =====================
    let trainerData = null;

    if (trainerAssignment) {
      trainerData = {
        name: trainerAssignment.trainer?.user?.name || null,
        email: trainerAssignment.trainer?.user?.email || null,
        specialization:
          trainerAssignment.trainer?.specialization || "General Fitness",

        // 🔥 IMPORTANT: status exposed to frontend
        status: trainerAssignment.status, // active | approve | rejected | completed
        timeSlot: trainerAssignment.timeSlot,
        assignedAt: trainerAssignment.createdAt,
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
        isActive: subscription.isActive,
      };
    }

    // =====================
    // 5️⃣ Response
    // =====================
    res.status(200).json({
      subscription: subscriptionData,
      trainer: trainerData,
      workoutsCompleted: 24, // mock / future logic
      unreadMessages: 3,     // mock / future logic
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
