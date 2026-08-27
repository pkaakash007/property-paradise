// Cloudflare Pages Function: /api/properties/[slug]
interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const slug = context.params.slug as string;
    if (context.env?.DB) {
      const listing = await context.env.DB.prepare(`
        SELECT l.*, loc.city, loc.locality, loc.state, loc.address, loc.latitude, loc.longitude, loc.privacy,
               a.name as agent_name, a.phone as agent_phone, a.profile_image as agent_image, a.bio as agent_bio, a.designation as agent_designation
        FROM listings l
        LEFT JOIN listing_locations loc ON l.location_id = loc.id
        LEFT JOIN agents a ON l.agent_id = a.id
        WHERE l.slug = ? OR l.id = ?
      `).bind(slug, slug).first<any>();

      if (listing) {
        // Query images
        const { results: images } = await context.env.DB.prepare(
          "SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC"
        ).bind(listing.id).all();

        listing.images = images && images.length > 0 ? images : [{ url: listing.primary_image_url, is_primary: 1 }];
        listing.location = {
          id: listing.location_id,
          state: listing.state,
          city: listing.city,
          locality: listing.locality,
          address: listing.address,
          latitude: listing.latitude,
          longitude: listing.longitude,
          privacy: listing.privacy
        };
        listing.agent = {
          id: listing.agent_id,
          name: listing.agent_name,
          phone: listing.agent_phone,
          profileImage: listing.agent_image,
          bio: listing.agent_bio,
          designation: listing.agent_designation
        };

        // Convert db underscore fields to camelCase
        listing.propertyType = listing.property_type;
        listing.listingPurpose = listing.listing_purpose;
        listing.areaSqft = listing.area_sqft;
        listing.primaryImageUrl = listing.primary_image_url;
        listing.youtubeVideoId = listing.youtube_video_id;

        return Response.json(listing);
      }
    }
  } catch (err: any) {
    console.error("D1 Error:", err);
  }
  return Response.json(null, { status: 404 });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.slug as string;
    if (context.env?.DB) {
      await context.env.DB.prepare("DELETE FROM listings WHERE id = ?").bind(id).run();
      return Response.json({ success: true });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
  return Response.json({ success: true });
};
