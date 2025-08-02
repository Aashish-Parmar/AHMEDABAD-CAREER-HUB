const Company = require('../models/company.model');

// Create a new company (Recruiter only)
exports.createCompany = async (req, res) => {
  try {
    const { companyName, description, website, logoUrl, address, techStack } = req.body;

    // Only recruiters can create companies (extra precaution)
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can create companies' });
    }

    // Check if company name already exists
    const existing = await Company.findOne({ companyName });
    if (existing) return res.status(409).json({ message: 'Company already exists' });

    const company = new Company({
      companyName,
      description,
      website,
      logoUrl,
      address,
      techStack
    });

    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error creating company', error: err.message });
  }
};

// Get all companies (public, supports search)
exports.getCompanies = async (req, res) => {
  try {
    // Optional search by companyName (case-insensitive)
    let filter = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.companyName = { $regex: regex };
    }
    const companies = await Company.find(filter).sort({ companyName: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
};

// Get a single company's detailed info by ID
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally, populate jobs and interview experiences later
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching company', error: err.message });
  }
};
