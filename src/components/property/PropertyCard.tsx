import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize2, Video, ShieldCheck, Star } from "lucide-react";
import type { Property } from "../../types/property";
import { getFavorites, toggleFavorite } from "../../lib/api";

interface PropertyCardProps {
  property: Property;
  onHover?: (id: string | null) => void;
  isHovered?: boolean;
}

export function formatPrice(price: number, purpose: string = "sale"): string {
  if (purpose === "rent") {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L/mo`;
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property, onHover, isHovered }: PropertyCardProps) {
  const [isFav, setIsFav] = useState(() => getFavorites().includes(property.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(property.id);
    setIsFav(updated.includes(property.id));
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group bg-white rounded-2xl overflow-hidden border border-mist shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
        isHovered ? "ring-2 ring-deep-ocean border-transparent scale-[1.01]" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-porcelain">
        <img
          src={property.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-champagne text-white shadow flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-deep-ocean text-white shadow uppercase tracking-wide">
            {property.propertyType}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow uppercase tracking-wide ${
            property.listingPurpose === "rent" ? "bg-sage" : "bg-ink"
          }`}>
            {property.listingPurpose === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all z-10 ${
            isFav
              ? "bg-coral text-white scale-110"
              : "bg-white/80 hover:bg-white text-slate hover:text-coral"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Bottom Image Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {property.verified && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-porcelain/90 backdrop-blur-sm text-sage flex items-center gap-1 border border-sage/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Listing
            </span>
          )}
          {property.youtubeVideoId && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-ink/80 backdrop-blur-sm text-porcelain flex items-center gap-1">
              <Video className="w-3 h-3 text-champagne" />
              Virtual Tour
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-deep-ocean font-serif">
              {formatPrice(property.price, property.listingPurpose)}
            </span>
          </div>

          <Link to={`/property/${property.slug}`}>
            <h3 className="text-base font-semibold text-ink group-hover:text-deep-ocean transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          {property.location && (
            <p className="text-xs text-slate flex items-center gap-1 mb-4 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-champagne shrink-0" />
              <span>{property.location.locality}, {property.location.city}</span>
            </p>
          )}
        </div>

        {/* Dimensions & Specs */}
        <div className="pt-3 border-t border-mist/80 flex items-center justify-between text-xs text-slate font-medium">
          {property.propertyType === "villa" ? (
            <>
              {property.bedrooms ? (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-deep-ocean" />
                  {property.bedrooms} Beds
                </span>
              ) : null}
              {property.bathrooms ? (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-deep-ocean" />
                  {property.bathrooms} Baths
                </span>
              ) : null}
              {property.areaSqft ? (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-deep-ocean" />
                  {property.areaSqft.toLocaleString()} sq.ft
                </span>
              ) : null}
            </>
          ) : (
            <>
              {property.areaSqft ? (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-deep-ocean" />
                  {property.areaSqft.toLocaleString()} sq.ft
                </span>
              ) : null}
              {property.facing ? (
                <span className="text-ink font-semibold">
                  {property.facing} Facing
                </span>
              ) : null}
              <span className="text-champagne font-semibold">Plot Area</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
