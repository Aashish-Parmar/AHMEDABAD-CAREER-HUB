// const jwt = require('jsonwebtoken');
// const User = require('../models/user.model');

// const authMiddleware = async (req, res, next) => {
//   // The token should be in the Authorization header as: Bearer <token>
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     // Verify JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user object (minus sensitive data) to request
//     const user = await User.findById(decoded.userId).select('-password');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     req.user = user; // Attach user to request for downstream controllers/routes
//     next(); // Continue to route handler
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Attach full user object to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = authMiddleware;
