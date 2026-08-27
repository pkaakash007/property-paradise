// Cloudflare Pages Function: /api/agents
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (context.env?.DB) {
    const { results } = await context.env.DB.prepare("SELECT * FROM agents ORDER BY name ASC").all();
    return Response.json(results);
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      const id = body.id || `agent-${Date.now()}`;
      await context.env.DB.prepare(
        `INSERT INTO agents (id, name, slug, phone, email, profile_image, bio, designation, experience_years)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        body.name,
        body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        body.phone,
        body.email,
        body.profileImage || "",
        body.bio || "",
        body.designation || "Luxury Advisor",
        body.experienceYears || 5
      ).run();
      return Response.json({ success: true, id });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};
