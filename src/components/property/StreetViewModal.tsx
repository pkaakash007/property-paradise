import React, { useState } from "react";
import { X, ExternalLink, Compass, Eye, MapPin, RefreshCw } from "lucide-react";

interface StreetViewModalProps {
  latitude: number;
  longitude: number;
  title: string;
  locationName: string;
  onClose: () => void;
}

export default function StreetViewModal({
  latitude,
  longitude,
  title,
  locationName,
  onClose,
}: StreetViewModalProps) {
  const [iframeError, setIframeError] = useState(false);

  // Correct Google Street View embed URL format
  const streetViewEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&layer=c&cbll=${latitude},${longitude}&output=embed`;
  const directMapsUrl = `https://www.google.com/maps?layer=c&cbll=${latitude},${longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[82vh] bg-[#17212B] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/10 backdrop-blur-2xl border-b border-white/10 text-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#007AFF] text-white">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold line-clamp-1 leading-tight">{title}</h3>
              <p className="text-xs font-semibold text-white/70 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C7A76C]" />
                <span>360° Street View — {locationName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              aria-label="Close Street View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 360 View Frame / Fallback */}
        <div className="flex-1 relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
          {!iframeError ? (
            <iframe
              title={`360 Street View for ${title}`}
              src={streetViewEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-[#123B5D] to-[#0A192F]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="360 Neighborhood Walkthrough"
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
              />
              <div className="relative z-10 max-w-md p-6 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#007AFF]/20 text-[#007AFF] border border-[#007AFF]/40 flex items-center justify-center text-2xl animate-pulse">
                  🧭
                </div>
                <h4 className="text-lg font-extrabold">360° Panorama Ready</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Google Maps restricts embedded frames in certain browser environments. Click below to launch interactive 360° Street View directly in Google Maps.
                </p>
                <a
                  href={directMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white text-xs font-extrabold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch 360° Street View</span>
                </a>
              </div>
            </div>
          )}

          {/* Bottom Floating Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-2xl pointer-events-none flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#007AFF] animate-spin-slow" />
            <span>Interactive 360° Neighborhood View</span>
          </div>
        </div>
      </div>
    </div>
  );
}
