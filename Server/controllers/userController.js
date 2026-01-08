import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

// GET USER PROFILE + USER NAME & EMAIL


export const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    }).populate("user", "name email role");

    // ❌ Profile not created yet
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    //  Clean merged response
    res.status(200).json({
      message: "Profile fetched successfully",
      profile: {
        _id: profile._id,

        //  From User schema
        name: profile.user.name,
        email: profile.user.email,
        role: profile.user.role,

        //  From UserProfile schema
        phoneNumber: profile.phoneNumber,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        healthCondition: profile.healthCondition,
        isActive: profile.isActive,

        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// CREATE USER PROFILE//
export const createProfile = async (req, res) => {
  try {
    //  Check if profile already exists
    const existingProfile = await UserProfile.findOne({
      user: req.user.id
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    const {
      phoneNumber,
      age,
      gender,
      height,
      weight,
      healthCondition
    } = req.body;

    //  Basic validation
    if (!phoneNumber || !age || !gender || !height || !weight) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    //  Normalize gender (fix enum issues)
    const normalizedGender = gender.toLowerCase();

    //  Create profile
    const profile = await UserProfile.create({
      user: req.user.id,
      phoneNumber,
      age,
      gender: normalizedGender,
      height,
      weight,
      healthCondition
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE USER PROFILE//
export const updateProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
