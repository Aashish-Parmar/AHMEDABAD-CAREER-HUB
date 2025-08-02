const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public: Get all jobs with filters
router.get('/', jobController.getAllJobs);

// Public: Get single job by ID
router.get('/:id', jobController.getJobById);

// Recruiter: Post a job
router.post('/', authMiddleware, jobController.createJob);

// Recruiter: Delete own job
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
