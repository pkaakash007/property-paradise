// Cloudflare Pages Function: /api/leads
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (context.env?.DB) {
    const { results } = await context.env.DB.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
    return Response.json(results);
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      await context.env.DB.prepare(
        `INSERT INTO leads (name, phone, email, message, preferred_date, preferred_time, listing_id, source, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        body.name,
        body.phone,
        body.email || "",
        body.message || "",
        body.preferredDate || "",
        body.preferredTime || "",
        body.listingId || null,
        body.source || "property_enquiry",
        "new"
      ).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true, message: "Lead recorded" });
};
