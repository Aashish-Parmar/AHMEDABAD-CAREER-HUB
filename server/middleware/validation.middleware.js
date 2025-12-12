// Validation middleware for common validations

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Validate registration data
exports.validateRegister = (req, res, next) => {
  const { name, email, password, role, college, companyName } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (!isStrongPassword(password)) {
    errors.push("Password must contain at least one uppercase letter, one lowercase letter, and one number");
  }

  if (!role || !['student', 'recruiter'].includes(role)) {
    errors.push("Valid role (student or recruiter) is required");
  }

  if (role === 'student' && (!college || college.trim().length < 2)) {
    errors.push("College name is required for students");
  }

  if (role === 'recruiter' && (!companyName || companyName.trim().length < 2)) {
    errors.push("Company name is required for recruiters (minimum 2 characters)");
  }

  if (role === 'recruiter' && companyName && companyName.trim().length > 100) {
    errors.push("Company name must be less than 100 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate login data
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 6) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate job creation
exports.validateJob = (req, res, next) => {
  const { title, description, jobType, salaryStipend, company } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Job title must be at least 3 characters long");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Job description must be at least 10 characters long");
  }

  if (!jobType || !['internship', 'full-time'].includes(jobType)) {
    errors.push("Valid job type (internship or full-time) is required");
  }

  if (!salaryStipend || salaryStipend.trim().length < 1) {
    errors.push("Salary/Stipend information is required");
  }

  if (!company) {
    errors.push("Company ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate company creation
exports.validateCompany = (req, res, next) => {
  const { companyName, description, address } = req.body;
  const errors = [];

  if (!companyName || companyName.trim().length < 2) {
    errors.push("Company name must be at least 2 characters long");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Company description must be at least 10 characters long");
  }

  if (!address || address.trim().length < 5) {
    errors.push("Company address is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate email verification data
exports.validateVerifyEmail = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!otp) {
    errors.push("OTP is required");
  } else if (!/^\d{6}$/.test(otp)) {
    errors.push("OTP must be a 6-digit number");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate forgot password data
exports.validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

// Validate reset password data
exports.validateResetPassword = (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!otp) {
    errors.push("OTP is required");
  } else if (!/^\d{6}$/.test(otp)) {
    errors.push("OTP must be a 6-digit number");
  }

  if (!newPassword) {
    errors.push("New password is required");
  } else if (newPassword.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (!isStrongPassword(newPassword)) {
    errors.push("Password must contain at least one uppercase letter, one lowercase letter, and one number");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

