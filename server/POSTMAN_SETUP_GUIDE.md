# Postman Collection Setup Guide

## 📥 How to Import the Collection

### Step 1: Import Collection

1. **Open Postman**
2. Click **"Import"** button (top left)
3. Select **"File"** tab
4. Choose `Ahmedabad_Career_Hub_OTP_Auth.postman_collection.json`
5. Click **"Import"**

### Step 2: Create Environment (Recommended)

1. Click **"Environments"** in the left sidebar
2. Click **"+"** to create new environment
3. Name it: **"Ahmedabad Career Hub - Local"**
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|----------------|
| `base_url` | `http://localhost:5000` | `http://localhost:5000` |
| `email` | `your-email@example.com` | `your-email@example.com` |
| `otp` | (leave empty) | (leave empty) |
| `authToken` | (leave empty) | (leave empty) |
| `userId` | (leave empty) | (leave empty) |

5. Click **"Save"**
6. Select this environment from the dropdown (top right)

### Step 3: Update Variables

1. Click the **eye icon** (👁️) next to environment dropdown
2. Update `email` with your test email address
3. Leave `otp` empty (you'll fill it after receiving email)

---

## 🚀 How to Use the Collection

### Complete Registration Flow

1. **Register Student** (Request #1)
   - Update `email` variable if needed
   - Click **"Send"**
   - ✅ Check response: Should be 201 with success message
   - 📧 **Check your email for OTP**

2. **Verify Email** (Request #3)
   - Copy the 6-digit OTP from your email
   - Update `otp` variable in Postman
   - Click **"Send"**
   - ✅ Should return 200 with JWT token

3. **Login** (Request #4)
   - Click **"Send"**
   - ✅ Should return 200 with token

### Test Login Protection

1. **Login Without Verification** (Request #5)
   - Use an unverified email
   - Click **"Send"**
   - ✅ Should return 403 error

### Password Reset Flow

1. **Forgot Password** (Request #6)
   - Click **"Send"**
   - 📧 **Check your email for OTP**

2. **Reset Password** (Request #7)
   - Copy OTP from email
   - Update `otp` variable
   - Click **"Send"**
   - ✅ Should return 200 with success message

3. **Login with New Password** (Request #4)
   - Update password in request body to `NewSecure123`
   - Click **"Send"**
   - ✅ Should login successfully

### Error Testing

- **Test Invalid OTP** (Request #8) - Should return 400
- **Test Invalid Email** (Request #9) - Should return validation error
- **Test Invalid OTP Format** (Request #10) - Should return validation error
- **Test Weak Password** (Request #11) - Should return validation error

---

## 📋 Collection Structure

```
Ahmedabad Career Hub - OTP Auth
├── Registration Flow
│   ├── 1. Register Student
│   ├── 2. Register Recruiter
│   └── 3. Verify Email
├── Login Flow
│   ├── 4. Login (After Verification)
│   └── 5. Login Without Verification (Should Fail)
├── Password Reset Flow
│   ├── 6. Forgot Password
│   └── 7. Reset Password
└── Error Testing
    ├── 8. Test Invalid OTP
    ├── 9. Test Invalid Email Format
    ├── 10. Test Invalid OTP Format
    └── 11. Test Weak Password
```

---

## ✅ Automated Tests

Each request includes **automated tests** that run automatically:

- ✅ Status code validation
- ✅ Response structure validation
- ✅ Success/error message validation
- ✅ Auto-save tokens and user IDs

**View Test Results:**
- Click on any request
- Go to **"Test Results"** tab
- See all passed/failed tests

---

## 🔄 Using Collection Runner

1. Click on collection name
2. Click **"Run"** button
3. Select requests to run
4. Click **"Run Ahmedabad Career Hub - OTP Auth"**
5. View results

**Note:** For OTP flows, you'll need to manually update `otp` variable between requests.

---

## 💡 Tips

1. **Save Responses:** Right-click request → "Save Response" → "Save as example"
2. **Duplicate Requests:** Right-click → "Duplicate" to create variations
3. **Pre-request Scripts:** Can be added to auto-generate test data
4. **Environment Switching:** Switch between Local/Dev/Prod environments
5. **Variable Auto-save:** Collection automatically saves `authToken` and `userId` after successful requests

---

## 🐛 Troubleshooting

### Variables Not Working?
- ✅ Make sure environment is selected (top right dropdown)
- ✅ Check variable names match exactly (case-sensitive)
- ✅ Use `{{variable_name}}` syntax in requests

### Tests Failing?
- ✅ Make sure server is running
- ✅ Check environment variables are set correctly
- ✅ Verify email configuration in `.env` file

### OTP Not Working?
- ✅ Check email inbox (and spam folder)
- ✅ OTP expires in 5 minutes
- ✅ Max 5 attempts per OTP
- ✅ Update `otp` variable with exact 6-digit code

---

## 📚 Additional Resources

- See `TESTING_GUIDE.md` for detailed test scenarios
- See `QUICK_START_TESTING.md` for quick setup
- Check server logs for detailed error messages

Happy Testing! 🚀

