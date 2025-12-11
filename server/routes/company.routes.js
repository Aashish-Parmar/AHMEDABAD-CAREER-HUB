const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCompany } = require('../middleware/validation.middleware');

// Public: Get all companies, with optional search
router.get('/', companyController.getCompanies);

// Recruiter: Get own company
router.get('/my', authMiddleware, companyController.getMyCompany);

// Public: Get company details by ID
router.get('/:id', companyController.getCompanyById);

// Recruiter only: Create a new company
router.post('/', authMiddleware, validateCompany, companyController.createCompany);

// Recruiter only: Update own company
router.patch('/:id', authMiddleware, companyController.updateCompany);

// Recruiter only: Delete own company
router.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = router;
