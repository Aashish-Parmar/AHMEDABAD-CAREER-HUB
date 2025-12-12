const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { 
  validateRegister, 
  validateLogin, 
  validateVerifyEmail, 
  validateForgotPassword, 
  validateResetPassword 
} = require("../middleware/validation.middleware");

// @route POST /api/auth/register
router.post("/register", validateRegister, authController.register);

// @route POST /api/auth/verify-email
router.post("/verify-email", validateVerifyEmail, authController.verifyEmail);

// @route POST /api/auth/login
router.post("/login", validateLogin, authController.login);

// @route POST /api/auth/forgot-password
router.post("/forgot-password", validateForgotPassword, authController.forgotPassword);

// @route POST /api/auth/reset-password
router.post("/reset-password", validateResetPassword, authController.resetPassword);

module.exports = router;
