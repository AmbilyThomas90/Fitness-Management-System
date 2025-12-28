import Workout from "../models/Workout.js";

/**
 * Trainer creates a workout
 */
export const createWorkout = async (req, res) => {
  try {
    const {
      user,
      trainer,
      plan,
      goal,
      startDate,
      endDate,
      exercises,
      status
    } = req.body;

    const workout = await Workout.create({
      user,
      trainer,
      plan,
      goal,
      startDate,
      endDate,
      exercises,
      status
    });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all workouts (Trainer/Admin)
 */
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate("user", "name email")
      .populate("trainer", "name")
      .populate("plan", "planName")
      .populate("goal", "goalName");

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get workout by ID
 */
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate("user", "name email")
      .populate("trainer", "name")
      .populate("plan", "planName")
      .populate("goal", "goalName");

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      workout
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update workout
 */
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      workout
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete workout
 */
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
