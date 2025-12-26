import Plan from "../models/Plan.js";

//Create Plan

export const createPlan = async (req, res) => {
  try {
    const {
      planName,
      monthlyPlanAmount,
      yearlyPlanAmount,
      waterStations,
      lockerRooms,
      wifiService,
      cardioClass,
      refreshment,
      groupFitnessClasses,
      personalTrainer,
      specialEvents,
      cafeOrLounge
    } = req.body;

    // ✅ Validation: check required fields
    if (!planName)
      return res.status(400).json({ message: "Plan name is required" });

    if (!monthlyPlanAmount)
      return res.status(400).json({ message: "Monthly plan amount is required" });

    if (!yearlyPlanAmount)
      return res.status(400).json({ message: "Yearly plan amount is required" });

    if (!waterStations)
      return res.status(400).json({ message: "Water stations info is required" });

    if (!lockerRooms)
      return res.status(400).json({ message: "Locker rooms info is required" });

    if (!wifiService)
      return res.status(400).json({ message: "WiFi service info is required" });

    if (!cardioClass)
      return res.status(400).json({ message: "Cardio class info is required" });

    if (!refreshment)
      return res.status(400).json({ message: "Refreshment info is required" });

    if (!groupFitnessClasses)
      return res.status(400).json({ message: "Group fitness classes info is required" });

    if (!personalTrainer)
      return res.status(400).json({ message: "Personal trainer info is required" });

    if (!specialEvents)
      return res.status(400).json({ message: "Special events info is required" });

    if (!cafeOrLounge)
      return res.status(400).json({ message: "Cafe or lounge info is required" });

    // ✅ Create plan after validation
    const plan = await Plan.create({
      planName,
      monthlyPlanAmount,
      yearlyPlanAmount,
      waterStations,
      lockerRooms,
      wifiService,
      cardioClass,
      refreshment,
      groupFitnessClasses,
      personalTrainer,
      specialEvents,
      cafeOrLounge
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan
    });

  } catch (error) {
    // Handle duplicate key error (unique fields)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Monthly or yearly plan amount already exists"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

//Get All Plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get Single Plan
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Selected Plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan updated", plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete Selected Plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
