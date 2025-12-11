// application.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/application.controller");
const auth = require("../middleware/auth.middleware");

// Student routes
router.post("/", auth, ctrl.applyToJob);
router.get("/mine", auth, ctrl.getMyApplications);

// Recruiter routes
router.get("/job/:jobId", auth, ctrl.getJobApplications);
router.get("/company", auth, ctrl.getCompanyApplications);
router.get("/:id", auth, ctrl.getApplicationById);
router.patch("/:id/status", auth, ctrl.updateApplicationStatus);

module.exports = router;
