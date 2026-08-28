// Cloudflare Pages Function: /api/favorites
interface Env {
  DB?: D1Database;
}

async function getUserIdByEmail(db: D1Database, email: string | null): Promise<number> {
  if (!email) return 1; // Fallback to user_id = 1 for guest sessions
  const normalizedEmail = email.toLowerCase().trim();
  const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(normalizedEmail).first<any>();
  return user ? user.id : 1;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (context.env?.DB) {
    const email = context.request.headers.get("X-User-Email");
    const userId = await getUserIdByEmail(context.env.DB, email);
    const { results } = await context.env.DB.prepare("SELECT listing_id FROM favorites WHERE user_id = ?").bind(userId).all();
    return Response.json(results.map((r: any) => r.listing_id));
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      const email = context.request.headers.get("X-User-Email");
      const userId = await getUserIdByEmail(context.env.DB, email);
      await context.env.DB.prepare(
        "INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)"
      ).bind(userId, body.listingId).run();
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
      const email = context.request.headers.get("X-User-Email");
      const userId = await getUserIdByEmail(context.env.DB, email);
      await context.env.DB.prepare(
        "DELETE FROM favorites WHERE user_id = ? AND listing_id = ?"
      ).bind(userId, listingId).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};
