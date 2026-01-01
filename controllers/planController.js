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

    // ✅ Validate required fields
    if (!planName || planName.trim() === "")
      return res.status(400).json({ message: "Plan name is required" });

    if (monthlyPlanAmount === undefined || monthlyPlanAmount === null)
      return res.status(400).json({ message: "Monthly plan amount is required" });

    if (yearlyPlanAmount === undefined || yearlyPlanAmount === null)
      return res.status(400).json({ message: "Yearly plan amount is required" });

    // ✅ Booleans: just check they exist, allow false
    const booleanFields = {
      waterStations,
      lockerRooms,
      wifiService,
      cardioClass,
      refreshment,
      groupFitnessClasses,
      personalTrainer,
      specialEvents,
      cafeOrLounge,
    };

    for (const [key, value] of Object.entries(booleanFields)) {
      if (value === undefined || value === null) {
        return res.status(400).json({ message: `${key} info is required` });
      }
    }

    // ✅ Create the plan
    const plan = await Plan.create({
      planName,
      monthlyPlanAmount,
      yearlyPlanAmount,
      ...booleanFields,
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan,
    });

  } catch (error) {
    // Handle duplicate key error (unique fields)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Monthly or yearly plan amount already exists",
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
