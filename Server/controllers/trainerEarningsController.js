import TrainerAssignment from "../models/TrainerAssignment.js";
import Payment from "../models/Payment.js";

export const getTrainerEarnings = async (req, res) => {
  try {
    const trainerId = req.user._id; // from auth middleware

    // 1️⃣ Get approved assignments for trainer
    const approvedAssignments = await TrainerAssignment.find({
      trainer: trainerId,
      status: "approved",
    }).select("user");

    const approvedUserIds = approvedAssignments.map(a => a.user);

    if (approvedUserIds.length === 0) {
      return res.json({
        totalEarnings: 0,
        earnings: [],
      });
    }

    // 2️⃣ Fetch successful payments from approved users
    const payments = await Payment.find({
      user: { $in: approvedUserIds },
      status: "success",
    })
      .populate("user", "name email")
      .populate("plan", "name");

    // 3️⃣ Calculate total earnings
    const totalEarnings = payments.reduce(
      (sum, p) => sum + p.trainerEarning,
      0
    );

    res.json({
      totalEarnings,
      earnings: payments.map(p => ({
        user: p.user,
        planName: p.planName,
        amount: p.trainerEarning,
        paymentMethod: p.paymentMethod,
        date: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Trainer earnings error:", error);
    res.status(500).json({ message: "Failed to fetch trainer earnings" });
  }
};
