import Progress from "../models/Progress.js";
import Goal from "../models/Goal.js";

// @desc    Record new progress entry
// @route   POST /api/progress
export const recordProgress = async (req, res) => {
  try {
    const { goalId, currentValue, note } = req.body;

    // 1. Verify the goal exists and belongs to the user
    const goal = await Goal.findOne({ _id: goalId, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // 2. Create progress entry
    const progress = await Progress.create({
      user: req.user.id,
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

// @desc    Get progress history for a specific goal
// @route   GET /api/progress/:goalId
export const getGoalProgress = async (req, res) => {
  try {
    const progressLogs = await Progress.find({ 
      goal: req.params.goalId, 
      user: req.user.id 
    }).sort({ recordedAt: -1 });

    res.json({ success: true, count: progressLogs.length, progressLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};