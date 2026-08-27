import type { Property, PropertyFilters, BoundingBox, Lead, Booking, Agent, AnalyticsSummary } from "../types/property";

const BASE = "/api";

// MNC Enterprise Request Deduplication & In-Memory Cache
const inFlightRequests = new Map<string, Promise<any>>();
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds

async function fetchWithDeduplication<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${options?.method || "GET"}:${url}`;

  // Serve fresh cache for GET requests
  if (!options?.method || options.method === "GET") {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
  }

  // Deduplicate in-flight concurrent requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!options?.method || options.method === "GET") {
        responseCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      return data as T;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

export function clearApiCache() {
  responseCache.clear();
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Rajesh K. Varma",
    slug: "rajesh-varma",
    phone: "+91 98422 12345",
    email: "rajesh@propertyparadise.com",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Senior Luxury Real Estate Consultant with over 12 years of experience in South India luxury villas and land acquisitions.",
    designation: "Principal Advisor",
    experienceYears: 12,
    status: "active"
  },
  {
    id: "agent-2",
    name: "Ananya Sundaram",
    slug: "ananya-sundaram",
    phone: "+91 98944 67890",
    email: "ananya@propertyparadise.com",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Specialist in private hill villas, gated estates, and prime residential plots across Ooty and Coimbatore.",
    designation: "Luxury Estate Agent",
    experienceYears: 8,
    status: "active"
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "listing-1",
    slug: "contemporary-4-bhk-luxury-villa-saravanampatti",
    title: "Contemporary 4 BHK Luxury Villa",
    description: "Architect-designed triplex villa with private lap pool, landscaped Italian terrace garden, Italian marble flooring, and smart home automation located in the prime IT hub of Saravanampatti.",
    propertyType: "villa",
    listingPurpose: "sale",
    status: "published",
    price: 12500000,
    areaSqft: 3800,
    plotAreaSqft: 3200,
    builtupAreaSqft: 3800,
    bedrooms: 4,
    bathrooms: 4,
    floors: 3,
    parkingSpaces: 2,
    facing: "East",
    furnishedStatus: "Fully Furnished",
    featured: true,
    verified: true,
    agentId: "agent-1",
    agent: MOCK_AGENTS[0],
    locationId: "loc-1",
    location: {
      id: "loc-1",
      state: "Tamil Nadu",
      city: "Coimbatore",
      locality: "Saravanampatti",
      area: "IT Corridor",
      pincode: "641035",
      address: "124 Luxury Villa Avenue, Saravanampatti, Coimbatore",
      latitude: 11.0804,
      longitude: 76.9944,
      privacy: "exact",
      mapZoom: 15
    },
    primaryImageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", alt: "Villa Exterior", isPrimary: true },
      { id: 2, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Living Room" },
      { id: 3, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", alt: "Master Bedroom" },
      { id: 4, url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", alt: "Private Pool" }
    ],
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2026-08-20T10:00:00Z"
  },
  {
    id: "listing-2",
    slug: "premium-corner-plot-pollachi-road",
    title: "Premium Corner Residential Plot",
    description: "DTCP and RERA approved prime corner plot inside a secure gated community with 40ft wide blacktop roads, underground cabling, and lush park facing orientation.",
    propertyType: "plot",
    listingPurpose: "sale",
    status: "published",
    price: 7800000,
    areaSqft: 2400,
    plotAreaSqft: 2400,
    facing: "East-North",
    furnishedStatus: "Unfurnished",
    featured: false,
    verified: true,
    agentId: "agent-1",
    agent: MOCK_AGENTS[0],
    locationId: "loc-2",
    location: {
      id: "loc-2",
      state: "Tamil Nadu",
      city: "Coimbatore",
      locality: "Pollachi Road",
      area: "Echanari",
      pincode: "641021",
      address: "Plot 45, Green Enclave, Pollachi Road, Coimbatore",
      latitude: 10.9234,
      longitude: 76.9741,
      privacy: "exact",
      mapZoom: 15
    },
    primaryImageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", alt: "Plot Aerial View", isPrimary: true }
    ],
    createdAt: "2026-08-22T14:30:00Z"
  },
  {
    id: "listing-3",
    slug: "colonial-style-hilltop-mansion-ooty",
    title: "Colonial Style Hilltop Mansion",
    description: "Surrounded by tea plantations with panoramic Nilgiri mountain views, double-height living spaces, wood fireplace, glass sunroom, and private orchard.",
    propertyType: "villa",
    listingPurpose: "sale",
    status: "published",
    price: 28500000,
    areaSqft: 5200,
    plotAreaSqft: 18000,
    builtupAreaSqft: 5200,
    bedrooms: 5,
    bathrooms: 6,
    floors: 2,
    parkingSpaces: 4,
    facing: "South-East",
    furnishedStatus: "Fully Furnished",
    featured: true,
    verified: true,
    agentId: "agent-2",
    agent: MOCK_AGENTS[1],
    locationId: "loc-3",
    location: {
      id: "loc-3",
      state: "Tamil Nadu",
      city: "Ooty",
      locality: "Fern Hill",
      area: "Fern Hill Estate",
      pincode: "643004",
      address: "Pine Crest Manor, Fern Hill, Ooty",
      latitude: 11.3984,
      longitude: 76.6946,
      privacy: "exact",
      mapZoom: 15
    },
    primaryImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", alt: "Mansion View", isPrimary: true },
      { id: 2, url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", alt: "Terrace View" }
    ],
    youtubeVideoId: "dQw4w9WgXcQ",
    createdAt: "2026-08-18T09:15:00Z"
  },
  {
    id: "listing-4",
    slug: "oceanfront-luxury-villa-ecr-chennai",
    title: "Oceanfront Luxury Villa on ECR",
    description: "Exclusive direct beach-access modern estate with infinity pool, private elevator, home theatre room, and rooftop party deck.",
    propertyType: "villa",
    listingPurpose: "rent",
    status: "published",
    price: 250000,
    areaSqft: 6500,
    plotAreaSqft: 5000,
    builtupAreaSqft: 6500,
    bedrooms: 5,
    bathrooms: 6,
    floors: 3,
    parkingSpaces: 3,
    facing: "East",
    furnishedStatus: "Semi-Furnished",
    featured: true,
    verified: true,
    agentId: "agent-1",
    agent: MOCK_AGENTS[0],
    locationId: "loc-4",
    location: {
      id: "loc-4",
      state: "Tamil Nadu",
      city: "Chennai",
      locality: "ECR (East Coast Road)",
      area: "Neelankarai",
      pincode: "600115",
      address: "45 Beachside Boulevard, ECR Neelankarai, Chennai",
      latitude: 12.9485,
      longitude: 80.2541,
      privacy: "exact",
      mapZoom: 15
    },
    primaryImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: "Ocean Villa Exterior", isPrimary: true }
    ],
    createdAt: "2026-08-25T11:00:00Z"
  },
  {
    id: "listing-5",
    slug: "exclusive-sadashivanagar-gated-plot",
    title: "Exclusive Sadashivanagar Gated Plot",
    description: "Rare north-facing clear title plot in Bangalore's most prestigious neighborhood. Ready for immediate villa construction.",
    propertyType: "plot",
    listingPurpose: "sale",
    status: "published",
    price: 45000000,
    areaSqft: 4800,
    plotAreaSqft: 4800,
    facing: "North",
    furnishedStatus: "Unfurnished",
    featured: true,
    verified: true,
    agentId: "agent-2",
    agent: MOCK_AGENTS[1],
    locationId: "loc-5",
    location: {
      id: "loc-5",
      state: "Karnataka",
      city: "Bangalore",
      locality: "Sadashivanagar",
      area: "North Bangalore",
      pincode: "560080",
      address: "88 Royal Palms, Sadashivanagar, Bangalore",
      latitude: 13.0068,
      longitude: 77.5813,
      privacy: "exact",
      mapZoom: 15
    },
    primaryImageUrl: "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80", alt: "Sadashivanagar Plot", isPrimary: true }
    ],
    createdAt: "2026-08-26T16:00:00Z"
  }
];

let localListingsState: Property[] = [...MOCK_PROPERTIES];
let localFavoritesState: string[] = ["listing-1"];

function mapDbListing(r: any): Property {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description || "",
    propertyType: r.property_type || r.propertyType || "villa",
    listingPurpose: r.listing_purpose || r.listingPurpose || "sale",
    status: r.status || "published",
    price: Number(r.price),
    areaSqft: r.area_sqft || r.areaSqft || 0,
    bedrooms: r.bedrooms || 0,
    bathrooms: r.bathrooms || 0,
    facing: r.facing || "East",
    featured: Boolean(r.featured),
    verified: Boolean(r.verified),
    agentId: r.agent_id || r.agentId || "agent-1",
    agent: r.agent || {
      id: r.agent_id || "agent-1",
      name: r.agent_name || "Rajesh K. Varma",
      phone: r.agent_phone || "+91 98422 12345",
      profileImage: r.agent_image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      designation: "Principal Advisor"
    },
    location: r.location || {
      id: r.location_id || "loc-1",
      state: r.state || "Tamil Nadu",
      city: r.city || "Coimbatore",
      locality: r.locality || "Saravanampatti",
      address: r.address || "Saravanampatti, Coimbatore",
      latitude: Number(r.latitude) || 11.0804,
      longitude: Number(r.longitude) || 76.9944,
      privacy: r.privacy || "exact"
    },
    primaryImageUrl: r.primary_image_url || r.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    images: r.images || [
      { id: 1, url: r.primary_image_url || r.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", isPrimary: true }
    ],
    youtubeVideoId: r.youtube_video_id || r.youtubeVideoId || "",
    createdAt: r.created_at || r.createdAt || new Date().toISOString()
  };
}

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.purpose) params.set("purpose", filters.purpose);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.city) params.set("city", filters.city);
    if (filters?.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.set("maxPrice", filters.maxPrice.toString());

    const data = await fetchWithDeduplication<any[]>(`${BASE}/properties?${params.toString()}`);
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapDbListing);
    }
  } catch {
    // Fallback
  }

  return localListingsState.filter((p) => {
    if (filters?.purpose && p.listingPurpose !== filters.purpose) return false;
    if (filters?.type && p.propertyType !== filters.type) return false;
    if (filters?.city && p.location?.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters?.minPrice && p.price < filters.minPrice) return false;
    if (filters?.maxPrice && p.price > filters.maxPrice) return false;
    if (filters?.bedrooms && (p.bedrooms || 0) < filters.bedrooms) return false;
    if (filters?.verifiedOnly && !p.verified) return false;
    if (filters?.featuredOnly && !p.featured) return false;
    return true;
  });
}

export async function getPropertiesInMapBounds(bounds: BoundingBox, filters?: PropertyFilters): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    params.set("north", bounds.north.toString());
    params.set("south", bounds.south.toString());
    params.set("east", bounds.east.toString());
    params.set("west", bounds.west.toString());

    const data = await fetchWithDeduplication<any[]>(`${BASE}/properties?${params.toString()}`);
    if (Array.isArray(data) && data.length > 0) return data.map(mapDbListing);
  } catch {
    // Fallback
  }

  return localListingsState.filter((p) => {
    if (!p.location) return false;
    const lat = p.location.latitude;
    const lng = p.location.longitude;
    const inBounds = lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    if (!inBounds) return false;
    if (filters?.purpose && p.listingPurpose !== filters.purpose) return false;
    if (filters?.type && p.propertyType !== filters.type) return false;
    return true;
  });
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const data = await fetchWithDeduplication<any>(`${BASE}/properties/${slug}`);
    if (data) return mapDbListing(data);
  } catch {
    // Fallback
  }
  const all = await getProperties();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return getPropertyBySlug(id);
}

export async function submitLead(lead: Lead): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (res.ok) return res.json();
  } catch {
    // Fallback
  }
  return { success: true };
}

export async function submitBooking(booking: Booking): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    if (res.ok) return res.json();
  } catch {
    // Fallback
  }
  return { success: true };
}

export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem("pp_favorites");
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return localFavoritesState;
}

export function toggleFavorite(listingId: string): string[] {
  let favs = getFavorites();
  if (favs.includes(listingId)) {
    favs = favs.filter((id) => id !== listingId);
  } else {
    favs.push(listingId);
  }
  localFavoritesState = favs;
  try {
    localStorage.setItem("pp_favorites", JSON.stringify(favs));
  } catch {
    // Ignore
  }

  fetch(`${BASE}/favorites`, {
    method: favs.includes(listingId) ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId })
  }).catch(() => {});

  return favs;
}

export function saveListing(listing: Partial<Property>): Property {
  clearApiCache();
  const newId = listing.id || `listing-${Date.now()}`;
  const slug = listing.slug || (listing.title ? listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `listing-${Date.now()}`);
  const fullListing: Property = {
    id: newId,
    slug,
    title: listing.title || "Untitled Property",
    description: listing.description || "",
    propertyType: listing.propertyType || "villa",
    listingPurpose: listing.listingPurpose || "sale",
    status: listing.status || "published",
    price: listing.price || 0,
    areaSqft: listing.areaSqft || 0,
    bedrooms: listing.bedrooms || 0,
    bathrooms: listing.bathrooms || 0,
    facing: listing.facing || "East",
    featured: !!listing.featured,
    verified: listing.verified !== undefined ? listing.verified : true,
    agentId: listing.agentId || "agent-1",
    agent: MOCK_AGENTS[0],
    location: listing.location || {
      id: `loc-${Date.now()}`,
      state: "Tamil Nadu",
      city: "Coimbatore",
      locality: "Saravanampatti",
      address: "Saravanampatti Main Road",
      latitude: 11.0804,
      longitude: 76.9944,
    },
    primaryImageUrl: listing.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    images: listing.images || [
      { id: 1, url: listing.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", isPrimary: true }
    ],
    youtubeVideoId: listing.youtubeVideoId || "",
    createdAt: listing.createdAt || new Date().toISOString()
  };

  const existingIdx = localListingsState.findIndex(p => p.id === newId);
  if (existingIdx >= 0) {
    localListingsState[existingIdx] = fullListing;
  } else {
    localListingsState.unshift(fullListing);
  }

  fetch(`${BASE}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fullListing)
  }).catch(() => {});

  return fullListing;
}

export function deleteListing(id: string): void {
  clearApiCache();
  localListingsState = localListingsState.filter(p => p.id !== id);
  fetch(`${BASE}/properties/${id}`, { method: "DELETE" }).catch(() => {});
}

export function getAnalyticsSummary(): AnalyticsSummary {
  return {
    activeListings: localListingsState.length,
    totalLeads: 24,
    pendingBookings: 8,
    totalViews: 1420,
    conversionRate: "4.8%"
  };
}
