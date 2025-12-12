# Quick Start Testing Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure Email (Required)

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification (if not already)
   - Go to "App passwords" → Generate for "Mail"
   - Copy the 16-character password

2. **Update `.env` file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=Ahmedabad Career Hub
   ```

### Step 2: Start Server

```bash
cd server
npm run dev
```

### Step 3: Test It!

Choose one of these methods:

---

## 📮 Method 1: Automated Test Script (Easiest)

```bash
# Install axios if needed
npm install axios

# Edit test-otp-flow.js and set your email
# Then run:
node test-otp-flow.js
```

This will:
- ✅ Test registration
- ✅ Test login protection
- ✅ Test forgot password
- ✅ Test validation

**Note:** You'll still need to manually verify email with OTP from your inbox.

---

## 🎯 Method 2: Postman (Recommended)

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `OTP_Auth_Postman_Collection.json`
   - Set environment variables:
     - `base_url`: `http://localhost:5000`
     - `email`: `your-test-email@example.com`

2. **Test Flow:**
   - Run "1. Register Student"
   - Check your email for OTP
   - Update `otp` variable in Postman
   - Run "3. Verify Email"
   - Run "4. Login (After Verification)"

---

## 🌐 Method 3: Browser/VS Code (Thunder Client)

1. **Install Thunder Client** (VS Code Extension)
2. **Create Requests:**
   - POST `http://localhost:5000/api/auth/register`
   - POST `http://localhost:5000/api/auth/verify-email`
   - POST `http://localhost:5000/api/auth/login`
   - POST `http://localhost:5000/api/auth/forgot-password`
   - POST `http://localhost:5000/api/auth/reset-password`

---

## 📝 Method 4: cURL Commands

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test1234",
    "role": "student",
    "college": "Ahmedabad University"
  }'
```

### Verify Email (replace OTP from email)
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test1234"
  }'
```

---

## ✅ Complete Test Flow

1. **Register** → Check email for OTP
2. **Try Login** → Should fail (email not verified)
3. **Verify Email** → Use OTP from email
4. **Login Again** → Should succeed
5. **Forgot Password** → Check email for OTP
6. **Reset Password** → Use OTP to set new password
7. **Login with New Password** → Should succeed

---

## 🐛 Troubleshooting

### Email Not Sending?
- ✅ Check `.env` file has correct values
- ✅ Use Gmail App Password (not regular password)
- ✅ Check server logs for errors
- ✅ Check spam folder

### OTP Not Working?
- ✅ OTP expires in 5 minutes
- ✅ Max 5 attempts per OTP
- ✅ OTP must be 6 digits
- ✅ Check email matches exactly

### Login Still Works Without Verification?
- ✅ Check database: `db.users.findOne({ email: "..." })`
- ✅ Should have `isEmailVerified: false`
- ✅ Server should return 403 error

---

## 📚 Full Documentation

See `TESTING_GUIDE.md` for comprehensive testing scenarios.

---

## 🎉 Success Checklist

- [ ] Server starts without errors
- [ ] Registration sends email with OTP
- [ ] Login blocked for unverified users
- [ ] Email verification works
- [ ] Login works after verification
- [ ] Forgot password sends OTP
- [ ] Password reset works
- [ ] Validation errors work correctly

Happy Testing! 🚀

