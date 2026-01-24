import Progress from "../models/Progress.js";
import Goal from "../models/Goal.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import TrainerAssignment from "../models/TrainerAssignment.js";


//    Record new progress entry
//   POST /api/progress
export const recordProgress = async (req, res) => {
  try {
    const { goalId, currentValue, note } = req.body;

    //  Verify the goal exists and belongs to the user
    const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    //  Create progress entry
    const progress = await Progress.create({
      user: req.user._id,
      goal: goalId,
      goalType: goal.goalType,
      currentValue,
      note
    });

    res.status(201).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get progress history for a specific goal
//   GET /api/progress/:goalId
export const getGoalProgress = async (req, res) => {
  try {
    const progressLogs = await Progress.find({ 
      goal: req.params.goalId, 
      user: req.user._id 
    }).sort({ recordedAt: -1 });

    res.json({ success: true, count: progressLogs.length, progressLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Get progress of approved users for the logged-in trainer


export const getUsersProgressForTrainer = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; 
    console.log(" Step 1: Logged-in User ID:", loggedInUserId);

    //  Find the Trainer profile linked to this User
    const trainerProfile = await Trainer.findOne({ user: loggedInUserId });
    
    if (!trainerProfile) {
      console.log("❌ Trainer profile not found in Trainer collection");
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const trainerDocId = trainerProfile._id;
    console.log(" Trainer Document ID:", trainerDocId);

    //  Get assignments
    // We search by trainerDocId. NOTE: If your database stores the User ID 
    // in 'trainer', use loggedInUserId here instead.
    const assignments = await TrainerAssignment.find({ 
      trainer: trainerDocId 
    }).select("user");

    console.log(" Assignments found:", assignments.length);

    if (assignments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users assigned to this trainer yet.",
        data: []
      });
    }

    //  Extract User IDs 
    const clientUserIds = assignments.map(a => a.user);
    console.log(" Assigned Client IDs:", clientUserIds);

    //  Fetch Progress for those clients
    const progressList = await Progress.find({ 
      user: { $in: clientUserIds } 
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    console.log("✅ Progress records fetched:", progressList.length);

    return res.status(200).json({
      success: true,
      message: "Users progress fetched successfully",
      count: progressList.length,
      data: progressList,
    });

  } catch (error) {
    console.error("❌ Error fetching users progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users progress",
      error: error.message,
    });
  }
};


