const Company = require('../models/company.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');

// Create a new company (Recruiter only)
exports.createCompany = async (req, res) => {
  try {
    const { companyName, description, website, logoUrl, address, techStack } = req.body;

    // Only recruiters can create companies (extra precaution)
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can create companies' });
    }

    // Check if recruiter already has a company linked
    const user = await User.findById(req.user._id);
    if (user.company) {
      return res.status(400).json({ message: 'You already have a company linked to your account' });
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

    // Link company to user
    user.company = company._id;
    await user.save();

    res.status(201).json({
      message: 'Company created and linked successfully',
      company
    });
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ 
      message: 'Error creating company', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
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

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Company.countDocuments(filter);

    const companies = await Company.find(filter)
      .sort({ companyName: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      companies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ 
      message: 'Error fetching companies', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
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

// Get recruiter's own company
exports.getMyCompany = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can view their company' });
    }

    const user = await User.findById(req.user._id).populate('company');
    if (!user.company) {
      return res.status(404).json({ message: 'No company linked to your account' });
    }

    // Get statistics
    const jobCount = await Job.countDocuments({ company: user.company._id });
    const Application = require('../models/application.model');
    const jobIds = await Job.find({ company: user.company._id }).distinct('_id');
    const applicationCount = await Application.countDocuments({
      job: { $in: jobIds }
    });

    res.json({
      company: user.company,
      statistics: {
        jobsPosted: jobCount,
        applicationsReceived: applicationCount
      }
    });
  } catch (err) {
    console.error('Error fetching my company:', err);
    res.status(500).json({ 
      message: 'Error fetching company', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Update company (Recruiter only, own company)
exports.updateCompany = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update companies' });
    }

    const { id } = req.params;
    const { companyName, description, website, logoUrl, address, techStack } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Verify recruiter owns this company
    const user = await User.findById(req.user._id);
    if (!user.company || user.company.toString() !== id) {
      return res.status(403).json({ message: 'You can only update your own company' });
    }

    // Update fields if provided
    if (companyName !== undefined) {
      // Check if new name conflicts with existing company
      if (companyName !== company.companyName) {
        const existing = await Company.findOne({ companyName });
        if (existing) {
          return res.status(409).json({ message: 'Company name already exists' });
        }
      }
      company.companyName = companyName;
    }
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (logoUrl !== undefined) company.logoUrl = logoUrl;
    if (address !== undefined) company.address = address;
    if (techStack !== undefined) {
      company.techStack = Array.isArray(techStack) 
        ? techStack 
        : techStack.split(',').map(s => s.trim()).filter(Boolean);
    }

    await company.save();

    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ 
      message: 'Error updating company', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// Delete company (Recruiter only, own company, only if no jobs)
exports.deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can delete companies' });
    }

    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Verify recruiter owns this company
    const user = await User.findById(req.user._id);
    if (!user.company || user.company.toString() !== id) {
      return res.status(403).json({ message: 'You can only delete your own company' });
    }

    // Check if company has jobs posted
    const jobCount = await Job.countDocuments({ company: id });
    if (jobCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete company with active job postings. Please delete all jobs first.' 
      });
    }

    // Remove company link from user
    user.company = undefined;
    await user.save();

    // Delete company
    await company.deleteOne();

    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Error deleting company:', err);
    res.status(500).json({ 
      message: 'Error deleting company', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};
