import React from "react";
import { X, ExternalLink, Compass, Eye, MapPin } from "lucide-react";

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
  // Google Street View Embed Panorama iframe URL
  const streetViewEmbedUrl = `https://maps.google.com/maps?q=&layer=c&cbll=${latitude},${longitude}&cbp=12,0,0,0,0&output=sview`;
  const directMapsUrl = `https://www.google.com/maps?layer=c&cbll=${latitude},${longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#17212B] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        {/* iOS Modal Header */}
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
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all"
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

        {/* Street View 360 Iframe Area */}
        <div className="flex-1 relative w-full h-full bg-black">
          <iframe
            title={`360 Street View for ${title}`}
            src={streetViewEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />

          {/* Bottom Floating Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-2xl pointer-events-none flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#007AFF] animate-spin-slow" />
            <span>Drag inside frame to explore 360° neighborhood view</span>
          </div>
        </div>
      </div>
    </div>
  );
}
