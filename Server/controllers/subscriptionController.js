import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import Payment from "../models/Payment.js";
//import dotenv from "dotenv";

// Load environment variables
//dotenv.config();

/**
 * Helper to get Razorpay instance. 
 * This prevents the 'key_id mandatory' error by checking 
 * variables at the time of execution rather than file load.
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay Key ID or Secret is missing in .env file");
  }

  return new Razorpay({ key_id, key_secret });
};

/**
 * STEP 1: Create Razorpay Order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, planId } = req.body;

    // DEBUG LOGS - Check your terminal for these!
    console.log("--- New Order Request ---");
    console.log("Amount Received:", amount);
    console.log("PlanID Received:", planId);
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "LOADED" : "MISSING");

    if (!amount || !planId) {
      return res.status(400).json({ message: "Amount or Plan ID is missing in request" });
    }

    const instance = getRazorpayInstance(); 
    
    const options = {
      // Math.round ensures we don't send decimals to Razorpay
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({ success: true, order });

  } catch (error) {
    console.error("RAZORPAY ERROR:", error); // This is the error causing your 500
    return res.status(500).json({ 
      message: "Razorpay Order Creation Failed", 
      error: error.message 
    });
  }
};

/**
 * STEP 2: Verify Payment & Save to Database
 */
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId,
      planType,
      planAmount 
    } = req.body;

    const userId = req.user._id;

    // 1. Verify Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // 2. Fetch Plan Details (Needed for Trainer ID and Plan Name)
    const planDetails = await Plan.findById(planId);
    if (!planDetails) return res.status(404).json({ message: "Plan not found" });

    // 3. Calculate Dates
    const startDate = new Date();
    const endDate = new Date();
    if (planType === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 4. Create Subscription Record First
    // We need the subscription._id for the Payment record
    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      planType,
      planAmount,
      startDate,
      endDate,
      paymentStatus: "paid",
      status: "active",
    });

    // 5. Create Payment Record (Updated to match your new Schema)
    const payment = await Payment.create({
      user: userId,
      trainer: planDetails.trainer, // Assuming your Plan model has a trainer field
      plan: planId,
      subscription: subscription._id, // Added this to match your required schema field
      planName: planDetails.planName,
      planAmount: planAmount,
      platformFee: planAmount * 0.6, // 20% example
      trainerEarning: planAmount * 0.4, // 80% example
      paymentMethod: "razorpay",
      status: "success"
    });

    res.status(201).json({
      success: true,
      message: "Payment verified & Subscription activated!",
      subscription,
      paymentId: payment._id
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server Error during verification", error: error.message });
  }
};

/**
 * STEP 3: Get User Subscription
 */
export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    res.json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscription" });
  }
};

