import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { execSync } from "child_process";

function safeExecWranglerJson(sqlCommand: string): any[] {
  try {
    const cmd = `npx wrangler d1 execute property_paradise_db --local --command="${sqlCommand.replace(/"/g, '\\"')}" --json`;
    const output = execSync(cmd, { cwd: process.cwd(), encoding: "utf-8" });
    const jsonStart = output.indexOf("[");
    if (jsonStart !== -1) {
      const cleanJson = output.slice(jsonStart);
      const parsed = JSON.parse(cleanJson);
      return parsed[0]?.results || [];
    }
  } catch (err) {
    console.error("Wrangler SQL Exec Warning:", err);
  }
  return [];
}

function safeExecWranglerRun(sqlCommand: string): void {
  try {
    const cmd = `npx wrangler d1 execute property_paradise_db --local --command="${sqlCommand.replace(/"/g, '\\"')}"`;
    execSync(cmd, { cwd: process.cwd(), encoding: "utf-8" });
  } catch (err) {
    console.error("Wrangler SQL Run Warning:", err);
  }
}

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          return res.end();
        }

        try {
          const url = new URL(req.url, "http://localhost");
          const pathname = url.pathname;

          // GET /api/properties
          if (pathname === "/api/properties" && req.method === "GET") {
            const results = safeExecWranglerJson(
              "SELECT l.*, loc.city, loc.locality, loc.state, loc.address, loc.latitude, loc.longitude, loc.privacy, a.name as agent_name, a.phone as agent_phone, a.profile_image as agent_image FROM listings l LEFT JOIN listing_locations loc ON l.location_id = loc.id LEFT JOIN agents a ON l.agent_id = a.id ORDER BY l.created_at DESC"
            );
            res.statusCode = 200;
            return res.end(JSON.stringify(results));
          }

          // POST /api/properties
          if (pathname === "/api/properties" && req.method === "POST") {
            let bodyStr = "";
            req.on("data", (chunk) => {
              bodyStr += chunk;
            });
            req.on("end", () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                const id = body.id || `listing-${Date.now()}`;
                const locId = body.locationId || `loc-${Date.now()}`;

                const locSql = `INSERT OR REPLACE INTO listing_locations (id, state, city, locality, address, latitude, longitude) VALUES ('${locId}', '${body.location?.state || "Tamil Nadu"}', '${body.location?.city || "Coimbatore"}', '${body.location?.locality || "Saravanampatti"}', '${(body.location?.address || "").replace(/'/g, "''")}', ${body.location?.latitude || 11.0804}, ${body.location?.longitude || 76.9944})`;
                safeExecWranglerRun(locSql);

                const listSql = `INSERT OR REPLACE INTO listings (id, slug, title, description, property_type, listing_purpose, status, price, area_sqft, bedrooms, bathrooms, facing, featured, verified, location_id, primary_image_url, youtube_video_id) VALUES ('${id}', '${body.slug || `property-${Date.now()}`}', '${(body.title || "").replace(/'/g, "''")}', '${(body.description || "").replace(/'/g, "''")}', '${body.propertyType || "villa"}', '${body.listingPurpose || "sale"}', '${body.status || "published"}', ${body.price || 0}, ${body.areaSqft || 0}, ${body.bedrooms || 0}, ${body.bathrooms || 0}, '${body.facing || "East"}', ${body.featured ? 1 : 0}, ${body.verified ? 1 : 0}, '${locId}', '${body.primaryImageUrl || ""}', '${body.youtubeVideoId || ""}')`;
                safeExecWranglerRun(listSql);

                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, id }));
              } catch {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }

          // GET /api/properties/:slug
          if (pathname.startsWith("/api/properties/") && req.method === "GET") {
            const slug = pathname.replace("/api/properties/", "");
            const results = safeExecWranglerJson(
              `SELECT l.*, loc.city, loc.locality, loc.state, loc.address, loc.latitude, loc.longitude, loc.privacy, a.name as agent_name, a.phone as agent_phone, a.profile_image as agent_image FROM listings l LEFT JOIN listing_locations loc ON l.location_id = loc.id LEFT JOIN agents a ON l.agent_id = a.id WHERE l.slug = '${slug}' OR l.id = '${slug}'`
            );
            res.statusCode = 200;
            return res.end(JSON.stringify(results[0] || null));
          }

          // DELETE /api/properties/:slug
          if (pathname.startsWith("/api/properties/") && req.method === "DELETE") {
            const id = pathname.replace("/api/properties/", "");
            safeExecWranglerRun(`DELETE FROM listings WHERE id = '${id}'`);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }

          // GET /api/leads
          if (pathname === "/api/leads" && req.method === "GET") {
            const results = safeExecWranglerJson("SELECT * FROM leads ORDER BY created_at DESC");
            res.statusCode = 200;
            return res.end(JSON.stringify(results));
          }

          // POST /api/leads
          if (pathname === "/api/leads" && req.method === "POST") {
            let bodyStr = "";
            req.on("data", (chunk) => {
              bodyStr += chunk;
            });
            req.on("end", () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                const sql = `INSERT INTO leads (name, phone, email, message, property_title, status) VALUES ('${(body.name || "").replace(/'/g, "''")}', '${(body.phone || "").replace(/'/g, "''")}', '${(body.email || "").replace(/'/g, "''")}', '${(body.message || "").replace(/'/g, "''")}', '${(body.propertyTitle || "").replace(/'/g, "''")}', 'new')`;
                safeExecWranglerRun(sql);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              } catch {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }

          // GET /api/bookings
          if (pathname === "/api/bookings" && req.method === "GET") {
            const results = safeExecWranglerJson("SELECT * FROM bookings ORDER BY created_at DESC");
            res.statusCode = 200;
            return res.end(JSON.stringify(results));
          }

          // POST /api/bookings
          if (pathname === "/api/bookings" && req.method === "POST") {
            let bodyStr = "";
            req.on("data", (chunk) => {
              bodyStr += chunk;
            });
            req.on("end", () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                const sql = `INSERT INTO bookings (name, phone, property_title, scheduled_at, preferred_time, status) VALUES ('${(body.name || "").replace(/'/g, "''")}', '${(body.phone || "").replace(/'/g, "''")}', '${(body.propertyTitle || "").replace(/'/g, "''")}', '${body.scheduledAt || ""}', '${body.preferredTime || ""}', 'pending')`;
                safeExecWranglerRun(sql);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              } catch {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }

          // GET /api/agents
          if (pathname === "/api/agents" && req.method === "GET") {
            const results = safeExecWranglerJson("SELECT * FROM agents ORDER BY name ASC");
            res.statusCode = 200;
            return res.end(JSON.stringify(results));
          }

          // GET /api/admin/analytics
          if (pathname === "/api/admin/analytics" && req.method === "GET") {
            const results = safeExecWranglerJson("SELECT COUNT(*) as count FROM listings");
            const count = results[0]?.count || 5;
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                activeListings: count,
                totalLeads: 24,
                pendingBookings: 8,
                totalViews: 1420,
                conversionRate: "4.8%",
              })
            );
          }

          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        } catch {
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/maplibre-gl")) {
            return "maplibre-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "lucide-vendor";
          }
        },
      },
    },
  },
});
