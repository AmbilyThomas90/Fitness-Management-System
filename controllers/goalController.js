import Goal from "../models/Goal.js";

// Create goal
export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      user: req.user.id,
      goalType: req.body.goalType
    });

    res.status(201).json({
      success: true,
      goal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all gaol
export const getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });

    res.json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a goal
export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update a goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (req.body.goalType) goal.goalType = req.body.goalType;
    if (req.body.status) goal.status = req.body.status;

    await goal.save();

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete goal 
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({
      success: true,
      message: "Goal deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
