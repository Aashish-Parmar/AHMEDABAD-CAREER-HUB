const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateJob } = require("../middleware/validation.middleware");

// Public: Get all jobs with filters
router.get("/", jobController.getAllJobs);

// Public: Get single job by ID
router.get("/:id", jobController.getJobById);

// Recruiter: Post a job
router.post("/", authMiddleware, validateJob, jobController.createJob);

// Recruiter: Update own job
router.patch("/:id", authMiddleware, jobController.updateJob);

// Recruiter: Delete own job
router.delete("/:id", authMiddleware, jobController.deleteJob);

module.exports = router;
