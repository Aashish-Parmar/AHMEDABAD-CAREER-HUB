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
      companyName: user.company?.companyName || "",
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads", "avatars");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "-" + Date.now() + ext); // was req.user.userId: NOW req.user._id
  }
});
const upload = multer({ storage });
exports.avatarMulter = upload.single("avatar");

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const urlPath = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(
      req.user._id,      // Use req.user._id
      { avatarUrl: urlPath }
    );
    res.json({ avatarUrl: urlPath });
  } catch (err) {
    res.status(500).json({ message: "Failed to update avatar." });
  }
};
