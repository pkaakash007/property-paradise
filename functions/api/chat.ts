// Cloudflare Pages Function: /api/chat
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const userEmail = url.searchParams.get("user_email");
    const mode = url.searchParams.get("mode");

    if (context.env?.DB) {
      if (mode === "threads") {
        // Fetch unique threads for the admin dashboard view
        const query = `
          SELECT 
            m.sender_email, 
            m.sender_name, 
            MAX(m.created_at) as last_message_at,
            (
              SELECT message 
              FROM chat_messages 
              WHERE (sender_email = m.sender_email AND receiver_email = 'admin') 
                 OR (sender_email = 'admin' AND receiver_email = m.sender_email)
              ORDER BY created_at DESC 
              LIMIT 1
            ) as last_message
          FROM chat_messages m
          WHERE m.sender_email != 'admin'
          GROUP BY m.sender_email, m.sender_name
          ORDER BY last_message_at DESC
        `;
        const { results } = await context.env.DB.prepare(query).all();
        return Response.json(results);
      }

      if (userEmail) {
        // Fetch messages for a specific conversation thread
        const query = `
          SELECT * FROM chat_messages
          WHERE (sender_email = ? AND receiver_email = ?)
             OR (sender_email = ? AND receiver_email = ?)
          ORDER BY created_at ASC
        `;
        const { results } = await context.env.DB.prepare(query)
          .bind(userEmail, "admin", "admin", userEmail)
          .all();
        return Response.json(results);
      }

      // Fallback: Fetch all messages
      const { results } = await context.env.DB.prepare("SELECT * FROM chat_messages ORDER BY created_at ASC").all();
      return Response.json(results);
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json([]);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      await context.env.DB.prepare(
        `INSERT INTO chat_messages (sender_email, sender_name, receiver_email, message)
         VALUES (?, ?, ?, ?)`
      ).bind(
        body.senderEmail,
        body.senderName || "Guest User",
        body.receiverEmail || "admin",
        body.message
      ).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: false });
};
