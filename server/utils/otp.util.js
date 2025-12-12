const OTP = require("../models/otp.model");

/**
 * Generate a 6-digit numeric OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in database with 5-minute expiry
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @param {string} purpose - 'registration' or 'password-reset'
 * @returns {Promise<Object>} - Saved OTP document
 */
const storeOTP = async (email, otp, purpose) => {
  try {
    // Delete any existing OTPs for this email and purpose
    await OTP.deleteMany({ email, purpose });

    // Create new OTP with 5-minute expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const otpDoc = new OTP({
      email,
      otp,
      purpose,
      expiresAt,
      attempts: 0,
    });

    await otpDoc.save();
    return otpDoc;
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error;
  }
};

/**
 * Verify OTP and check expiry/attempts
 * @param {string} email - User email
 * @param {string} otp - OTP code to verify
 * @param {string} purpose - 'registration' or 'password-reset'
 * @returns {Promise<Object>} - { valid: boolean, message: string }
 */
const verifyOTP = async (email, otp, purpose) => {
  try {
    // Find OTP document
    const otpDoc = await OTP.findOne({ email, purpose });

    if (!otpDoc) {
      return {
        valid: false,
        message: "OTP not found. Please request a new OTP.",
      };
    }

    // Check if OTP has expired
    if (new Date() > otpDoc.expiresAt) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return {
        valid: false,
        message: "OTP has expired. Please request a new OTP.",
      };
    }

    // Check if max attempts reached
    if (otpDoc.attempts >= 5) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return {
        valid: false,
        message: "Maximum verification attempts reached. Please request a new OTP.",
      };
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      // Increment attempts
      otpDoc.attempts += 1;
      await otpDoc.save();

      const remainingAttempts = 5 - otpDoc.attempts;
      return {
        valid: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // OTP is valid - delete it after successful verification
    await OTP.deleteOne({ _id: otpDoc._id });

    return {
      valid: true,
      message: "OTP verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Increment OTP verification attempts (used when OTP is incorrect)
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @param {string} purpose - 'registration' or 'password-reset'
 * @returns {Promise<void>}
 */
const incrementOTPAttempts = async (email, otp, purpose) => {
  try {
    const otpDoc = await OTP.findOne({ email, purpose, otp });
    if (otpDoc) {
      otpDoc.attempts += 1;
      await otpDoc.save();
    }
  } catch (error) {
    console.error("Error incrementing OTP attempts:", error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  incrementOTPAttempts,
};

