// Cloudflare Pages Function: /api/favorites
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (context.env?.DB) {
    const { results } = await context.env.DB.prepare("SELECT listing_id FROM favorites WHERE user_id = 1").all();
    return Response.json(results.map((r: any) => r.listing_id));
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      await context.env.DB.prepare(
        "INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (1, ?)"
      ).bind(body.listingId).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const listingId = url.searchParams.get("listingId");
    if (context.env?.DB && listingId) {
      await context.env.DB.prepare(
        "DELETE FROM favorites WHERE user_id = 1 AND listing_id = ?"
      ).bind(listingId).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};
