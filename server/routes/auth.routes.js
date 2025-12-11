const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../middleware/validation.middleware");

// @route POST /api/auth/register
router.post("/register", validateRegister, authController.register);

// @route POST /api/auth/login
router.post("/login", validateLogin, authController.login);

module.exports = router;
