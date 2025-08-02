const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { type: String, enum: ['internship', 'full-time'], required: true },
  salaryStipend: { type: String, required: true },
  location: { type: String, default: 'Ahmedabad' },
  requiredSkills: [{ type: String }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
