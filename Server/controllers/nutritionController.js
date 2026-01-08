import Nutrition from "../models/Nutrition.js";

//  Create Nutrition Entry (Trainer)
export const createNutrition = async (req, res) => {
  try {
    const {
      user,
      plan,
      goal,
      meal,
      calories,
      protein,
      carbs,
      fats,
      date
    } = req.body;

    if (
      !user ||
      !plan ||
      !goal ||
      !meal ||
      !calories ||
      !protein ||
      !carbs ||
      !fats
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const nutrition = await Nutrition.create({
      user,
      trainer: req.user._id, // logged-in trainer
      plan,
      goal,
      meal,
      calories,
      protein,
      carbs,
      fats,
      date
    });

    res.status(201).json({
      success: true,
      message: "Nutrition added successfully",
      data: nutrition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  Get Nutrition for User
export const getUserNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({
      user: req.params.userId
    })
      .populate("trainer", "name")
      .populate("goal", "title")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: nutrition.length,
      data: nutrition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  Daily Nutrition Summary (Analytics)
export const getDailyNutritionSummary = async (req, res) => {
  try {
    const { date } = req.query;

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const summary = await Nutrition.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.params.userId),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$calories" },
          totalProtein: { $sum: "$protein" },
          totalCarbs: { $sum: "$carbs" },
          totalFats: { $sum: "$fats" }
        }
      }
    ]);

    res.json({
      success: true,
      data: summary[0] || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  Delete Nutrition Entry
export const deleteNutrition = async (req, res) => {
  try {
    await Nutrition.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Nutrition entry deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
