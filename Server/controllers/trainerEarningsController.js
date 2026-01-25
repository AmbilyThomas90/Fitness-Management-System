import TrainerAssignment from "../models/TrainerAssignment.js";
import Trainer from "../models/Trainer.js";
import Payment from "../models/Payment.js";

/* =======================
   GET TRAINER EARNING details
======================= */
export const getTrainerEarnings = async (req, res) => {
  try {
    //  Logged-in trainer USER id
    const trainerUserId = req.user._id;
    console.log("➡️ Trainer User ID:", trainerUserId);

    //  Find Trainer profile
    const trainer = await Trainer.findOne({ user: trainerUserId });

    if (!trainer) {
      return res.status(404).json({
        message: "Trainer profile not found",
      });
    }

    console.log("✅ Trainer Profile ID:", trainer._id);

    //  Get approved assignments
    const approvedAssignments = await TrainerAssignment.find({
      trainer: trainer._id,
      status: "approved",
    }).select("user");

    console.log("✅ Approved Assignments Count:", approvedAssignments.length);

    if (!approvedAssignments.length) {
      return res.status(200).json({
        totalEarnings: 0,
        payments: [],
      });
    }

    //  Extract approved user IDs
    const approvedUserIds = approvedAssignments.map(a => a.user);
    console.log("👤 Approved User IDs:", approvedUserIds);

    //  Fetch successful payments
    const payments = await Payment.find({
      user: { $in: approvedUserIds },
      status: "success",
    })
      .populate("user", "name email")
      .populate("plan", "planName planAmount") // fallback for old data
      .sort({ createdAt: -1 });

    console.log("💳 Payments Count:", payments.length);

    //  Normalize payments (snapshot first, fallback to plan)
    const formattedPayments = payments.map(p => ({
      _id: p._id,
      user: p.user,
      planName: p.planName || p.plan?.planName || "N/A",
      planAmount: p.planAmount || p.plan?.planAmount || 0,
      trainerEarning: p.trainerEarning || 0,
      paymentMethod: p.paymentMethod,
      createdAt: p.createdAt,
    }));

    //  Calculate total earnings
    const totalEarnings = formattedPayments.reduce(
      (sum, p) => sum + p.trainerEarning,
      0
    );

    console.log("🏆 Total Trainer Earnings:", totalEarnings);

    return res.status(200).json({
      totalEarnings,
      payments: formattedPayments,
    });
  } catch (error) {
    console.error("❌ Trainer earnings error:", error);
    return res.status(500).json({
      message: "Failed to fetch trainer earnings",
    });
  }
};



