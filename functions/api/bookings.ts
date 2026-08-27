// Cloudflare Pages Function: /api/bookings
interface Env {
  DB?: D1Database;
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
      await context.env.DB.prepare(
        `INSERT INTO bookings (property_id, name, phone, email, scheduled_at, preferred_time, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        body.listingId,
        body.name,
        body.phone,
        body.email || "",
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
