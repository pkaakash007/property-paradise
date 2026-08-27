-- Property Paradise Master D1 Schema & Seed Data

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'buyer',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image TEXT,
  bio TEXT,
  designation TEXT,
  experience_years INTEGER DEFAULT 5,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listing_locations (
  id TEXT PRIMARY KEY,
  country TEXT DEFAULT 'India',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  area TEXT,
  pincode TEXT,
  address TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  privacy TEXT DEFAULT 'exact',
  map_zoom INTEGER DEFAULT 15
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL, -- 'villa' | 'plot'
  listing_purpose TEXT NOT NULL, -- 'sale' | 'rent'
  status TEXT DEFAULT 'published', -- 'draft'|'published'|'featured'|'under_offer'|'sold'|'rented'
  price REAL NOT NULL,
  area_sqft REAL,
  plot_area_sqft REAL,
  builtup_area_sqft REAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  parking_spaces INTEGER,
  facing TEXT,
  furnished_status TEXT,
  featured INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 1,
  agent_id TEXT REFERENCES agents(id),
  location_id TEXT REFERENCES listing_locations(id),
  primary_image_url TEXT,
  youtube_video_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listing_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id TEXT REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  listing_id TEXT REFERENCES listings(id),
  source TEXT DEFAULT 'property_enquiry',
  status TEXT DEFAULT 'new', -- 'new'|'contacted'|'qualified'|'site_visit'|'converted'|'lost'|'closed'
  assigned_agent_id TEXT REFERENCES agents(id),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id TEXT REFERENCES listings(id),
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  scheduled_at TEXT NOT NULL,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending'|'confirmed'|'rescheduled'|'completed'| me'cancelled'
  assigned_agent_id TEXT REFERENCES agents(id),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  listing_id TEXT REFERENCES listings(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  listing_id TEXT,
  location TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  admin_user_id INTEGER,
  details TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Seed Agents
INSERT OR IGNORE INTO agents (id, name, slug, phone, email, profile_image, bio, designation, experience_years)
VALUES
('agent-1', 'Rajesh K. Varma', 'rajesh-varma', '+91 98422 12345', 'rajesh@propertyparadise.com', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 'Senior Luxury Real Estate Consultant with over 12 years of experience in South India luxury villas and land acquisitions.', 'Principal Advisor', 12),
('agent-2', 'Ananya Sundaram', 'ananya-sundaram', '+91 98944 67890', 'ananya@propertyparadise.com', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Specialist in private hill villas, gated estates, and prime residential plots across Ooty and Coimbatore.', 'Luxury Estate Agent', 8);

-- Seed Locations (All inside Tamil Nadu)
INSERT OR REPLACE INTO listing_locations (id, state, city, locality, area, pincode, address, latitude, longitude, privacy)
VALUES
('loc-1', 'Tamil Nadu', 'Coimbatore', 'Saravanampatti', 'IT Corridor', '641035', '124 Luxury Villa Avenue, Saravanampatti, Coimbatore', 11.0804, 76.9944, 'exact'),
('loc-2', 'Tamil Nadu', 'Coimbatore', 'Pollachi Road', 'Echanari', '641021', 'Plot 45, Green Enclave, Pollachi Road, Coimbatore', 10.9234, 76.9741, 'exact'),
('loc-3', 'Tamil Nadu', 'Ooty', 'Fern Hill', 'Fern Hill Estate', '643004', 'Pine Crest Manor, Fern Hill, Ooty', 11.3984, 76.6946, 'exact'),
('loc-4', 'Tamil Nadu', 'Chennai', 'ECR (East Coast Road)', 'Neelankarai', '600115', '45 Beachside Boulevard, ECR Neelankarai, Chennai', 12.9485, 80.2541, 'exact'),
('loc-5', 'Tamil Nadu', 'Coimbatore', 'Race Course', 'Race Course Road', '641018', '88 Royal Enclave, Race Course Road, Coimbatore', 11.0016, 76.9744, 'exact');

-- Seed Listings (All inside Tamil Nadu)
INSERT OR REPLACE INTO listings (id, slug, title, description, property_type, listing_purpose, status, price, area_sqft, plot_area_sqft, builtup_area_sqft, bedrooms, bathrooms, floors, parking_spaces, facing, furnished_status, featured, verified, agent_id, location_id, primary_image_url, youtube_video_id)
VALUES
('listing-1', 'contemporary-4-bhk-luxury-villa-saravanampatti', 'Contemporary 4 BHK Luxury Villa', 'Architect-designed triplex villa with private lap pool, landscaped Italian terrace garden, Italian marble flooring, and smart home automation located in the prime IT hub of Saravanampatti.', 'villa', 'sale', 'featured', 12500000, 3800, 3200, 3800, 4, 4, 3, 2, 'East', 'Fully Furnished', 1, 1, 'agent-1', 'loc-1', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'dQw4w9WgXcQ'),
('listing-2', 'premium-corner-plot-pollachi-road', 'Premium Corner Residential Plot', 'DTCP and RERA approved prime corner plot inside a secure gated community with 40ft wide blacktop roads, underground cabling, and lush park facing orientation.', 'plot', 'sale', 'published', 7800000, 2400, 2400, 0, 0, 0, 0, 0, 'East-North', 'Unfurnished', 1, 1, 'agent-1', 'loc-2', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', NULL),
('listing-3', 'colonial-style-hilltop-mansion-ooty', 'Colonial Style Hilltop Mansion', 'Surrounded by tea plantations with panoramic Nilgiri views, double-height living spaces, wood fireplace, glass sunroom, and private orchard.', 'villa', 'sale', 'featured', 28500000, 5200, 18000, 5200, 5, 6, 2, 4, 'South-East', 'Fully Furnished', 1, 1, 'agent-2', 'loc-3', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'dQw4w9WgXcQ'),
('listing-4', 'oceanfront-luxury-villa-ecr-chennai', 'Oceanfront Luxury Villa on ECR', 'Exclusive direct beach-access modern estate with infinity pool, private elevator, home theatre room, and rooftop party deck.', 'villa', 'rent', 'published', 250000, 6500, 5000, 6500, 5, 6, 3, 3, 'East', 'Semi-Furnished', 1, 1, 'agent-1', 'loc-4', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', NULL),
('listing-5', 'exclusive-race-course-gated-plot', 'Exclusive Race Course Gated Plot', 'Rare north-facing DTCP approved clear title plot in Coimbatore''s most prestigious Race Course neighborhood. Ready for immediate luxury villa construction.', 'plot', 'sale', 'featured', 45000000, 4800, 4800, 0, 0, 0, 0, 0, 'North', 'Unfurnished', 1, 1, 'agent-2', 'loc-5', 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80', NULL);

-- Seed Images
INSERT OR IGNORE INTO listing_images (listing_id, url, alt, sort_order, is_primary)
VALUES
('listing-1', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'Villa Exterior', 1, 1),
('listing-1', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Living Room', 2, 0),
('listing-1', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'Master Bedroom', 3, 0),
('listing-2', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 'Plot View', 1, 1),
('listing-3', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'Mansion Exterior', 1, 1),
('listing-4', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'Oceanfront Villa', 1, 1),
('listing-5', 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80', 'Race Course Plot', 1, 1);
