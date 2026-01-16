import Workout from "../models/Workout.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Plan from "../models/Plan.js";

/**
 * Create workout for a user
 * POST /api/trainer/workouts
 */
export const createWorkout = async (req, res) => {
  try {
    // 1️⃣ Find trainer
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const {
      userId,
      planId,
      goalId,
      category,        // ✅ REQUIRED
      startDate,
      endDate,
      exercises
    } = req.body;

    // 2️⃣ Basic validation
    if (
      !userId ||
      !goalId ||
      !category ||
      !startDate ||
      !Array.isArray(exercises) ||
      !exercises.length
    ) {
      return res.status(400).json({
        message: "User, goal, category, startDate, and exercises are required",
      });
    }

    // 3️⃣ Validate exercises
    for (const ex of exercises) {
      if (!ex.name) {
        return res.status(400).json({
          message: "Each exercise must have a name",
        });
      }
    }

    // 4️⃣ Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Validate goal
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // 6️⃣ Optional plan
    const plan = planId ? await Plan.findById(planId) : null;

    // 7️⃣ Create workout (✅ MATCHES SCHEMA)
    const workout = await Workout.create({
      user: userId,
      trainer: trainer._id,
      plan: plan?._id || null,
      goal: goal._id,
      category: category.toUpperCase(), // ✅ ENUM SAFE
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      exercises
    });

    return res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout,
    });

  } catch (error) {
    console.error("Create workout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create workout",
      error: error.message,
    });
  }
};


/**
 * Get all workouts for a user
 * GET /api/trainer/user-workouts/:userId
 */
export const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId })
      .populate("goal", "goalName")
      .populate("plan", "planName planType amount startDate endDate");

    res.status(200).json({ success: true, workouts });
  } catch (error) {
    console.error("Get workouts error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// //Trainer creates a workout for a user

// export const createWorkout = async (req, res) => {
//   try {
//     const trainer = await Trainer.findOne({ user: req.user.id });

//     if (!trainer) {
//       return res.status(404).json({ message: "Trainer not found" });
//     }

//     const { userId, planId, goalId, startDate, endDate, exercises } = req.body;

//     // Basic validations
//     if (!userId || !goalId || !startDate || !exercises?.length) {
//       return res.status(400).json({
//         message: "User, goal, start date, and exercises are required",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const goal = await Goal.findById(goalId);
//     if (!goal) {
//       return res.status(404).json({ message: "Goal not found" });
//     }

//     const plan = planId ? await Plan.findById(planId) : null;

//     // Create workout
//     const workout = await Workout.create({
//       user: userId,
//       trainer: trainer._id,
//       plan: plan?._id || null,
//       goal: goal._id,
//       startDate: new Date(startDate),
//       endDate: endDate ? new Date(endDate) : null,
//       exercises,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Workout created successfully",
//       workout,
//     });
//   } catch (error) {
//     console.error("Create workout error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create workout",
//       error: error.message,
//     });
//   }
// };
// // Get Trainer created a workout for a user
// export const getTrainerUserWorkout = async (req, res) => {
//   try {
//     // logged-in trainer
//     const trainer = await Trainer.findOne({ user: req.user.id });

//     if (!trainer) {
//       return res.status(404).json({ message: "Trainer not found" });
//     }

//     const { userId } = req.params;

//     // user profile
//     const userProfile = await UserProfile.findOne({ user: userId });

//     // active goal
//     const goal = await Goal.findOne({ user: userId, status: "active" });

//     // workouts
//     const workouts = await Workout.find({
//       user: userId,
//       trainer: trainer._id
//     }).populate("goal", "goalName");

//     res.status(200).json({
//       success: true,
//       data: {
//         user: {
//           _id: userProfile?.user?._id,
//           name: userProfile?.name,
//           email: userProfile?.email
//         },
//         userProfile,
//         goal,
//         workouts
//       }
//     });
//   } catch (error) {
//     console.error("Workout fetch error:", error);
//     res.status(500).json({
//       message: "Failed to fetch workout data",
//       error: error.message
//     });
//   }
// };

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
/**
 * Trainer creates a workout
 */
// export const createWorkout = async (req, res) => {
//   try {
//     const {
//       user,
//       trainer,
//       plan,
//       goal,
//       startDate,
//       endDate,
//       exercises,
//       status
//     } = req.body;

//     const workout = await Workout.create({
//       user,
//       trainer,
//       plan,
//       goal,
//       startDate,
//       endDate,
//       exercises,
//       status
//     });

//     res.status(201).json({
//       success: true,
//       message: "Workout created successfully",
//       workout
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
