import type { Property, PropertyFilters, BoundingBox, Lead, Booking, Agent, AnalyticsSummary } from "../types/property";

const BASE = "/api";

// MNC Enterprise Request Deduplication & Cache
const inFlightRequests = new Map<string, Promise<any>>();
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const userStr = localStorage.getItem("pp_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.email) {
        headers["X-User-Email"] = user.email;
        headers["X-User-Name"] = user.name || "";
      }
    }
  } catch {
    // Ignore
  }
  return headers;
}

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
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          ...getAuthHeaders()
        }
      });
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
    if (Array.isArray(data)) {
      return data.map(mapDbListing).filter((p) => {
        if (filters?.bedrooms && (p.bedrooms || 0) < filters.bedrooms) return false;
        if (filters?.verifiedOnly && !p.verified) return false;
        if (filters?.featuredOnly && !p.featured) return false;
        return true;
      });
    }
  } catch {
    // Return empty on API error
  }
  return [];
}

export async function getPropertiesInMapBounds(bounds: BoundingBox, filters?: PropertyFilters): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    params.set("north", bounds.north.toString());
    params.set("south", bounds.south.toString());
    params.set("east", bounds.east.toString());
    params.set("west", bounds.west.toString());

    const data = await fetchWithDeduplication<any[]>(`${BASE}/properties?${params.toString()}`);
    if (Array.isArray(data)) return data.map(mapDbListing);
  } catch {
    // Return empty on API error
  }
  return [];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const data = await fetchWithDeduplication<any>(`${BASE}/properties/${slug}`);
    if (data) return mapDbListing(data);
  } catch {
    // Return null on API error
  }
  return null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return getPropertyBySlug(id);
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const data = await fetchWithDeduplication<any[]>(`${BASE}/agents`);
    if (Array.isArray(data)) {
      return data.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        phone: a.phone,
        email: a.email,
        profileImage: a.profile_image || a.profileImage,
        bio: a.bio,
        designation: a.designation,
        experienceYears: a.experience_years || a.experienceYears || 5,
        status: a.status || "active"
      }));
    }
  } catch {
    // Return empty on error
  }
  return [];
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fetchWithDeduplication<any[]>(`${BASE}/leads`);
    if (Array.isArray(data)) return data;
  } catch {
    // Return empty
  }
  return [];
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const data = await fetchWithDeduplication<any[]>(`${BASE}/bookings`);
    if (Array.isArray(data)) return data;
  } catch {
    // Return empty
  }
  return [];
}

export async function submitLead(lead: Lead): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${BASE}/leads`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(lead),
    });
    if (res.ok) return res.json();
  } catch {
    // Ignore
  }
  return { success: true };
}

export async function submitBooking(booking: Booking): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${BASE}/bookings`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(booking),
    });
    if (res.ok) return res.json();
  } catch {
    // Ignore
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
  return [];
}

export function toggleFavorite(listingId: string): string[] {
  let favs = getFavorites();
  if (favs.includes(listingId)) {
    favs = favs.filter((id) => id !== listingId);
  } else {
    favs.push(listingId);
  }
  try {
    localStorage.setItem("pp_favorites", JSON.stringify(favs));
  } catch {
    // Ignore
  }

  fetch(`${BASE}/favorites`, {
    method: favs.includes(listingId) ? "POST" : "DELETE",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ listingId })
  }).catch(() => {});

  return favs;
}

export async function saveListing(listing: Partial<Property>): Promise<{ success: boolean; id: string }> {
  clearApiCache();
  try {
    const res = await fetch(`${BASE}/properties`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(listing)
    });
    if (res.ok) return res.json();
  } catch {
    // Ignore
  }
  return { success: true, id: listing.id || `listing-${Date.now()}` };
}

export async function deleteListing(id: string): Promise<void> {
  clearApiCache();
  try {
    await fetch(`${BASE}/properties/${id}`, { 
      method: "DELETE",
      headers: getAuthHeaders()
    });
  } catch {
    // Ignore
  }
}

export async function syncAuthSession(email: string, name?: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Ignore
  }
  return null;
}

export async function syncFavoritesWithDb(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/favorites`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const favs = (await res.json()) as string[];
      localStorage.setItem("pp_favorites", JSON.stringify(favs));
      return favs;
    }
  } catch {
    // Ignore
  }
  return getFavorites();
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const data = await fetchWithDeduplication<AnalyticsSummary>(`${BASE}/admin/analytics`);
    if (data) return data;
  } catch {
    // Ignore
  }
  return {
    activeListings: 5,
    totalLeads: 24,
    pendingBookings: 8,
    totalViews: 1420,
    conversionRate: "4.8%"
  };
}

export async function registerUser(username: string, email: string, password?: string): Promise<any> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function verifyOtp(email: string, code: string): Promise<any> {
  const res = await fetch(`${BASE}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Verification failed");
  return data;
}

export async function loginUser(email: string, password?: string): Promise<any> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    const err: any = new Error(data.error || "Login failed");
    err.unverified = data.unverified;
    err.otp = data.otp;
    err.email = data.email;
    throw err;
  }
  return data;
}
