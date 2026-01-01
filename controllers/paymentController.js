import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

export const makePayment = async (req, res) => {
  try {
    const { subscriptionId, paymentMethod } = req.body;

    const platformFee = amount * 0.2; // 20% commission
    const trainerEarning = amount - platformFee;

    const subscription = await Subscription.findById(subscriptionId)
      .populate("plan");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const plan = await Plan.findById(subscription.plan._id);

    const payment = await Payment.create({
      user: req.user._id,
      plan: plan._id,
      planName: plan.planName,
      planAmount: subscription.planAmount,
      platformFee,
      trainerEarning,
      paymentMethod,
      status: "success"
    });

    subscription.paymentStatus = "paid";
    await subscription.save();

    res.status(201).json({
      success: true,
      message: "Payment successful",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// users payment 
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id; // set by protect middleware

    const payments = await Payment.find({ user: userId })
      .populate("plan", "planName monthlyPlanAmount yearlyPlanAmount")
      .populate("trainer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Get User Payments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user payments"
    });
  }
};

// Trainer Earnings
export const getTrainerEarnings = async (req, res) => {
  const payments = await Payment.find({
    trainer: req.user.id,
    status: "paid"
  });

  const totalEarnings = payments.reduce(
    (sum, p) => sum + p.trainerEarning,
    0
  );

  res.json({ totalEarnings, payments });
};

// Admin view the payment
export const adminAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("user trainer plan");

  res.json(payments);
};

//  create Payment
//export const makePayment = async (req, res) => {
//   const { trainerId, planId, amount } = req.body;

//   const platformFee = amount * 0.2; // 20% commission
//   const trainerEarning = amount - platformFee;

//   const payment = await Payment.create({
//     user: req.user.id,
//     trainer: trainerId,
//     plan: planId,
//     amount,
//     platformFee,
//     trainerEarning
//   });

//   res.status(201).json(payment);
// };
