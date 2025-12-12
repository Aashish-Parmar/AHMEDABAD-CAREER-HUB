const Interview = require("../models/interview.model");

// Submit a new interview experience (Student only)
exports.submitInterview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can submit interview experiences" });
    }
    const { company, rounds, overallRating, isAnonymous } = req.body;
    if (!company || !rounds || !overallRating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const interview = new Interview({
      company,
      user: req.user._id,
      rounds,
      overallRating,
      isAnonymous: typeof isAnonymous === "boolean" ? isAnonymous : true,
    });
    await interview.save();
    res.status(201).json({ message: "Experience submitted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting interview", error: err.message });
  }
};

// Get all interview experiences for a company
exports.getCompanyInterviews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { companyId } = req.params;
    // Only allow students access (per your trust engineering focus)
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view interview experiences" });
    }
    const interviews = await Interview.find({ company: companyId })
      .populate("user", "college") // minimal, non-sensitive info
      .sort({ interviewDate: -1 });
    res.json(interviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching interviews", error: err.message });
  }
};
