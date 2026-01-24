import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // Allow OPTIONS requests to pass through (for CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};




// import jwt from "jsonwebtoken";
// import User from "../models/User.js"; 

// export const protect = async (req, res, next) => {
//   let token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     // Verify the token using the secret key from .env
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     //Find user by decoded id, but remove password field ("-password")
//     req.user = await User.findById(decoded.id).select("-password");
    
//  // If no user found in DB → invalid token
//     if (!req.user)
//       return res.status(404).json({ message: "User not found" });

//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
