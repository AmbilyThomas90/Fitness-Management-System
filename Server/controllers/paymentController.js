import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";

// BUY PLAN + MAKE PAYMENT
export const createPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const { planId } = req.params;

    //  Get plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    //  Create payment (snapshot)
    const payment = await Payment.create({
      user: req.user.id,
      plan: plan._id,
      planName: plan.planName,
      planAmount: plan.monthlyPlanAmount, // or yearly based on logic
      paymentMethod,
      status: "success"
    });

    //  Create subscription
    const subscription = await Subscription.create({
      user: req.user.id,
      plan: plan._id,
      startDate: new Date(),
      endDate: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ),
      paymentStatus: "paid",
      status: "active"
    });

    res.status(201).json({
      message: "Plan subscribed successfully",
      payment,
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LOGGED-IN USER PAYMENTS
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.id
    })
      .populate("plan", "planName")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const createPayment = async (req, res) => {
//   const payment = await Payment.create(req.body);
//   res.json(payment);
// };
