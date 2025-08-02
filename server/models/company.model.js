const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  website: { type: String },
  logoUrl: { type: String },
  address: { type: String, required: true },
  techStack: [{ type: String }], // Array of technologies (e.g., React, Node.js)
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
