const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewDate: { type: Date, default: Date.now },
  rounds: [{
    roundType: { type: String, required: true }, // e.g., Technical, HR, Coding Test
    questionsAsked: [String], // List of questions asked
    difficultyRating: { type: Number, min: 1, max: 5, required: true }
  }],
  overallRating: { type: Number, min: 1, max: 5, required: true },
  isAnonymous: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
