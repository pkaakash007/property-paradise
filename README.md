# Property Paradise

React + TypeScript + Tailwind frontend, deployed on Cloudflare Pages, backed by Cloudflare D1 (no separate backend server — Pages Functions handle DB reads/writes at the edge).

## Structure
```
src/
  pages/        one folder per screen (Home, Search, PropertyDetails, AddListing, Bookings, Filters, UserProfile, Leads, UserManagement, MapSearch)
  components/   layout/ ui/ property/
  lib/api.ts    fetch helpers calling /api/* (Pages Functions)
  types/        shared TS types
functions/api/  Cloudflare Pages Functions — query D1 directly (this is your "backend")
db/migrations/  D1 schema (0001_init.sql)
wrangler.toml   Pages + D1 binding config
```

Original Stitch screen designs (HTML) are in `/mnt/user-data/uploads/...` — port markup/styling into the matching `src/pages/<Name>/index.tsx` files as you go.

## Setup
```bash
npm install
npm run dev
```

## Cloudflare D1 + Pages deploy
```bash
npx wrangler login
npx wrangler d1 create property_paradise_db      # copy the returned database_id into wrangler.toml
npx wrangler d1 execute property_paradise_db --file=db/migrations/0001_init.sql

npm run build
npx wrangler pages deploy dist
```
Bind the same D1 database to the Pages project in the Cloudflare dashboard (Settings → Functions → D1 bindings), binding name `DB`, so `functions/api/*.ts` can access it in production too.
