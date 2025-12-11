// controllers/auth.controller.js

const User = require("../models/user.model");
const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER: Student or Recruiter
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, college, companyName } = req.body;

    // Validate JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("ERROR: JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Check required fields (validation middleware should catch this, but double-check)
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate account
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Student must provide college
    if (role === "student" && !college) {
      return res.status(400).json({ message: "Student must provide college" });
    }

    // Recruiter must provide company name (company will be created later)
    if (role === "recruiter" && !companyName) {
      return res.status(400).json({ message: "Recruiter must provide company name" });
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      college: role === "student" ? college : undefined,
      companyName: role === "recruiter" ? companyName.trim() : undefined,
      company: undefined, // Will be set after company is created
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response: return all user info except password
    res.status(201).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      companyName: user.companyName,
      company: user.company,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Registration error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

// LOGIN: Student or Recruiter
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response: return all user info except password
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      companyName: user.companyName,
      company: user.company,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Login error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

