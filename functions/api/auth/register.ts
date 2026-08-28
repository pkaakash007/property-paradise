// Cloudflare Pages Function: /api/auth/register
interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
}

// Subtle crypto SHA-256 hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ username: string; email: string; password?: string }>();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return Response.json({ error: "Username, email, and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    if (context.env?.DB) {
      const db = context.env.DB;

      // 1. Check if user already exists and is verified
      const existingUser = await db.prepare("SELECT * FROM users WHERE email = ? OR username = ?")
        .bind(normalizedEmail, normalizedUsername)
        .first<any>();

      if (existingUser && existingUser.is_verified === 1) {
        return Response.json({ error: "Username or Email is already registered" }, { status: 400 });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // 2. Insert or update unverified user
      if (existingUser) {
        // If unverified, update details
        await db.prepare(
          "UPDATE users SET name = ?, username = ?, password_hash = ? WHERE id = ?"
        ).bind(username, normalizedUsername, passwordHash, existingUser.id).run();
      } else {
        // Create new unverified user
        await db.prepare(
          "INSERT INTO users (name, username, email, password_hash, is_verified) VALUES (?, ?, ?, ?, 0)"
        ).bind(username, normalizedUsername, normalizedEmail, passwordHash).run();
      }

      // 3. Generate 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins validity

      // Insert OTP into D1
      await db.prepare("INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)")
        .bind(normalizedEmail, code, expiresAt)
        .run();

      // 4. Send Email using Resend if key exists
      let emailSent = false;
      const resendApiKey = context.env.RESEND_API_KEY;

      if (resendApiKey) {
        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: "Property Paradise <noreply@resend.dev>", // Or custom sender if domain verified
              to: normalizedEmail,
              subject: "Your Verification Code - Property Paradise",
              html: `
                <div style="font-family: sans-serif; padding: 24px; max-width: 600px; color: #1D1D1F;">
                  <h2 style="font-size: 20px; font-weight: bold;">Property Paradise</h2>
                  <p style="font-size: 14px; color: #8E8E93;">Please verify your luxury real estate account.</p>
                  <div style="background-color: #F5F5F7; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                    <span style="font-size: 32px; font-weight: bold; tracking-wider: 4px; letter-spacing: 4px; color: #007AFF;">${code}</span>
                  </div>
                  <p style="font-size: 12px; color: #8E8E93;">This code is valid for 15 minutes. If you did not request this code, please ignore this email.</p>
                </div>
              `
            })
          });
          if (emailRes.ok) {
            emailSent = true;
          }
        } catch (err) {
          console.error("Resend delivery failed:", err);
        }
      }

      console.log(`Generated OTP for ${normalizedEmail}: ${code}`);

      // We return the OTP in the JSON response if email fails or Resend API key is missing.
      // This ensures testing is easy without a configuration block!
      return Response.json({ 
        success: true, 
        message: "Verification code sent to email",
        otp: emailSent ? null : code 
      });
    }

    // Mock fallback
    const code = "123456";
    return Response.json({ 
      success: true, 
      message: "Mock registered. Please verify with code: 123456", 
      otp: code 
    });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
