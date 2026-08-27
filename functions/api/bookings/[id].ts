// Cloudflare Pages Function: /api/bookings/[id]
interface Env {
  DB?: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      await context.env.DB.prepare(
        "UPDATE bookings SET status = ? WHERE id = ?"
      ).bind(body.status, id).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};
