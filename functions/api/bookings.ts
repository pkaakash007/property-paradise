// Cloudflare Pages Function: /api/bookings
interface Env {
  DB?: D1Database;
}

async function getUserIdByEmail(db: D1Database, email: string | null): Promise<number | null> {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();
  const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(normalizedEmail).first<any>();
  return user ? user.id : null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (context.env?.DB) {
    const { results } = await context.env.DB.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
    return Response.json(results);
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      const email = body.email || context.request.headers.get("X-User-Email") || "";
      const userId = await getUserIdByEmail(context.env.DB, email);
      await context.env.DB.prepare(
        `INSERT INTO bookings (property_id, user_id, name, phone, email, scheduled_at, preferred_time, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        body.listingId,
        userId,
        body.name,
        body.phone,
        email,
        body.scheduledAt || new Date().toISOString(),
        body.preferredTime || "10:00 AM",
        body.notes || "",
        "pending"
      ).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true, message: "Booking confirmed" });
};
