import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

export const makePayment = async (req, res) => {
  try {
    const { subscriptionId, paymentMethod } = req.body;

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
