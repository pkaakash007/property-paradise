import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  PhoneCall,
  ShieldCheck,
  Star,
  ExternalLink,
  Compass,
} from "lucide-react";
import type { Property } from "../../types/property";
import { formatPrice } from "./PropertyCard";
import { getFavorites, toggleFavorite } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

import { Eye } from "lucide-react";

interface PropertyPopupCardProps {
  property: Property;
  onClose: () => void;
  onOpenStreetView?: () => void;
}

export default function PropertyPopupCard({ property, onClose, onOpenStreetView }: PropertyPopupCardProps) {
  const { user, openAuthModal } = useAuth();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(() => getFavorites().includes(property.id));

  useEffect(() => {
    setIsFav(getFavorites().includes(property.id));
  }, [user, property.id]);

  // Build image list fallback
  const imagesList =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.url)
      : [property.primaryImageUrl];

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      openAuthModal("save");
      return;
    }

    const updated = toggleFavorite(property.id);
    setIsFav(updated.includes(property.id));
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/60 shadow-2xl transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-6">
      {/* Top Header / Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#17212B]">
        <img
          src={imagesList[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all z-20 ${
            isFav
              ? "bg-[#C65A52] text-white scale-110"
              : "bg-white/80 hover:bg-white text-[#17212B] hover:text-[#C65A52]"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Image Navigation Arrows */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 flex items-center justify-center transition-all z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 flex items-center justify-center transition-all z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {imagesList.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(i);
                  }}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentImgIndex
                      ? "w-5 bg-white shadow-md"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-xs text-white/80 font-bold uppercase tracking-wider">
              Listing Price
            </span>
            <span className="text-2xl font-black text-white drop-shadow-md font-serif">
              {formatPrice(property.price, property.listingPurpose)}
            </span>
          </div>

          <div className="flex gap-1">
            {property.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C7A76C] text-white shadow flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                Featured
              </span>
            )}
            {property.verified && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#4F7A69] text-white shadow flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex flex-col gap-3 text-[#17212B]">
        <div>
          <Link to={`/property/${property.slug}`}>
            <h3 className="text-base font-extrabold text-[#17212B] hover:text-[#123B5D] transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {property.location && (
            <p className="text-xs font-semibold text-[#53606C] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C7A76C] shrink-0" />
              <span>
                {property.location.locality}, {property.location.city}
              </span>
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#F7F5F0] rounded-xl border border-[#E7E5DF] text-xs font-bold text-[#17212B]">
          {property.bedrooms ? (
            <div className="flex flex-col items-center justify-center p-1 text-center">
              <Bed className="w-4 h-4 text-[#123B5D] mb-0.5" />
              <span>{property.bedrooms} Beds</span>
            </div>
          ) : null}
          {property.bathrooms ? (
            <div className="flex flex-col items-center justify-center p-1 text-center border-l border-[#E7E5DF]">
              <Bath className="w-4 h-4 text-[#123B5D] mb-0.5" />
              <span>{property.bathrooms} Baths</span>
            </div>
          ) : null}
          {property.areaSqft ? (
            <div className="flex flex-col items-center justify-center p-1 text-center border-l border-[#E7E5DF]">
              <Maximize2 className="w-4 h-4 text-[#123B5D] mb-0.5" />
              <span>{property.areaSqft.toLocaleString()} sq.ft</span>
            </div>
          ) : null}
          {!property.bedrooms && property.facing && (
            <div className="flex flex-col items-center justify-center p-1 text-center border-l border-[#E7E5DF]">
              <Compass className="w-4 h-4 text-[#C7A76C] mb-0.5" />
              <span>{property.facing}</span>
            </div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/property/${property.slug}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#123B5D] text-white hover:bg-[#17212B] text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {onOpenStreetView && (
            <button
              onClick={onOpenStreetView}
              className="py-2.5 px-3 rounded-xl bg-[#007AFF] text-white hover:bg-[#0066CC] text-xs font-extrabold shadow-md flex items-center justify-center gap-1 transition-all"
              title="Open 360° Street View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>360° View</span>
            </button>
          )}

          {property.agent?.phone && (
            <a
              href={`tel:${property.agent.phone}`}
              className="p-2.5 rounded-xl bg-[#F2E9D8] text-[#123B5D] hover:bg-[#C7A76C] hover:text-white transition-all shadow"
              title="Call Agent"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
