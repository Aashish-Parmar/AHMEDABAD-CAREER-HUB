const Job = require('../models/job.model');

// Recruiters - Create a new job/internship posting
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }
    const { title, description, jobType, salaryStipend, location, requiredSkills, company } = req.body;
    if (!title || !description || !jobType || !salaryStipend || !company) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const job = new Job({
      title,
      description,
      jobType,
      salaryStipend,
      location: location || 'Ahmedabad',
      requiredSkills,
      company
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error posting job', error: err.message });
  }
};

// Get all jobs - Public, with search filter by title/type/tech
exports.getAllJobs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.jobType = req.query.type;
    if (req.query.title) filter.title = new RegExp(req.query.title, 'i');
    if (req.query.tech) {
      const skills = Array.isArray(req.query.tech)
        ? req.query.tech
        : req.query.tech.split(',').map(skill => skill.trim());
      filter.requiredSkills = { $in: skills };
    }

    const jobs = await Job.find(filter).populate('company', 'companyName logoUrl address techStack');
    res.json(jobs);
    

  } catch (err) {
    res.status(500).json({ message: 'Error loading jobs', error: err.message });
  }
};

// Get details for a single job (by id)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'companyName logoUrl address techStack');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error loading job', error: err.message });
  }
};

// Recruiters - Delete a job they own
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    // Optional: check ownership if implementing recruiter-to-company linking
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can delete jobs' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};
