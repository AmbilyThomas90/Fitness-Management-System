import User from "../models/User.js";
import Trainer from "../models/Trainer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try{
  const { name, email, password, role } = req.body;

      // Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash the password

  const hash = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({ name, email, password: hash, role });

 res.json({
      message: "Signup successful",
      user: {
        _id: user._id,
        username: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    let trainerStatus = null;

    // ✅ CHECK TRAINER STATUS
    if (user.role === "trainer") {
      const trainer = await Trainer.findOne({ user: user._id });

      if (!trainer)
        return res
          .status(403)
          .json({ message: "Trainer profile not found" });

      if (trainer.status !== "active") {
        return res.status(403).json({
          message:
            trainer.status === "new"
              ? "Trainer profile is under admin review"
              : "Trainer account is inactive",
        });
      }

      trainerStatus = trainer.status;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      trainerStatus,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(401).json({ message: "Wrong password" });

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET
//   );
//   res.json({ token, user });
// };

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Just confirm email exists
    res.status(200).json({
      message: "Email verified. You can reset password."
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
