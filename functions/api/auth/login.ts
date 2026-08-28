// Cloudflare Pages Function: /api/auth/login
interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
}

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
    const body = await context.request.json<{ email: string; password?: string }>();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (context.env?.DB) {
      const db = context.env.DB;

      // 1. Get user record
      const user = await db.prepare("SELECT * FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<any>();

      if (!user || !user.password_hash) {
        return Response.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // 2. Validate password hash
      const inputHash = await hashPassword(password);
      if (user.password_hash !== inputHash) {
        return Response.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // 3. If unverified, block login and trigger fresh OTP code
      if (user.is_verified === 0) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000;

        await db.prepare("INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)")
          .bind(normalizedEmail, code, expiresAt)
          .run();

        // Check Resend keys
        let emailSent = false;
        const resendApiKey = context.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                from: "Property Paradise <noreply@resend.dev>",
                to: normalizedEmail,
                subject: "Verify your email - Property Paradise",
                html: `<p>Your verification code is: <strong>${code}</strong></p>`
              })
            });
            emailSent = true;
          } catch {}
        }

        return Response.json({ 
          error: "Your account is not verified yet. Verification code sent.", 
          unverified: true,
          email: normalizedEmail,
          otp: emailSent ? null : code 
        }, { status: 403 });
      }

      // 4. Return user profile
      return Response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      });
    }

    // Mock Login
    if (password === "password" || password === "••••••••") {
      const mockRole = normalizedEmail === "admin@propertyparadise.com" ? "admin" : "buyer";
      return Response.json({
        id: 9999,
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: mockRole,
        createdAt: new Date().toISOString()
      });
    }

    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
