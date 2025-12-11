// // controllers/user.controller.js

// const User = require("../models/user.model");

// // Fetch currently logged-in user's profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching profile" });
//   }
// };

// // Update the logged-in user's profile (name, college, etc.)
// exports.updateProfile = async (req, res) => {
//   try {
//     const updates = { name: req.body.name };
//     if (req.user.role === "student") {
//       updates.college = req.body.college;
//     }
//     const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "Profile updated", user });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating profile" });
//   }
// };

// controllers/user.controller.js

const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    // req.user is the full user document now
    // Optionally populate company
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("company", "companyName");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      avatarUrl: user.avatarUrl || "",
      company: user.company?._id || null,
      companyName: user.companyName || user.company?.companyName || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.user.role === "student" && req.body.college) updates.college = req.body.college;

    const user = await User.findByIdAndUpdate(
      req.user._id,         // Use req.user._id
      updates,
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      message: "Profile updated.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        company: user.company,
        avatarUrl: user.avatarUrl || "",
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// Allowed file types for avatars
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads", "avatars");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "-" + Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter
});
exports.avatarMulter = upload.single("avatar");

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const urlPath = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: urlPath }
    );
    res.json({ avatarUrl: urlPath });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    
    // Handle multer errors specifically
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    if (err.message && err.message.includes('Invalid file type')) {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ 
      message: "Failed to update avatar.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

