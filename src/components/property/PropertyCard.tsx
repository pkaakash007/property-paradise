import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize2, Video, ShieldCheck, Star, ArrowUpRight } from "lucide-react";
import type { Property } from "../../types/property";
import { getFavorites, toggleFavorite } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

interface PropertyCardProps {
  property: Property;
  onHover?: (id: string | null) => void;
  isHovered?: boolean;
  layout?: "grid" | "list";
}

export function formatPrice(price: number, purpose: string = "sale"): string {
  if (purpose === "rent") {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L/mo`;
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property, onHover, isHovered, layout = "grid" }: PropertyCardProps) {
  const { user, openAuthModal } = useAuth();
  const [isFav, setIsFav] = useState(() => getFavorites().includes(property.id));
  const [favAnim, setFavAnim] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(property.id));
  }, [user, property.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal("save"); return; }
    const updated = toggleFavorite(property.id);
    setIsFav(updated.includes(property.id));
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
  };

  if (layout === "list") {
    return (
      <Link
        to={`/property/${property.slug}`}
        onMouseEnter={() => onHover && onHover(property.id)}
        onMouseLeave={() => onHover && onHover(null)}
        className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 flex gap-0 ${
          isHovered
            ? "border-[#123B5D] shadow-xl shadow-[#123B5D]/10 -translate-y-0.5"
            : "border-[#E7E5DF] shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        {/* Image */}
        <div className="relative w-40 sm:w-52 shrink-0 overflow-hidden">
          <img
            src={property.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {property.featured && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#C7A76C] text-white flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white uppercase ${
              property.listingPurpose === "rent" ? "bg-[#4F7A69]" : "bg-[#17212B]"
            }`}>
              {property.listingPurpose === "rent" ? "Rent" : "Sale"}
            </span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md shadow z-10 transition-all ${favAnim ? "scale-125" : ""} ${
              isFav ? "bg-[#C65A52] text-white" : "bg-white/90 text-[#17212B] hover:text-[#C65A52]"
            }`}
          >
            <Heart className={`w-3 h-3 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-lg sm:text-xl font-extrabold text-[#123B5D] font-serif">{formatPrice(property.price, property.listingPurpose)}</span>
              {property.verified && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <Link to={`/property/${property.slug}`}>
              <h3 className="text-sm font-bold text-[#17212B] group-hover:text-[#123B5D] transition-colors line-clamp-1 mb-0.5">{property.title}</h3>
            </Link>
            {property.location && (
              <p className="text-[11px] text-[#53606C] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C7A76C] shrink-0" />
                {property.location.locality}, {property.location.city}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EEE9]">
            <div className="flex items-center gap-3 text-[11px] text-[#53606C] font-semibold flex-wrap">
              {property.propertyType === "villa" ? (
                <>
                  {property.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3 text-[#123B5D]" />{property.bedrooms} Beds</span>}
                  {property.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3 text-[#123B5D]" />{property.bathrooms} Baths</span>}
                  {property.areaSqft && <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{property.areaSqft.toLocaleString()} sq.ft</span>}
                </>
              ) : (
                <>
                  {property.areaSqft && <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3 text-[#123B5D]" />{property.areaSqft.toLocaleString()} sq.ft</span>}
                  {property.facing && <span>{property.facing} Facing</span>}
                </>
              )}
            </div>
            <span
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#123B5D] bg-[#123B5D]/8 group-hover:bg-[#123B5D] group-hover:text-white border border-[#123B5D]/20 transition-all duration-200 shrink-0"
            >
              View <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (default)
  return (
    <Link
      to={`/property/${property.slug}`}
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isHovered
          ? "border-[#123B5D] shadow-2xl shadow-[#123B5D]/12 -translate-y-1.5"
          : "border-[#E7E5DF] shadow-sm hover:shadow-xl hover:shadow-[#17212B]/8 hover:-translate-y-1"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F0EEE9]">
        <img
          src={property.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
        />

        {/* Permanent bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#C7A76C] text-white shadow flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" /> Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/15 text-white backdrop-blur-md border border-white/25 uppercase tracking-wide">
            {property.propertyType}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wide backdrop-blur-sm border border-white/20 bg-[#123B5D]/90`}>
            For Sale
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg z-10 transition-all duration-300 ${
            favAnim ? "scale-125" : "scale-100"
          } ${
            isFav
              ? "bg-[#C65A52] text-white"
              : "bg-white/90 hover:bg-white text-[#17212B] hover:text-[#C65A52] border border-white/60"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Bottom of image — price overlaid on gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <div className="flex items-end justify-between">
            <span className="text-xl font-extrabold text-white font-serif drop-shadow-md">
              {formatPrice(property.price, property.listingPurpose)}
            </span>
            <div className="flex items-center gap-1.5">
              {property.verified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-300 bg-emerald-900/60 backdrop-blur-sm border border-emerald-500/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
              {property.youtubeVideoId && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#C7A76C] bg-black/50 backdrop-blur-sm border border-[#C7A76C]/40">
                  <Video className="w-2.5 h-2.5" /> Tour
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        {/* Title & Location */}
        <div>
          <Link to={`/property/${property.slug}`}>
            <h3 className="text-[14px] font-bold text-[#17212B] group-hover:text-[#123B5D] transition-colors line-clamp-1 leading-snug">
              {property.title}
            </h3>
          </Link>
          {property.location && (
            <p className="text-[11px] text-[#53606C] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#C7A76C] shrink-0" />
              {property.location.locality}, {property.location.city}
            </p>
          )}
        </div>

        {/* Specs + CTA */}
        <div className="mt-auto pt-3 border-t border-[#F0EEE9] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] text-[#53606C] font-semibold flex-wrap">
            {property.propertyType === "villa" ? (
              <>
                {property.bedrooms && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-[#123B5D]" />
                    {property.bedrooms} Beds
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-[#123B5D]" />
                    {property.bathrooms} Baths
                  </span>
                )}
                {property.areaSqft && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-[#123B5D]" />
                    {property.areaSqft.toLocaleString()} sq.ft
                  </span>
                )}
              </>
            ) : (
              <>
                {property.areaSqft && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-[#123B5D]" />
                    {property.areaSqft.toLocaleString()} sq.ft
                  </span>
                )}
                {property.facing && (
                  <span>{property.facing} Facing</span>
                )}
              </>
            )}
          </div>

          <span
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#123B5D] bg-[#123B5D]/8 group-hover:bg-[#123B5D] group-hover:text-white border border-[#123B5D]/20 transition-all duration-200 shrink-0"
          >
            View <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
