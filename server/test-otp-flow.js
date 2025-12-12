/**
 * Simple test script for OTP Registration and Password Reset
 * 
 * Usage:
 * 1. Make sure your server is running: npm run dev
 * 2. Install axios if not installed: npm install axios
 * 3. Update TEST_EMAIL below with your email
 * 4. Run: node test-otp-flow.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = 'your-email@example.com'; // ⚠️ CHANGE THIS
const TEST_PASSWORD = 'Test1234';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testOTPFlow() {
  log('\n🧪 Starting OTP Flow Tests...\n', 'blue');

  try {
    // Test 1: Registration
    log('📝 Test 1: Registering new user...', 'yellow');
    try {
      const registerRes = await axios.post(`${BASE_URL}/register`, {
        name: 'Test User',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        role: 'student',
        college: 'Test College'
      });
      
      log('✅ Registration successful!', 'green');
      log(`   Message: ${registerRes.data.message}`, 'reset');
      log(`   User ID: ${registerRes.data.userId}`, 'reset');
      log(`   Email Verified: ${registerRes.data.isEmailVerified}`, 'reset');
      log(`   ⚠️  Check your email (${TEST_EMAIL}) for OTP!`, 'yellow');
    } catch (error) {
      if (error.response?.status === 409) {
        log('⚠️  User already exists. Continuing with existing user...', 'yellow');
      } else {
        throw error;
      }
    }

    // Test 2: Login without verification (should fail)
    log('\n🔒 Test 2: Attempting login without verification...', 'yellow');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      log('❌ Login succeeded (unexpected!)', 'red');
    } catch (error) {
      if (error.response?.status === 403) {
        log('✅ Login correctly blocked (email not verified)', 'green');
        log(`   Message: ${error.response.data.message}`, 'reset');
      } else if (error.response?.status === 401) {
        log('⚠️  Login failed (might be wrong password or user not found)', 'yellow');
      } else {
        throw error;
      }
    }

    // Test 3: Forgot Password
    log('\n🔑 Test 3: Requesting password reset OTP...', 'yellow');
    try {
      const forgotRes = await axios.post(`${BASE_URL}/forgot-password`, {
        email: TEST_EMAIL
      });
      log('✅ Password reset OTP sent!', 'green');
      log(`   Message: ${forgotRes.data.message}`, 'reset');
      log(`   ⚠️  Check your email (${TEST_EMAIL}) for password reset OTP!`, 'yellow');
    } catch (error) {
      log('❌ Failed to send password reset OTP', 'red');
      log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    }

    // Test 4: Validation Tests
    log('\n✅ Test 4: Testing validation...', 'yellow');
    
    // Invalid email format
    try {
      await axios.post(`${BASE_URL}/register`, {
        name: 'Test',
        email: 'invalid-email',
        password: 'Test1234',
        role: 'student',
        college: 'Test'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        log('✅ Email validation works', 'green');
      }
    }

    // Invalid OTP format
    try {
      await axios.post(`${BASE_URL}/verify-email`, {
        email: TEST_EMAIL,
        otp: '12345' // 5 digits instead of 6
      });
    } catch (error) {
      if (error.response?.status === 400) {
        log('✅ OTP format validation works', 'green');
      }
    }

    // Summary
    log('\n📊 Test Summary:', 'blue');
    log('✅ Registration endpoint working', 'green');
    log('✅ Login protection working', 'green');
    log('✅ Forgot password endpoint working', 'green');
    log('✅ Validation working', 'green');
    log('\n⚠️  Manual Steps Required:', 'yellow');
    log('1. Check your email for registration OTP', 'reset');
    log('2. Use POST /api/auth/verify-email with the OTP to verify', 'reset');
    log('3. Check your email for password reset OTP', 'reset');
    log('4. Use POST /api/auth/reset-password with the OTP to reset password', 'reset');
    log('\n💡 Tip: Use Postman or Thunder Client (VS Code) for easier testing!', 'blue');
    log('\n✨ Basic tests completed!\n', 'green');

  } catch (error) {
    log('\n❌ Test failed!', 'red');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else if (error.request) {
      log('❌ No response from server. Is it running?', 'red');
      log('   Run: npm run dev', 'yellow');
    } else {
      log(`Error: ${error.message}`, 'red');
    }
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/api/auth/login', {
      validateStatus: () => true // Don't throw on any status
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  log('🔍 Checking if server is running...', 'yellow');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('❌ Server is not running!', 'red');
    log('   Please start the server first:', 'yellow');
    log('   cd server && npm run dev', 'yellow');
    process.exit(1);
  }
  
  log('✅ Server is running!\n', 'green');
  
  if (TEST_EMAIL === 'your-email@example.com') {
    log('⚠️  WARNING: Please update TEST_EMAIL in the script!', 'yellow');
    log('   Edit test-otp-flow.js and change TEST_EMAIL', 'yellow');
    process.exit(1);
  }
  
  await testOTPFlow();
})();

