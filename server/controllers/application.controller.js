const Application = require("../models/application.model");
const Job = require("../models/job.model");
const User = require("../models/user.model");

// Student applies to a job
exports.applyToJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { job } = req.body;

    if (!job) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    // Prevent duplicate applications
    const exists = await Application.findOne({ user: req.user._id, job });
    if (exists)
      return res.status(400).json({ message: "Already applied to this job." });

    const app = new Application({ user: req.user._id, job });
    await app.save();
    res.status(201).json({ message: "Applied successfully." });
  } catch (err) {
    console.error("Error applying to job:", err);
    res.status(500).json({
      message: "Failed to apply to job.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Student sees their applications
exports.getMyApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Application.countDocuments({ user: req.user._id });

    const apps = await Application.find({ user: req.user._id })
      .populate({
        path: "job",
        populate: { path: "company", select: "companyName" },
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications: apps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({
      message: "Failed to fetch applications.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recruiter: Get applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can view job applications" });
    }

    const { jobId } = req.params;

    // Verify job exists and belongs to recruiter's company
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if recruiter's company matches job's company
    if (
      req.user.company &&
      req.user.company.toString() !== job.company._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only view applications for your company's jobs",
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by status if provided
    const filter = { job: jobId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Application.countDocuments(filter);

    const apps = await Application.find(filter)
      .populate({
        path: "user",
        select: "name email college avatarUrl",
      })
      .populate({
        path: "job",
        select: "title jobType company",
        populate: { path: "company", select: "companyName" },
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications: apps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error fetching job applications:", err);
    res.status(500).json({
      message: "Failed to fetch job applications",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recruiter: Get all applications for recruiter's company
exports.getCompanyApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can view company applications" });
    }

    if (!req.user.company) {
      return res
        .status(400)
        .json({ message: "Recruiter must be linked to a company" });
    }

    const Job = require("../models/job.model");

    // Get all job IDs for this company
    const companyJobs = await Job.find({ company: req.user.company }).select(
      "_id"
    );
    const jobIds = companyJobs.map((job) => job._id);

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by status and job if provided
    const filter = { job: { $in: jobIds } };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.jobId) {
      filter.job = req.query.jobId;
    }

    const total = await Application.countDocuments(filter);

    const apps = await Application.find(filter)
      .populate({
        path: "user",
        select: "name email college avatarUrl",
      })
      .populate({
        path: "job",
        select: "title jobType company",
        populate: { path: "company", select: "companyName" },
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications: apps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error fetching company applications:", err);
    res.status(500).json({
      message: "Failed to fetch company applications",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recruiter: Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can update application status" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = [
      "applied",
      "reviewed",
      "shortlisted",
      "rejected",
      "hired",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(id).populate({
      path: "job",
      populate: { path: "company" },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify recruiter's company matches job's company
    if (
      req.user.company &&
      req.user.company.toString() !== application.job.company._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update applications for your company's jobs",
      });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({
      message: "Failed to update application status",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recruiter: Get application details
exports.getApplicationById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can view application details" });
    }

    const { id } = req.params;

    const application = await Application.findById(id)
      .populate({
        path: "user",
        select: "name email college avatarUrl",
      })
      .populate({
        path: "job",
        populate: { path: "company", select: "companyName" },
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify recruiter's company matches job's company
    if (
      req.user.company &&
      req.user.company.toString() !== application.job.company._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only view applications for your company's jobs",
      });
    }

    res.json(application);
  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({
      message: "Failed to fetch application",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
