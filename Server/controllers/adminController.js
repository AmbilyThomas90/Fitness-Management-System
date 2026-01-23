import User from "../models/User.js";
import Trainer from "../models/Trainer.js";
import Payment from "../models/Payment.js";
import UserProfile from "../models/UserProfile.js";
import Goal from "../models/Goal.js";
import Subscription from "../models/Subscription.js";
/* =========================
   DASHBOARD STATUS
========================= */
export const getDashboardStatus = async (req, res) => {
  try {
    // Run all queries in parallel
    const [users, trainers, revenueAgg] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Trainer.countDocuments(),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$planAmount", 0] } },
          },
        },
      ]),
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Explicitly prevent caching if you want fresh data every time
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    res.status(200).json({
      users,
      trainers,
      revenue,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

/* =========================
   GET ALL USERS + PROFILE + GOAL
========================= */
export const getAllUsersWithProfile = async (req, res) => {
  try {
    console.log("Fetching all users...");

    // 1️⃣ Users
    const users = await User.find({ role: "user" })
      .select("-password")
      .lean();

    // 2️⃣ Related data
    const [profiles, goals, subscriptions, payments] = await Promise.all([
      UserProfile.find().lean(),
      Goal.find().lean(),
      Subscription.find().lean(),
      Payment.find({ status: "success" })
        .sort({ createdAt: -1 }) // latest payment first
        .lean(),
    ]);

    // 3️⃣ Profile Map
    const profileMap = {};
    profiles.forEach(p => {
      if (p.user) profileMap[p.user.toString()] = p;
    });

    // 4️⃣ Goal Map
    const goalMap = {};
    goals.forEach(g => {
      if (g.user) goalMap[g.user.toString()] = g;
    });

    // 5️⃣ ACTIVE Subscription Map
    const subscriptionMap = {};
    const today = new Date();

    subscriptions.forEach(sub => {
      const userId = sub.user?.toString();
      if (!userId) return;

      const isActive =
        sub.status === "active" &&
        (!sub.endDate || new Date(sub.endDate) >= today);

      if (isActive) subscriptionMap[userId] = sub;
    });

    // 6️⃣ Payment Map (LATEST PAYMENT PER USER)
    const paymentMap = {};
    payments.forEach(pay => {
      const userId = pay.user?.toString();
      if (!userId || paymentMap[userId]) return;

      paymentMap[userId] = {
        planName: pay.planName,
        amount: pay.planAmount,
        paymentMethod: pay.paymentMethod,
        paymentStatus: pay.status,
      };
    });

    // 7️⃣ Merge

const usersWithDetails = users
  .filter(user => profileMap[user._id.toString()])
  .map(user => {
    const id = user._id.toString();
    const activeSub = subscriptionMap[id] || null;
    const latestPayment = paymentMap[id] || null;

    return {
      ...user,
      profile: profileMap[id] || null,
      goal: goalMap[id] || null,
      subscription: activeSub,
      payment: latestPayment,
      // Manually add these fields if your frontend expects them at the top level:
      planName: activeSub ? activeSub.planName : (latestPayment ? latestPayment.planName : "No Plan"),
      planAmount: activeSub ? activeSub.planAmount : (latestPayment ? latestPayment.amount : "-"),
    };
  });

    res.status(200).json(usersWithDetails);
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};



/* =========================
  Block users and unblock users
========================= */

export const blockUnblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    //  Toggle isActive
    profile.isActive = !profile.isActive;

    await profile.save();

    res.status(200).json({
      success: true,
      message: profile.isActive
        ? "User unblocked successfully"
        : "User blocked successfully",
      isActive: profile.isActive,
    });
  } catch (error) {
    console.error("Block/unblock error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};
/* =========================
   GET  Get All Trainers
========================= */
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate({
        path: "user",
        select: "name email role profileImage",
      })
      .sort({ createdAt: -1 });

    //  Debug logs
    // console.log(" Raw Trainers Count:", trainers.length);
    console.log(
      " Raw Trainers Data:",
      JSON.stringify(trainers, null, 1)
    );

    return res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error("❌ Get trainers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trainers",
    });
  }
};


/* =========================
   UPDATE  TRAINER STATUS
========================= */

export const updateTrainerStatus = async (req, res) => {
  try {
    const { status } = req.body; // "active" | "inactive"
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    trainer.status = status;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: `Trainer ${status} successfully`,
      trainer
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update trainer status"
    });
  }
};

/* =========================
   APPROVE TRAINER
========================= */
export const approveTrainer = async (req, res) => {
  
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer approved successfully",
      trainer,
    });
  } catch (error) {
    console.error("Approve trainer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve trainer",
    });
  }
};

/* =========================
   REPORTS
========================= */
export const getReports = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    res.status(200).json({ totalPayments });
  } catch (error) {
    console.error("Reports error:", error);
    res.status(500).json({ message: "Failed to load reports" });
  }
};
