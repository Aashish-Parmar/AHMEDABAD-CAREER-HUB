// controllers/auth.controller.js

const User = require("../models/user.model");
const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER: Student or Recruiter
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, college, company } = req.body;

    // Check required fields
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

    // Recruiter must have company (validate id and presence)
    let companyId = company;
    if (role === "recruiter") {
      if (!companyId) {
        return res.status(400).json({ message: "Recruiter must link to company" });
      }
      // Optionally validate the company id exists
      const companyExists = await Company.findById(companyId);
      if (!companyExists) {
        return res.status(400).json({ message: "Company does not exist" });
      }
    }

    // Student must provide college
    if (role === "student" && !college) {
      return res.status(400).json({ message: "Student must provide college" });
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      college: role === "student" ? college : undefined,
      company: role === "recruiter" ? companyId : undefined,
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
      company: user.company,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
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
      company: user.company,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

