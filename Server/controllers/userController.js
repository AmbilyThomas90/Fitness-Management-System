import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

// GET USER PROFILE + USER NAME & EMAIL


export const getMyProfile = async (req, res) => {
  try {
    //  Auth safety check
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log("👤 Authenticated user ID:", req.user._id);

    const profile = await UserProfile.findOne({
      user: req.user._id,
    })
      .populate("user", "name email role")
      .select("-__v");

    //  CASE 1: User has NO profile yet
    if (!profile) {
      console.log("⚠️ No profile found. Returning user basic info only.");

      return res.status(200).json({
        message: "User profile not created yet",
        hasProfile: false,
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });

    }

    //  CASE 2: User HAS profile
    console.log("✅ Profile found for user");

    return res.status(200).json({
      message: "Profile fetched successfully",
      hasProfile: true,
      profile: {
        _id: profile._id,

        // User
        name: profile.user.name,
        email: profile.user.email,
        role: profile.user.role,

        // Profile data
        phoneNumber: profile.phoneNumber,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        healthCondition: profile.healthCondition,
        fitnessLevel: profile.fitnessLevel,
        isActive: profile.isActive,

        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// CREATE USER PROFILE//
export const createProfile = async (req, res) => {
  try {
    //  Check if profile already exists
    const existingProfile = await UserProfile.findOne({
      user: req.user._id
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
      healthCondition,
      fitnessLevel
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
      user: req.user._id,
      phoneNumber,
      age,
      gender: normalizedGender,
      height,
      weight,
      healthCondition,
      fitnessLevel
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
      { user: req.user._id },
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
