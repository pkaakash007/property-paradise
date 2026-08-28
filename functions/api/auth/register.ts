// Cloudflare Pages Function: /api/auth/register
interface Env {
  DB?: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ email: string; name?: string; password?: string }>();
    const { email, name } = body;

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (context.env?.DB) {
      const db = context.env.DB;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existing = await db
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<Record<string, unknown>>();

      if (existing) {
        return Response.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      const defaultRole =
        normalizedEmail === "admin@propertyparadise.com" ? "admin" : "buyer";

      await db
        .prepare("INSERT INTO users (name, email, role) VALUES (?, ?, ?)")
        .bind(name || email.split("@")[0], normalizedEmail, defaultRole)
        .run();

      const user = await db
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<Record<string, unknown>>();

      return Response.json(
        {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          createdAt: user?.created_at,
        },
        { status: 201 }
      );
    }

    // Fallback mock when DB is not bound (local dev without wrangler)
    const mockRole =
      email.toLowerCase() === "admin@propertyparadise.com" ? "admin" : "buyer";
    return Response.json(
      {
        id: 9999,
        name: name || "Developer Guest",
        email: email,
        role: mockRole,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};
