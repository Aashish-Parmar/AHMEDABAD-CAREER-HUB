# Ahmedabad Career Hub

A full-stack job portal application connecting students and recruiters in Ahmedabad. Students can browse jobs, apply to positions, and share interview experiences, while recruiters can post jobs and manage companies.

## 🚀 Features

### For Students
- Browse and search jobs/internships
- Apply to positions
- Track application status
- Share interview experiences
- View company profiles

### For Recruiters
- Create and manage company profiles
- Post jobs and internships
- View applications
- Manage job postings

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Node.js + Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ahmedabad-career-hub
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
# Copy the following and fill in your values:
```

Create `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/ahmedabad-career-hub
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ahmedabad-career-hub

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

```bash
# Start development server
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file (optional)
# Only needed if you want to override the default backend URL
```

Create `client/.env` (optional):
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
ahmedabad-career-hub/
├── client/              # React frontend
│   ├── src/
│   │   ├── api/         # API configuration
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   └── pages/       # Page components
│   └── package.json
└── server/              # Express backend
    ├── controllers/     # Business logic
    ├── models/          # MongoDB schemas
    ├── routes/          # API routes
    ├── middleware/      # Auth & validation middleware
    └── server.js        # Entry point
```

## 🔐 Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_BACKEND_URL` - Backend API URL (optional, defaults to localhost in dev)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Companies
- `GET /api/companies` - Get all companies (with pagination)
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company (recruiter only)

### Applications
- `POST /api/applications` - Apply to job (student only)
- `GET /api/applications/mine` - Get my applications (student only)

### Interviews
- `POST /api/interviews` - Submit interview experience (student only)
- `GET /api/interviews/company/:companyId` - Get interviews for company

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar

## 🧪 Testing

```bash
# Backend
cd server
npm test  # (when tests are added)

# Frontend
cd client
npm test  # (when tests are added)
```

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables
2. Ensure MongoDB connection string is set
3. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Set `VITE_BACKEND_URL` to production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder

## 📝 Recent Fixes

See [FIXES_APPLIED.md](./FIXES_APPLIED.md) for a complete list of fixes and improvements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 👥 Authors

Ahmedabad Career Hub Team

---

**Note**: Make sure MongoDB is running before starting the server!