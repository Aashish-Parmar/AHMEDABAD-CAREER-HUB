const Job = require("../models/job.model");
const Company = require("../models/company.model");

// Recruiters - Create a new job/internship posting
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }
    const {
      title,
      description,
      jobType,
      salaryStipend,
      location,
      requiredSkills,
      company,
    } = req.body;
    if (!title || !description || !jobType || !salaryStipend || !company) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Validate recruiter is linked to this company
    if (req.user.company && req.user.company.toString() !== company) {
      return res
        .status(403)
        .json({ message: "You can only post jobs for your linked company" });
    }

    const job = new Job({
      title,
      description,
      jobType,
      salaryStipend,
      location: location || "Ahmedabad",
      requiredSkills,
      company,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({
      message: "Error posting job",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get all jobs - Public, with search filter by title/type/tech
exports.getAllJobs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.jobType = req.query.type;
    if (req.query.title) filter.title = new RegExp(req.query.title, "i");
    if (req.query.tech) {
      const skills = Array.isArray(req.query.tech)
        ? req.query.tech
        : req.query.tech.split(",").map((skill) => skill.trim());
      filter.requiredSkills = { $in: skills };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate("company", "companyName logoUrl address techStack")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error loading jobs:", err);
    res.status(500).json({
      message: "Error loading jobs",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get details for a single job (by id)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "companyName logoUrl address techStack"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error loading job", error: err.message });
  }
};

// Recruiters - Update a job they own
exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can update jobs" });
    }

    const { id } = req.params;
    const {
      title,
      description,
      jobType,
      salaryStipend,
      location,
      requiredSkills,
    } = req.body;

    const job = await Job.findById(id).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Verify recruiter's company matches job's company
    if (
      req.user.company &&
      req.user.company.toString() !== job.company._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only update jobs for your company" });
    }

    // Update fields if provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (jobType !== undefined) {
      if (!["internship", "full-time"].includes(jobType)) {
        return res
          .status(400)
          .json({
            message: "Invalid job type. Must be internship or full-time",
          });
      }
      job.jobType = jobType;
    }
    if (salaryStipend !== undefined) job.salaryStipend = salaryStipend;
    if (location !== undefined) job.location = location;
    if (requiredSkills !== undefined) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    await job.save();
    const updatedJob = await Job.findById(id).populate(
      "company",
      "companyName logoUrl address techStack"
    );

    res.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({
      message: "Error updating job",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recruiters - Delete a job they own
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can delete jobs" });
    }

    // Verify recruiter's company matches job's company
    if (
      req.user.company &&
      req.user.company.toString() !== job.company._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete jobs for your company" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({
      message: "Error deleting job",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
