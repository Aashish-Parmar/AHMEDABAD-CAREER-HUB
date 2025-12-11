const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected: Student submits interview experience
router.post('/', authMiddleware, interviewController.submitInterview);

// Protected: Student fetches all interviews for a company
// Using /company/:companyId to avoid route conflicts
router.get('/company/:companyId', authMiddleware, interviewController.getCompanyInterviews);

module.exports = router;
