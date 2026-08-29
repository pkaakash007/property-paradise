export type PropertyType = "villa" | "plot";
export type ListingPurpose = "sale" | "rent";
export type ListingStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "featured"
  | "under_offer"
  | "sold"
  | "rented"
  | "inactive"
  | "archived";

export interface ListingLocation {
  id: string;
  country?: string;
  state: string;
  city: string;
  locality: string;
  area?: string;
  pincode?: string;
  address?: string;
  latitude: number;
  longitude: number;
  privacy?: "exact" | "approximate" | "hidden";
  mapZoom?: number;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  profileImage?: string;
  bio?: string;
  designation?: string;
  experienceYears?: number;
  status?: string;
}

export interface ListingImage {
  id?: number;
  listingId?: string;
  url: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description?: string;

  propertyType: PropertyType;
  listingPurpose: ListingPurpose;
  status: ListingStatus;

  price: number;

  areaSqft?: number;
  plotAreaSqft?: number;
  builtupAreaSqft?: number;

  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  parkingSpaces?: number;

  facing?: string;
  furnishedStatus?: string;

  featured: boolean;
  verified: boolean;

  agentId?: string;
  agent?: Agent;

  locationId?: string;
  location?: ListingLocation;

  primaryImageUrl?: string;
  images?: ListingImage[];

  youtubeVideoId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFilters {
  purpose?: ListingPurpose;
  type?: PropertyType;
  city?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  facing?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc";
  search?: string;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Lead {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  listingId?: string;
  listingTitle?: string;
  source?: string;
  status?: "new" | "contacted" | "qualified" | "site_visit" | "converted" | "lost" | "closed";
  assignedAgentId?: string;
  notes?: string;
  createdAt?: string;
}

export interface Booking {
  id?: number;
  propertyId: string;
  listingTitle?: string;
  name: string;
  phone: string;
  email?: string;
  scheduledAt: string;
  preferredTime?: string;
  status?: "pending" | "confirmed" | "rescheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt?: string;
}

export interface AnalyticsSummary {
  activeListings: number;
  totalLeads: number;
  pendingBookings: number;
  totalViews: number;
  conversionRate: string;
}
