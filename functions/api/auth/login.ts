// Cloudflare Pages Function: /api/auth/login
interface Env {
  DB?: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ email: string; password?: string }>();
    const { email } = body;

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (context.env?.DB) {
      const db = context.env.DB;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await db
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first<Record<string, unknown>>();

      if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      });
    }

    // Fallback mock when DB is not bound (local dev without wrangler)
    const mockRole =
      email.toLowerCase() === "admin@propertyparadise.com" ? "admin" : "buyer";
    return Response.json({
      id: 9999,
      name: "Developer Guest",
      email: email,
      role: mockRole,
      createdAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};
