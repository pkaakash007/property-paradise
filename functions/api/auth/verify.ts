// Cloudflare Pages Function: /api/auth/verify
interface Env {
  DB?: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ email: string; code: string }>();
    const { email, code } = body;

    if (!email || !code) {
      return Response.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (context.env?.DB) {
      const db = context.env.DB;
      const now = Date.now();

      // 1. Check if OTP matches and is not expired
      const otpRecord = await db.prepare(
        "SELECT * FROM otps WHERE email = ? AND code = ? AND expires_at > ? ORDER BY id DESC"
      ).bind(normalizedEmail, code.trim(), now).first<any>();

      if (!otpRecord) {
        return Response.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      // 2. Mark user as verified
      await db.prepare("UPDATE users SET is_verified = 1 WHERE email = ?")
        .bind(normalizedEmail)
        .run();

      // Retrieve full user record
      const user = await db.prepare("SELECT * FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<any>();

      // 3. Clear used OTP records
      await db.prepare("DELETE FROM otps WHERE email = ?").bind(normalizedEmail).run();

      return Response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      });
    }

    // Mock response
    if (code === "123456") {
      return Response.json({
        id: 9999,
        name: "Developer Guest",
        email: normalizedEmail,
        role: "buyer",
        createdAt: new Date().toISOString()
      });
    }

    return Response.json({ error: "Invalid code" }, { status: 400 });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
