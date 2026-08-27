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
      className={`group bg-white rounded-2xl overflow-hidden border border-[#E7E5DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
        isHovered ? "ring-2 ring-[#123B5D] border-transparent scale-[1.01]" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F5F0]">
        <img
          src={property.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top High-Contrast Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#C7A76C] text-white shadow-md border border-white/20 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-white" />
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#123B5D] text-white shadow-md border border-white/20 uppercase tracking-wide">
            {property.propertyType}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-md border border-white/20 uppercase tracking-wide ${
              property.listingPurpose === "rent" ? "bg-[#4F7A69]" : "bg-[#17212B]"
            }`}
          >
            {property.listingPurpose === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all z-10 ${
            isFav
              ? "bg-[#C65A52] text-white scale-110"
              : "bg-white/90 hover:bg-white text-[#17212B] hover:text-[#C65A52] border border-[#53606C]/30"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Bottom Image Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {property.verified && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-[#17212B]/90 backdrop-blur-md text-[#4F7A69] flex items-center gap-1 border border-[#4F7A69]/60 shadow">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F7A69]" />
              Verified Listing
            </span>
          )}
          {property.youtubeVideoId && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-[#17212B]/90 backdrop-blur-md text-[#C7A76C] flex items-center gap-1 border border-[#C7A76C]/60 shadow">
              <Video className="w-3.5 h-3.5 text-[#C7A76C]" />
              Virtual Tour
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-[#123B5D] font-serif">
              {formatPrice(property.price, property.listingPurpose)}
            </span>
          </div>

          <Link to={`/property/${property.slug}`}>
            <h3 className="text-base font-bold text-[#17212B] group-hover:text-[#123B5D] transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          {property.location && (
            <p className="text-xs font-semibold text-[#53606C] flex items-center gap-1 mb-4 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-[#C7A76C] shrink-0" />
              <span>
                {property.location.locality}, {property.location.city}
              </span>
            </p>
          )}
        </div>

        {/* Dimensions & Specs */}
        <div className="pt-3 border-t border-[#E7E5DF] flex items-center justify-between text-xs text-[#17212B] font-bold">
          {property.propertyType === "villa" ? (
            <>
              {property.bedrooms ? (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-[#123B5D]" />
                  {property.bedrooms} Beds
                </span>
              ) : null}
              {property.bathrooms ? (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-[#123B5D]" />
                  {property.bathrooms} Baths
                </span>
              ) : null}
              {property.areaSqft ? (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#123B5D]" />
                  {property.areaSqft.toLocaleString()} sq.ft
                </span>
              ) : null}
            </>
          ) : (
            <>
              {property.areaSqft ? (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#123B5D]" />
                  {property.areaSqft.toLocaleString()} sq.ft
                </span>
              ) : null}
              {property.facing ? (
                <span className="text-[#17212B] font-bold">{property.facing} Facing</span>
              ) : null}
              <span className="text-[#C7A76C] font-extrabold">Plot Area</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
