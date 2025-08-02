const Application = require("../models/application.model");

// Student applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { job } = req.body;
    // Prevent duplicate applications
    const exists = await Application.findOne({ user: req.user._id, job });
    if (exists)
      return res.status(400).json({ message: "Already applied to this job." });

    const app = new Application({ user: req.user._id, job });
    await app.save();
    res.status(201).json({ message: "Applied successfully." });
  } catch {
    res.status(500).json({ message: "Failed to apply to job." });
  }
};

// Student sees their applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id }).populate({
      path: "job",
      populate: { path: "company", select: "companyName" }
    });
    res.json(apps);
  } catch {
    res.status(500).json({ message: "Failed to fetch applications." });
  }
};
