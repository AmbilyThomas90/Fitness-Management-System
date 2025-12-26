import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

// user details
// export const getProfile = async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// };

// GET USER PROFILE + USER NAME & EMAIL
export const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id
    })
      .populate("user", "name email role");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// CREATE USER PROFILE
export const createProfile = async (req, res) => {
  try {
    const existingProfile = await UserProfile.findOne({
      user: req.user.id
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    const profile = await UserProfile.create({
      user: req.user.id,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      healthCondition: req.body.healthCondition
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// UPDATE USER PROFILE
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
