// Node script to test the credentials and OTP authentication flow against the local dev server
import { createHash } from "crypto";

const API_BASE = "http://localhost:5173/api";

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

async function runTest() {
  console.log("=== STARTING AUTHENTICATION FLOW TEST ===");
  const testEmail = `test_mnc_${Date.now()}@example.com`;
  const testUsername = `user_mnc_${Date.now()}`;
  const testPassword = "password123";

  try {
    // 1. Test Register
    console.log(`\n1. Registering user: ${testUsername} (${testEmail})...`);
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: testPassword
      })
    });
    
    if (!registerRes.ok) {
      const err = await registerRes.json();
      throw new Error(`Register failed: ${JSON.stringify(err)}`);
    }
    
    const registerData = await registerRes.json();
    console.log("Register response:", registerData);
    const otp = registerData.otp;
    
    if (!otp) {
      throw new Error("No OTP returned in response! Verify that mock D1 execution is running.");
    }
    console.log(`Generated OTP code: ${otp}`);

    // 2. Test Verification
    console.log(`\n2. Verifying OTP code ${otp} for ${testEmail}...`);
    const verifyRes = await fetch(`${API_BASE}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        code: otp
      })
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.json();
      throw new Error(`Verify failed: ${JSON.stringify(err)}`);
    }

    const verifyData = await verifyRes.json();
    console.log("Verify response (D1 Database Record):", verifyData);
    
    if (verifyData.email !== testEmail || verifyData.role !== "buyer") {
      throw new Error("User record verification details mismatch!");
    }
    console.log("OTP Verification succeeded! User is now activated.");

    // 3. Test Login
    console.log("\n3. Testing credentials login with registered password...");
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    if (!loginRes.ok) {
      const err = await loginRes.json();
      throw new Error(`Login failed: ${JSON.stringify(err)}`);
    }

    const loginData = await loginRes.json();
    console.log("Login response:", loginData);
    console.log("Credentials Login succeeded!");

    console.log("\n=== AUTHENTICATION FLOW TEST PASSED SUCCESSFULLY ===");
  } catch (err) {
    console.error("\n=== AUTHENTICATION FLOW TEST FAILED ===");
    console.error(err.message);
    process.exit(1);
  }
}

runTest();
