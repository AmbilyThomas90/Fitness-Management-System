import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

// users payment 

export const getMyPayments = async (req, res) => {
  try {
    // 1️⃣ Find active subscription
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // 2️⃣ Find latest payment for this subscription
    const payment = await Payment.findOne({
      user: req.user._id,
      subscription: subscription._id,
    }).sort({ createdAt: -1 });

    // 3️⃣ Send combined response
    res.status(200).json({
      success: true,
      subscription,
      payment: payment
        ? {
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            amount: payment.amount,
            transactionId: payment.transactionId,
            invoiceUrl: payment.invoiceUrl,
            receiptUrl: payment.receiptUrl,
          }
        : null,
    });
  } catch (error) {
    console.error("Get My Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription",
    });
  }
};
// export const getMyPayments = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user.id;

//     const latestPayment = await Payment.findOne({ user: userId })
//       .populate({
//         path: "subscription",
//         populate: {
//           path: "plan",
//           select: "planName monthlyPlanAmount yearlyPlanAmount",
//         },
//       })
//       .populate("trainer", "name email")
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!latestPayment || !latestPayment.subscription) {
//       return res.status(404).json({
//         success: false,
//         message: "No active subscription or payment found",
//       });
//     }

//     // ✅ Normalize response
//     const paymentData = {
//       amount: latestPayment.amount,
//       status: latestPayment.status,
//       subscription: latestPayment.subscription,
//       payment: {
//         paymentId: latestPayment.transactionId || latestPayment._id,
//         method: latestPayment.paymentMethod || "Stripe/Card",
//         status: latestPayment.status,
//         invoiceUrl: latestPayment.invoiceUrl,
//         receiptUrl: latestPayment.receiptUrl,
//       },
//     };

//     res.status(200).json({
//       success: true,
//       payment: paymentData,
//     });
//   } catch (error) {
//     console.error("Get User Payments Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user payments",
//     });
//   }
// };

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

/* =======================
   ADMIN Paymentdetails
======================= */

export const adminAllPayments = async (req, res) => {
  try {
    //  Fetch payments and use .populate() for everything
    // This replaces the manual Map lookup logic
    const payments = await Payment.find()
      .populate("user", "name")           // Get user name
      .populate("subscription")          // Get full subscription details (startDate, endDate, status)
      .populate("trainer", "name")       // Optional: Get trainer name if needed
      .sort({ createdAt: -1 })
      .lean();

    //  Format the data for the frontend
    const formattedData = payments.map((payment) => {
      return {
        // Unique ID for React keys
        _id: payment._id,

        // USER INFO
        userName: payment.user?.name || "Deleted User",

        // TRAINER INFO (if applicable)
        trainerName: payment.trainer?.name || "N/A",

        // PLAN INFO (Taken from snapshots in the Payment model)
        planName: payment.planName,
        planAmount: payment.planAmount,
        trainerEarning: payment.trainerEarning,
        platformFee: payment.platformFee,

        // SUBSCRIPTION INFO (Populated from the Subscription model)
        subscriptionId: payment.subscription?._id,
        subscriptionStartDate: payment.subscription?.startDate || null,
        subscriptionEndDate: payment.subscription?.endDate || null,
        subscriptionStatus: payment.subscription?.status || "n/a",

        // PAYMENT INFO
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.status,
        paymentDate: payment.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("ADMIN_ALL_PAYMENTS_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment records",
      error: error.message,
    });
  }
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
