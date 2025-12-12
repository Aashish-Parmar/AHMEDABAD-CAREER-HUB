// controllers/auth.controller.js

const User = require("../models/user.model");
const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOTP, storeOTP, verifyOTP } = require("../utils/otp.util");
const { sendOTPEmail } = require("../utils/email.service");

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

    // Create user with unverified email
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      college: role === "student" ? college : undefined,
      companyName: role === "recruiter" ? companyName.trim() : undefined,
      company: undefined, // Will be set after company is created
      isEmailVerified: false,
    });

    await user.save();

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, "registration");

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, "registration");
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Don't fail registration if email fails, but log it
      // User can request resend later
    }

    // Response: return user info without token (email not verified yet)
    res.status(201).json({
      message: "Registration successful. Please check your email for OTP verification.",
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      companyName: user.companyName,
      isEmailVerified: false,
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Email not verified. Please verify your email before logging in.",
        email: user.email,
      });
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

// VERIFY EMAIL: Verify OTP and activate user account
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Verify OTP
    const verificationResult = await verifyOTP(email, otp, "registration");
    if (!verificationResult.valid) {
      return res.status(400).json({ message: verificationResult.message });
    }

    // Update user verification status
    user.isEmailVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response: return user info with token
    res.json({
      message: "Email verified successfully",
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      companyName: user.companyName,
      company: user.company,
      isEmailVerified: true,
      token,
    });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ 
      message: "Email verification error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

// FORGOT PASSWORD: Send OTP for password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({ 
        message: "If the email exists, an OTP has been sent to your email." 
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, "password-reset");

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, "password-reset");
      res.json({ 
        message: "If the email exists, an OTP has been sent to your email." 
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      res.status(500).json({ 
        message: "Failed to send OTP email. Please try again later." 
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ 
      message: "Forgot password error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

// RESET PASSWORD: Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    const verificationResult = await verifyOTP(email, otp, "password-reset");
    if (!verificationResult.valid) {
      return res.status(400).json({ message: verificationResult.message });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Response: success
    res.json({
      message: "Password reset successfully. Please login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ 
      message: "Reset password error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

