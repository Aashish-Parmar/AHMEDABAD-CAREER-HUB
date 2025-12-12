# OTP Registration & Password Reset - Testing Guide

## Prerequisites

### 1. Set Up Environment Variables

Create or update your `.env` file in the `server/` directory:

```env
# Existing variables
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development

# Email Configuration (NEW)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=Ahmedabad Career Hub
```

### 2. Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password and use it as `EMAIL_PASS`

---

## Testing Methods

### Option 1: Using Postman (Recommended)

### Option 2: Using cURL (Command Line)

### Option 3: Using Browser/Thunder Client (VS Code Extension)

---

## Test Scenarios

### Test 1: Registration Flow (Student)

**Step 1: Register a Student**

**Request:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Test1234",
  "role": "student",
  "college": "Ahmedabad University"
}
```

**Expected Response (201):**

```json
{
  "message": "Registration successful. Please check your email for OTP verification.",
  "userId": "...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "student",
  "college": "Ahmedabad University",
  "isEmailVerified": false
}
```

**Check:**

- ✅ Response status: 201
- ✅ Email received with 6-digit OTP
- ✅ User created in database with `isEmailVerified: false`
- ✅ No JWT token in response

---

**Step 2: Verify Email with OTP**

**Request:**

```http
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Expected Response (200):**

```json
{
  "message": "Email verified successfully",
  "userId": "...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "student",
  "college": "Ahmedabad University",
  "isEmailVerified": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Check:**

- ✅ Response status: 200
- ✅ `isEmailVerified: true`
- ✅ JWT token received
- ✅ OTP deleted from database

---

**Step 3: Login (After Verification)**

**Request:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Test1234"
}
```

**Expected Response (200):**

```json
{
  "userId": "...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "student",
  "college": "Ahmedabad University",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Check:**

- ✅ Login successful
- ✅ JWT token received

---

### Test 2: Registration Flow (Recruiter)

**Step 1: Register a Recruiter**

**Request:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "password": "SecurePass123",
  "role": "recruiter",
  "companyName": "Tech Solutions Inc"
}
```

**Expected Response:** Similar to student registration

**Step 2: Verify Email** (Same as Test 1, Step 2)

---

### Test 3: Login Without Verification (Should Fail)

**Request:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Test1234"
}
```

**Expected Response (403):**

```json
{
  "message": "Email not verified. Please verify your email before logging in.",
  "email": "john.doe@example.com"
}
```

**Check:**

- ✅ Response status: 403
- ✅ Clear error message

---

### Test 4: Forgot Password Flow

**Step 1: Request Password Reset OTP**

**Request:**

```http
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

**Expected Response (200):**

```json
{
  "message": "If the email exists, an OTP has been sent to your email."
}
```

**Check:**

- ✅ Response status: 200
- ✅ Email received with OTP for password reset
- ✅ OTP stored in database

---

**Step 2: Reset Password with OTP**

**Request:**

```http
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "654321",
  "newPassword": "NewSecure123"
}
```

**Expected Response (200):**

```json
{
  "message": "Password reset successfully. Please login with your new password."
}
```

**Check:**

- ✅ Response status: 200
- ✅ Password updated in database
- ✅ Can login with new password

---

### Test 5: Invalid OTP Scenarios

**Test 5a: Wrong OTP**

**Request:**

```http
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "999999"
}
```

**Expected Response (400):**

```json
{
  "message": "Invalid OTP. 4 attempt(s) remaining."
}
```

**Check:**

- ✅ Attempt counter increments
- ✅ After 5 failed attempts, OTP is deleted

---

**Test 5b: Expired OTP**

1. Wait 5+ minutes after receiving OTP
2. Try to verify with the old OTP

**Expected Response (400):**

```json
{
  "message": "OTP has expired. Please request a new OTP."
}
```

---

### Test 6: Validation Errors

**Test 6a: Invalid Email Format**

**Request:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "invalid-email",
  "password": "Test1234",
  "role": "student",
  "college": "Test College"
}
```

**Expected Response (400):**

```json
{
  "message": "Validation failed",
  "errors": ["Valid email is required"]
}
```

---

**Test 6b: Invalid OTP Format**

**Request:**

```http
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "12345"
}
```

**Expected Response (400):**

```json
{
  "message": "Validation failed",
  "errors": ["OTP must be a 6-digit number"]
}
```

---

**Test 6c: Weak Password**

**Request:**

```http
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "weak"
}
```

**Expected Response (400):**

```json
{
  "message": "Validation failed",
  "errors": [
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ]
}
```

---

## Using Postman Collection

### Create a Postman Collection:

1. **Create New Collection**: "Ahmedabad Career Hub - OTP Auth"

2. **Add Environment Variables**:

   - `base_url`: `http://localhost:5000`
   - `email`: `your-test-email@example.com`
   - `otp`: (will be filled manually from email)

3. **Create Requests**:
   - Register Student
   - Register Recruiter
   - Verify Email
   - Login
   - Forgot Password
   - Reset Password

---

## Using cURL Commands

### Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "Test1234",
    "role": "student",
    "college": "Ahmedabad University"
  }'
```

### Verify Email

```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "otp": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Test1234"
  }'
```

### Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

### Reset Password

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "otp": "654321",
    "newPassword": "NewSecure123"
  }'
```

---

## Database Verification

### Check User in MongoDB:

```javascript
// Connect to MongoDB
use your_database_name

// Check user
db.users.findOne({ email: "john.doe@example.com" })

// Should show:
// {
//   _id: ObjectId("..."),
//   name: "John Doe",
//   email: "john.doe@example.com",
//   isEmailVerified: true/false,
//   ...
// }
```

### Check OTP in MongoDB:

```javascript
// Check OTPs
db.otps.find({ email: "john.doe@example.com" });

// Should show OTP document (if not expired/used)
// Note: OTPs auto-delete after 5 minutes (TTL index)
```

---

## Troubleshooting

### Issue 1: Email Not Sending

**Check:**

1. ✅ Environment variables are set correctly
2. ✅ Gmail App Password is correct (not regular password)
3. ✅ 2-Step Verification is enabled on Gmail
4. ✅ Check server logs for email errors
5. ✅ Check spam folder

**Common Errors:**

- `Invalid login`: Wrong EMAIL_PASS
- `Connection timeout`: Check EMAIL_HOST and EMAIL_PORT
- `Authentication failed`: Use App Password, not regular password

---

### Issue 2: OTP Not Found

**Possible Causes:**

1. OTP expired (5 minutes)
2. OTP already used
3. Wrong email address
4. Max attempts reached (5 attempts)

**Solution:** Request a new OTP

---

### Issue 3: Login Still Works Without Verification

**Check:**

1. ✅ User model has `isEmailVerified` field
2. ✅ Login controller checks `isEmailVerified`
3. ✅ Database migration (existing users might have `isEmailVerified: false`)

**Fix Existing Users:**

```javascript
// In MongoDB
db.users.updateMany(
  { isEmailVerified: { $exists: false } },
  { $set: { isEmailVerified: false } }
);
```

---

## Testing Checklist

- [ ] Registration sends OTP email
- [ ] OTP verification updates user status
- [ ] Login blocked for unverified users
- [ ] Login works after verification
- [ ] Forgot password sends OTP
- [ ] Password reset with OTP works
- [ ] Expired OTPs are rejected
- [ ] Invalid OTPs increment attempt counter
- [ ] Max attempts (5) blocks further attempts
- [ ] Validation errors work correctly
- [ ] Both student and recruiter roles work
- [ ] Email templates render correctly

---

## Quick Test Script

Save this as `test-otp.js` and run with `node test-otp.js`:

```javascript
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/auth";
const TEST_EMAIL = "test@example.com";

async function testOTPFlow() {
  try {
    // 1. Register
    console.log("1. Registering user...");
    const registerRes = await axios.post(`${BASE_URL}/register`, {
      name: "Test User",
      email: TEST_EMAIL,
      password: "Test1234",
      role: "student",
      college: "Test College",
    });
    console.log("✅ Registration successful:", registerRes.data.message);

    // 2. Check email for OTP, then verify
    console.log(
      "\n2. Check your email for OTP, then run verify-email with the OTP"
    );

    // 3. Login (should fail without verification)
    console.log("\n3. Attempting login (should fail)...");
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: TEST_EMAIL,
        password: "Test1234",
      });
    } catch (err) {
      console.log("✅ Login blocked (expected):", err.response.data.message);
    }

    console.log("\n✅ Basic flow test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testOTPFlow();
```

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Start your server: `npm run dev`
3. ✅ Test registration flow
4. ✅ Test forgot password flow
5. ✅ Verify email templates
6. ✅ Test edge cases
7. ✅ Check database records

Happy Testing! 🚀
