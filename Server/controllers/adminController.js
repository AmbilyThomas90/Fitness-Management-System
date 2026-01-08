import User from "../models/User.js";
import Trainer from "../models/Trainer.js";
import Payment from "../models/Payment.js";
import UserProfile from "../models/UserProfile.js";
import Goal from "../models/Goal.js";
/* =========================
   DASHBOARD STATUS
========================= */
export const getDashboardStatus = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "user" });
    const trainers = await Trainer.countDocuments();

    const revenueAgg = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$planAmount", 0] } },
        },
      },
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.status(200).json({
      users,
      trainers,
      revenue,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};


/* =========================
   GET ALL USERS + PROFILE + GOAL
========================= */
export const getAllUsersWithProfile = async (req, res) => {
  try {
    //  Fetch all users (exclude password)
    const users = await User.find({ role: "user" })
      .select("-password")
      .lean();

    //  Fetch all profiles
    const profiles = await UserProfile.find()
      .populate("user", "_id")
      .lean();

    //  Fetch all goals
    const goals = await Goal.find()
      .populate("user", "_id")
      .lean();

    //  Create profile map
    const profileMap = {};
    profiles.forEach(profile => {
      if (profile.user?._id) {
        profileMap[profile.user._id.toString()] = profile;
      }
    });

    //  Create goal map
    const goalMap = {};
    goals.forEach(goal => {
      if (goal.user?._id) {
        goalMap[goal.user._id.toString()] = goal;
      }
      
    });

    //  Merge user + profile + goal
    const usersWithProfileAndGoal = users
  .filter(user => profileMap[user._id.toString()]) //  only users with profile
  .map(user => ({
    ...user,
    profile: profileMap[user._id.toString()],
    goal: goalMap[user._id.toString()] || null,
  }));
  // Deleted uers show 
//   const usersWithProfileAndGoal = users.map((user) => ({
//   ...user,
//   profile: profileMap[user._id.toString()] || null,
//   goal: goalMap[user._id.toString()] || null,
// }));


    res.status(200).json(usersWithProfileAndGoal);
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
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




// export const getAllTrainers = async (req, res) => {
//   try {
//     const trainers = await Trainer.find()
//       .populate({
//         path: "user",
//         select: "name email role"
//       })
//       .sort({ createdAt: -1 });

//         //  Log raw trainers from DB
//  console.log("👉 Raw Trainers Count:", trainers.length);

// console.log(
//   "👉 Raw Trainers Data:",
//   JSON.stringify(trainers, null, 2)
// );


//     // If frontend wants merged data: ?format=merged
//     if (req.query.format === "merged") {
//       const mergedData = trainers.map((trainer) => ({
//         trainerId: trainer._id,
//         name: trainer.user?.name,
//         email: trainer.user?.email,
//         role: trainer.user?.role,
//         phoneNumber: trainer.phoneNumber,
//         experience: trainer.experience,
//         specialization: trainer.specialization,
//        status: trainer.status,
//         profileImage: trainer.profileImage ,
//         createdAt: trainer.createdAt
//       }));
   
//       return res.status(200).json({
//         success: true,
//         count: mergedData.length,
//         trainers: mergedData
//       });
//     }

//     // Default: raw populated data
//     res.status(200).json({
//       success: true,
//       count: trainers.length,
//       trainers
//     });
//   } catch (error) {
//     console.error("Get trainers error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch trainers"
//     });
//   }
// };

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
