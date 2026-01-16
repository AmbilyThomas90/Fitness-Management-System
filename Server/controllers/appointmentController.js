import Trainer from "../models/Trainer.js";
import TrainerAssignment from "../models/TrainerAssignment.js";
import UserProfile from "../models/UserProfile.js";
import Subscription from "../models/Subscription.js";
import Goal from "../models/Goal.js";

// GET ACTIVE ASSIGNED USERS
export const getTrainerUsersFullDetails = async (req, res) => {
  try {
    //  Find trainer by logged-in user
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    //  Get ACTIVE assignments
    const assignments = await TrainerAssignment.find({
      trainer: trainer._id,
      status: "active",
    })
      .populate("user", "name email")
      .populate("plan", "planName")
      .populate("goal", "goalType") //  SAFE (goal exists in schema)
      .lean();

    const finalData = await Promise.all(
      assignments.map(async (item) => {
        //  User profile
        const profile = await UserProfile.findOne({
          user: item.user._id,
        }).lean();

        //  Active subscription
        const subscription = await Subscription.findOne({
          user: item.user._id,
          status: "active",
        })
          .populate("plan", "planName")
          .lean();

        return {
          //  Assignment
          assignmentId: item._id,
          assignmentStatus: item.status,
          timeSlot: item.timeSlot,

          //  User
          userId: item.user._id,
          name: item.user.name,
          email: item.user.email,

          //  Profile
          phoneNumber: profile?.phoneNumber || "",
          age: profile?.age || "",
          gender: profile?.gender || "",
          healthCondition: profile?.healthCondition || "",

          //  Goal
          goalType: item.goal?.goalType || "Not specified",

          //  Plan / Subscription
          planName:
            subscription?.plan?.planName ||
            item.plan?.planName ||
            "",
          planType: subscription?.planType || "",
          planAmount: subscription?.planAmount || "",
          startDate: subscription?.startDate || null,
          endDate: subscription?.endDate || null,
        };
      })
    );

    res.status(200).json(finalData);
  } catch (error) {
    console.error("Trainer users error:", error);
    res.status(500).json({ message: error.message });
  }
};

// APPROVE ASSIGNMENT for triner (for user assignment requests)//
export const approveTrainerAssignment = async (req, res) => {
  try {
    const { action } = req.body; // "approve" | "reject"

    // Validate action
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const trainer = await Trainer.findOne({ user: req.user.id });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const assignment = await TrainerAssignment.findOne({
      _id: req.params.id,
      trainer: trainer._id,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Assignment already processed",
      });
    }

    //  Status mapping
    assignment.status = action === "approve" ? "approved" : "rejected";
    await assignment.save();

    res.status(200).json({
      success: true,
      message:
        action === "approve"
          ? "Assignment approved successfully"
          : "Assignment rejected successfully",
      assignmentId: assignment._id,
      status: assignment.status,
    });
  } catch (error) {
    console.error("Assignment action error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
