import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

export const createSubscription = async (req, res) => {
  try {
    const { planId, planType } = req.body;
    // planType = "monthly" | "yearly"

    // 1️⃣ Validate planType
    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return res.status(400).json({
        message: "planType must be 'monthly' or 'yearly'"
      });
    }

    // 2️⃣ Check plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 3️⃣ Check active subscription
    const existing = await Subscription.findOne({
      user: req.user._id,
      status: "active"
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an active subscription"
      });
    }

    // 4️⃣ Decide plan amount & duration
    let planAmount;
    let durationInDays;

    if (planType === "monthly") {
      planAmount = plan.monthlyPlanAmount;
      durationInDays = 30;
    } else {
      planAmount = plan.yearlyPlanAmount;
      durationInDays = 365;
    }

    // 5️⃣ Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);

    // 6️⃣ Create subscription (MATCHES SCHEMA)
    const subscription = await Subscription.create({
      user: req.user._id,
      plan: plan._id,
      planType,               // required ✔
      planAmount,             // required ✔
      startDate,
      endDate,
      paymentStatus: "pending",
      status: "active"
    });

    res.status(201).json({
      success: true,
      message: "Subscription created. Proceed to payment.",
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active"
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found"
      });
    }

    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
