export const authorizeRole = (...roles) => {

    // Check if the role of the authenticated user

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      
      // If the user's role is not allowed, return a 403 Forbidden response

      return res.status(403).json({ message: "Access denied :  Required role [${roles}] not met." });
    }
    // If the user's role is allowed, call next() 
    next();
  };
};
