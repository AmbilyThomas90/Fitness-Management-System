import Subscription from "../models/Subscription.js";
import TrainerAssignment from "../models/TrainerAssignment.js";

export const getUserDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id || req.user.id;

    // =====================
    //  USER INFO ( FIX)
    // =====================
    const userData = {
      id: userId,
      name: req.user.name,
      email: req.user.email,
    };

    // =====================
    //  Subscription
    // =====================
    const subscription = await Subscription.findOne({
      user: userId,
      $or: [{ isActive: true }, { endDate: { $gte: new Date() } }],
    })
      .populate("plan", "planName monthlyPlanAmount yearlyPlanAmount")
      .sort({ createdAt: -1 })
      .lean();

    // =====================
    //  Trainer Assignment (LATEST)
    // =====================
    const trainerAssignment = await TrainerAssignment.findOne({
      user: userId,
    })
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "name email phoneNumber",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // =====================
    //  Trainer Data
    // =====================
    let trainerData = null;

    if (trainerAssignment) {
      trainerData = {
        name: trainerAssignment.trainer?.user?.name || null,
        email: trainerAssignment.trainer?.user?.email || null,
        phoneNumber: trainerAssignment.trainer?.phoneNumber || null,
        specialization:
          trainerAssignment.trainer?.specialization || "General Fitness",
        status: trainerAssignment.status, // active | approved | rejected | completed
        timeSlot: trainerAssignment.timeSlot,
        assignedAt: trainerAssignment.createdAt,
      };
    }

    // =====================
    //  Subscription Data
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
    //  FINAL RESPONSE 
    // =====================
    res.status(200).json({
      user: userData,          //  REQUIRED FOR WELCOME MESSAGE
      subscription: subscriptionData,
      trainer: trainerData,
      workoutsCompleted: 24,   // mock
      unreadMessages: 3,       // mock
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

