const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "applied",
    enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"]
  }
});

module.exports = mongoose.model("Application", applicationSchema);
