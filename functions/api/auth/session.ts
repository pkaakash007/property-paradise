// Cloudflare Pages Function: /api/auth/session
interface Env {
  DB?: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ email: string; name?: string }>();
    const { email, name } = body;

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (context.env?.DB) {
      const db = context.env.DB;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if user exists in the DB
      let user = await db.prepare("SELECT * FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<any>();

      if (!user) {
        // If not found, insert new user
        // Default role is 'buyer' for everyone except the mock developer admin email
        const defaultRole = normalizedEmail === "admin@propertyparadise.com" ? "admin" : "buyer";
        
        await db.prepare(
          "INSERT INTO users (name, email, role) VALUES (?, ?, ?)"
        ).bind(name || email.split("@")[0], normalizedEmail, defaultRole).run();

        // Retrieve the newly created user
        user = await db.prepare("SELECT * FROM users WHERE email = ?")
          .bind(normalizedEmail)
          .first<any>();
      }

      return Response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      });
    }

    // Fallback Mock Profile if DB is not bound yet in wrangler
    const mockRole = email.toLowerCase() === "admin@propertyparadise.com" ? "admin" : "buyer";
    return Response.json({
      id: 9999,
      name: name || "Developer Guest",
      email: email,
      role: mockRole,
      createdAt: new Date().toISOString()
    });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
