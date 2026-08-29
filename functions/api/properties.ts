// Cloudflare Pages Function: /api/properties
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const purpose = url.searchParams.get("purpose");
    const type = url.searchParams.get("type");
    const city = url.searchParams.get("city");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const featured = url.searchParams.get("featured");
    const search = url.searchParams.get("search");

    // Bounding Box Map Search Params
    const north = url.searchParams.get("north");
    const south = url.searchParams.get("south");
    const east = url.searchParams.get("east");
    const west = url.searchParams.get("west");

    if (context.env?.DB) {
      let query = `
        SELECT l.*, loc.city, loc.locality, loc.state, loc.address, loc.latitude, loc.longitude, loc.privacy,
               a.name as agent_name, a.phone as agent_phone, a.profile_image as agent_image
        FROM listings l
        LEFT JOIN listing_locations loc ON l.location_id = loc.id
        LEFT JOIN agents a ON l.agent_id = a.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (purpose) {
        query += ` AND l.listing_purpose = ?`;
        params.push(purpose);
      }
      if (type) {
        query += ` AND l.property_type = ?`;
        params.push(type);
      }
      if (city) {
        query += ` AND loc.city LIKE ?`;
        params.push(`%${city}%`);
      }
      if (minPrice) {
        query += ` AND l.price >= ?`;
        params.push(parseFloat(minPrice));
      }
      if (maxPrice) {
        query += ` AND l.price <= ?`;
        params.push(parseFloat(maxPrice));
      }
      if (featured === "true") {
        query += ` AND l.featured = 1`;
      }
      if (search) {
        query += ` AND (l.title LIKE ? OR l.description LIKE ? OR loc.locality LIKE ? OR loc.city LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (north && south && east && west) {
        query += ` AND loc.latitude BETWEEN ? AND ? AND loc.longitude BETWEEN ? AND ?`;
        params.push(parseFloat(south), parseFloat(north), parseFloat(west), parseFloat(east));
      }

      query += ` ORDER BY l.created_at DESC`;
      const stmt = context.env.DB.prepare(query);
      const { results } = await stmt.bind(...params).all();
      return Response.json(results);
    }
  } catch (err: any) {
    console.error("D1 Query Error:", err);
  }

  // Graceful response fallback
  return Response.json({ success: true, message: "Use frontend mock fallback if D1 not bound locally" });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    if (context.env?.DB) {
      const id = body.id || `listing-${Date.now()}`;
      const locationId = body.locationId || `loc-${Date.now()}`;

      // Insert location
      if (body.location) {
        await context.env.DB.prepare(
          `INSERT INTO listing_locations (id, state, city, locality, address, latitude, longitude)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          locationId,
          body.location.state || "Tamil Nadu",
          body.location.city || "Coimbatore",
          body.location.locality || "Saravanampatti",
          body.location.address || "",
          body.location.latitude || 11.0804,
          body.location.longitude || 76.9944
        ).run();
      }

      // Insert listing
      await context.env.DB.prepare(
        `INSERT INTO listings (id, slug, title, description, property_type, listing_purpose, status, price, area_sqft, bedrooms, bathrooms, facing, featured, verified, location_id, primary_image_url, youtube_video_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        body.slug || `property-${Date.now()}`,
        body.title,
        body.description || "",
        body.propertyType || "villa",
        body.listingPurpose || "sale",
        body.status || "published",
        body.price || 0,
        body.areaSqft || 0,
        body.bedrooms || 0,
        body.bathrooms || 0,
        body.facing || "East",
        body.featured ? 1 : 0,
        body.verified ? 1 : 0,
        locationId,
        body.primaryImageUrl || "",
        body.youtubeVideoId || ""
      ).run();

      return Response.json({ success: true, id });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }

  return Response.json({ success: true });
};
