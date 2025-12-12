// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // Hashed password
//   role: { type: String, enum: ['student', 'recruiter'], required: true },
//   college: { type: String }, // Required if role is 'student'
//   company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // For recruiters
  
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// user.model.js (partial)
// models/user.model.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ["student", "recruiter"], required: true },
  college:     { type: String },
  companyName: { type: String }, // For recruiters - company name entered during registration
  company:     { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // Linked after company creation
  avatarUrl:   { type: String },
  isEmailVerified: { type: Boolean, default: false, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
