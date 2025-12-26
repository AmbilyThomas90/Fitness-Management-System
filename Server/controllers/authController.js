import User from "../models/User.js";
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


export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token, user });
};
