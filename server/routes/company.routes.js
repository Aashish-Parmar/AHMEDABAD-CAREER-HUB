const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public: Get all companies, with optional search
router.get('/', companyController.getCompanies);

// Public: Get company details by ID
router.get('/:id', companyController.getCompanyById);

// Recruiter only: Create a new company
router.post('/', authMiddleware, companyController.createCompany);

module.exports = router;
