# Ahmedabad Career Hub - Project Analysis

## 📋 Project Overview

**Ahmedabad Career Hub** is a full-stack job portal application connecting students and recruiters in Ahmedabad. It allows students to browse jobs, apply to positions, and share interview experiences, while recruiters can post jobs and manage companies.

---

## 🏗️ Architecture

### **Tech Stack:**

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Node.js + Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

### **Project Structure:**

```
ahmedabad-career-hub/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/     # API configuration
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   └── pages/       # Page components
│   └── package.json
└── server/          # Express backend
    ├── controllers/ # Business logic
    ├── models/      # MongoDB schemas
    ├── routes/      # API routes
    ├── middleware/  # Auth middleware
    └── server.js    # Entry point
```

---

## 🔄 Application Flow

### **1. Authentication Flow**

#### **Registration:**

1. User visits `/register`
2. Selects role: **Student** or **Recruiter**
3. Fills form:
   - **Student**: name, email, password, college
   - **Recruiter**: name, email, password, company ObjectId
4. Backend validates and creates user
5. JWT token generated and returned
6. User auto-logged in → redirected to `/dashboard`

#### **Login:**

1. User visits `/login`
2. Enters email and password
3. Backend validates credentials
4. JWT token generated
5. Token stored in localStorage
6. User redirected to `/dashboard`

### **2. Student Flow**

1. **Browse Jobs** (`/jobs`)

   - View all job postings
   - Filter by type (internship/full-time), title, tech stack
   - Click job to see details

2. **View Job Details** (`/jobs/:id`)

   - See full job description
   - View company information
   - Apply to job

3. **Apply to Job**

   - POST `/api/applications`
   - Creates application record
   - Status: "applied" → "reviewed" → "shortlisted" → "rejected" → "hired"

4. **View Applications** (`/applications`)

   - See all applied jobs
   - Track application status

5. **Submit Interview Experience** (`/submit-interview`)

   - Share interview rounds, questions, ratings
   - Can be anonymous
   - Helps other students prepare

6. **View Profile** (`/profile`)
   - Update name, college
   - Upload avatar

### **3. Recruiter Flow**

1. **Create Company** (if not exists)

   - POST `/api/companies`
   - Add company details, tech stack, logo

2. **Post Job** (`/post-job`)

   - Create job/internship posting
   - Set title, description, salary, skills required
   - Link to company

3. **Recruiter Dashboard** (`/recruiter-dashboard`)

   - View posted jobs
   - Manage applications

4. **View Profile** (`/profile`)
   - Update profile
   - Upload avatar

### **4. Public Pages**

- **Home** (`/`): Landing page
- **Companies** (`/companies`): Browse all companies
- **Company Details** (`/companies/:id`): View company info

---

## 🐛 ERRORS FOUND

### **1. CRITICAL: Duplicate Routes in App.jsx**

**Location**: `client/src/App.jsx`

**Issue**:

- `/dashboard` route is defined **twice** (lines 31 and 36-43)
- `/profile` route is defined **twice** (lines 80-87 and 89-96)
- Second `/profile` route incorrectly renders `<DashboardPage />` instead of `<ProfilePage />`

**Impact**:

- React Router will only use the first matching route
- Second route definitions are unreachable
- Confusing code structure

**Fix Needed**: Remove duplicate routes

---

### **2. Missing Environment Variables**

**Issue**: No `.env` file found in server directory

**Required Variables**:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (defaults to 5000)

**Impact**: Application won't run without these

---

### **3. Missing Timestamps in User Model**

**Location**: `server/models/user.model.js`

**Issue**: User schema doesn't have `{ timestamps: true }` option

**Impact**: No `createdAt` and `updatedAt` fields for users

---

### **4. Error Handling in Application Controller**

**Location**: `server/controllers/application.controller.js`

**Issue**:

- Line 15: Empty catch block `catch {}` - errors are swallowed
- Line 28: Empty catch block - no error logging

**Impact**:

- Errors are not logged
- Difficult to debug issues
- Users get generic error messages

---

### **5. Missing Validation**

**Issues**:

- No email format validation on frontend
- No password strength requirements
- No file type/size validation for avatar uploads
- No input sanitization

**Impact**: Security vulnerabilities and poor UX

---

### **6. Hardcoded Backend URL**

**Location**: `client/src/api/axios.js`

**Issue**: Backend URL is hardcoded to production URL

```javascript
baseURL: import.meta.env.VITE_BACKEND_URL ||
  "https://ahmedabad-career-hub.onrender.com/api";
```

**Impact**:

- Can't easily switch between dev/prod
- Should default to localhost in development

---

### **7. Missing Error Boundaries**

**Issue**: No React Error Boundaries in the app

**Impact**:

- Unhandled errors crash entire app
- Poor user experience

---

### **8. Interview Route Issue**

**Location**: `server/routes/interview.routes.js`

**Issue**:

- Line 10: Route `/api/interviews/:companyId` conflicts with potential `/api/interviews/:id`
- Should use query parameter or different path structure

**Impact**:

- Route ambiguity
- Could cause routing conflicts

---

### **9. Missing Company Population in Job Controller**

**Location**: `server/controllers/job.controller.js`

**Issue**:

- Line 13-21: When creating job, company is not validated to exist
- No check if company belongs to the recruiter

**Impact**:

- Recruiters can post jobs for any company
- Data integrity issues

---

### **10. No Pagination**

**Issues**:

- `getAllJobs` returns all jobs without pagination
- `getCompanies` returns all companies without pagination
- `getMyApplications` returns all applications without pagination

**Impact**:

- Performance issues with large datasets
- Slow page loads
- High memory usage

---

## 💡 IMPROVEMENTS NEEDED

### **1. Security Improvements**

- ✅ Add password strength validation (min 8 chars, special chars)
- ✅ Add rate limiting for auth endpoints
- ✅ Add CORS configuration (currently allows all origins)
- ✅ Add input sanitization (prevent XSS)
- ✅ Add file upload validation (file type, size limits)
- ✅ Add helmet.js for security headers
- ✅ Implement refresh tokens (JWT expires in 1h)

### **2. Code Quality**

- ✅ Add proper error logging (use winston or similar)
- ✅ Add request validation middleware (use express-validator)
- ✅ Add API documentation (Swagger/OpenAPI)
- ✅ Remove commented code
- ✅ Add consistent error response format
- ✅ Add try-catch blocks with proper error handling

### **3. Database Improvements**

- ✅ Add indexes on frequently queried fields (email, company, job)
- ✅ Add database connection error handling
- ✅ Add data validation at schema level
- ✅ Add unique constraints where needed

### **4. Frontend Improvements**

- ✅ Add loading states for async operations
- ✅ Add proper error messages/toasts
- ✅ Add form validation feedback
- ✅ Add pagination component
- ✅ Add search/filter UI improvements
- ✅ Add skeleton loaders
- ✅ Add error boundaries

### **5. Features Missing**

- ✅ Email verification on registration
- ✅ Password reset functionality
- ✅ Job application status updates (recruiter side)
- ✅ Notifications system
- ✅ Job favorites/bookmarks
- ✅ Resume upload for applications
- ✅ Company logo upload functionality
- ✅ Interview experience viewing (public page)

### **6. Performance**

- ✅ Add pagination to all list endpoints
- ✅ Add caching for frequently accessed data
- ✅ Optimize database queries (use select, lean)
- ✅ Add image optimization for avatars
- ✅ Add lazy loading for routes

### **7. Testing**

- ✅ Add unit tests for controllers
- ✅ Add integration tests for routes
- ✅ Add frontend component tests
- ✅ Add E2E tests

### **8. Documentation**

- ✅ Add API documentation
- ✅ Add README with setup instructions
- ✅ Add environment variable documentation
- ✅ Add deployment guide

---

## 📊 Summary

### **Errors to Fix Immediately:**

1. ✅ Duplicate routes in App.jsx
2. ✅ Missing .env file and documentation
3. ✅ Empty catch blocks in application controller
4. ✅ Missing timestamps in user model

### **High Priority Improvements:**

1. ✅ Add pagination
2. ✅ Add proper error handling
3. ✅ Add input validation
4. ✅ Add security measures (rate limiting, CORS config)

### **Medium Priority:**

1. ✅ Add loading states
2. ✅ Add error boundaries
3. ✅ Improve error messages
4. ✅ Add file upload validation

### **Low Priority (Nice to Have):**

1. ✅ Add testing
2. ✅ Add API documentation
3. ✅ Add email verification
4. ✅ Add notifications

---

**Ready to fix these issues? Say "okay" and I'll start implementing the fixes!** 🚀
