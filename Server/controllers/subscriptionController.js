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

    const userId = req.user.id;

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
      platformFee: planAmount * 0.2, // 20% example
      trainerEarning: planAmount * 0.8, // 80% example
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
      user: req.user.id,
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

// import Subscription from "../models/Subscription.js";
// import Plan from "../models/Plan.js";
// import Payment from "../models/Payment.js";

// // Create a new subscription
// export const createSubscription = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { plan, planType, planAmount, startDate, endDate } = req.body;

//     // 1️⃣ Check required fields
//     if (!plan || !planType || !planAmount || !endDate) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // 2️⃣ Check plan exists
//     const planExists = await Plan.findById(plan);
//     if (!planExists) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     // 3️⃣ Prevent subscribing if active subscription exists
//     const activeSubscription = await Subscription.findOne({
//       user: userId,
//       status: "active",
//       endDate: { $gte: new Date() },
//     });

//     if (activeSubscription) {
//       return res.status(400).json({
//         message: `You already have an active subscription to ${activeSubscription.plan}`,
//         subscription: activeSubscription,
//       });
//     }

//     // 4️⃣ Create new subscription
//     const subscription = await Subscription.create({
//       user: userId,
//       plan,
//       planType,
//       planAmount,
//       startDate: startDate || new Date(),
//       endDate,
//       paymentStatus: "paid",
//       status: "active",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Subscription created successfully",
//       subscription,
//     });
//   } catch (error) {
//     console.error("Create subscription error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // export const createSubscription = async (req, res) => {
// //   try {
// //     const { planId, planType } = req.body;
// //     const userId = req.user.id;

// //     const plan = await Plan.findById(planId);
// //     if (!plan) return res.status(404).json({ message: "Plan not found" });

// //     const planAmount =
// //       planType === "monthly"
// //         ? plan.monthlyPlanAmount
// //         : plan.yearlyPlanAmount;

// //     const endDate = new Date();
// //     endDate.setMonth(endDate.getMonth() + (planType === "monthly" ? 1 : 12));

// //     // Create Subscription
// //     const subscription = await Subscription.create({
// //       user: userId,
// //       plan: planId,
// //       planType,
// //       planAmount,
// //       startDate: new Date(),
// //       endDate
// //     });

// //     // Create Payment Record
// //     await Payment.create({
// //       user: userId,
// //       plan: planId,
// //       planName: plan.planName,
// //       planAmount,
// //       trainerEarning: planAmount * 0.8,
// //       platformFee: planAmount * 0.2,
// //       paymentMethod: "razorpay",
// //       status: "success"
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: "Subscription activated",
// //       subscription
// //     });

// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // }

// // export const createSubscription = async (req, res) => {
// //   try {
// //     const { planId, planType } = req.body;

// //     // 1️⃣ Validate planType
// //     if (!planType || !["monthly", "yearly"].includes(planType)) {
// //       return res.status(400).json({
// //         message: "planType must be 'monthly' or 'yearly'",
// //       });
// //     }

// //     // 2️⃣ Check if plan exists
// //     const plan = await Plan.findById(planId);
// //     if (!plan) {
// //       return res.status(404).json({ message: "Plan not found" });
// //     }

// //     // 3️⃣ Check if user already has active subscription
// //     const existing = await Subscription.findOne({
// //       user: req.user._id,
// //       status: "active",
// //     });
// //     if (existing) {
// //       return res.status(400).json({
// //         message: "You already have an active subscription",
// //       });
// //     }

// //     // 4️⃣ Decide amount & duration
// //     let planAmount;
// //     let durationInDays;

// //     if (planType === "monthly") {
// //       planAmount = plan.monthlyPlanAmount;
// //       durationInDays = 30;
// //     } else {
// //       planAmount = plan.yearlyPlanAmount;
// //       durationInDays = 365;
// //     }

// //     // 5️⃣ Calculate start & end dates
// //     const startDate = new Date();
// //     const endDate = new Date(startDate);
// //     endDate.setDate(endDate.getDate() + durationInDays);

// //     // 6️⃣ Create subscription
// //     const subscription = await Subscription.create({
// //       user: req.user._id,
// //       plan: plan._id,
// //       planType,
// //       planAmount,
// //       startDate,
// //       endDate,
// //       paymentStatus: "pending", // default pending until payment
// //       status: "active",
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: "Subscription created. Proceed to payment.",
// //       subscription,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error: " + error.message });
// //   }
// // };

// // Get the logged-in user's active subscription
// export const getMySubscription = async (req, res) => {
//   const subscription = await Subscription.findOne({
//     user: req.user.id,
//     status: "active",
//   }).populate("plan");

//   if (!subscription) {
//     return res.status(404).json({ message: "No active subscription found" });
//   }

//   res.json({ success: true, subscription });
// };
