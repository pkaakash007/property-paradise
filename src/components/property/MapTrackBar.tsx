import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Compass, MapPin } from "lucide-react";
import type { Property } from "../../types/property";
import { formatCompactPrice } from "./MapView";

interface MapTrackBarProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
  onHoverProperty?: (id: string | null) => void;
  isPlayingTour: boolean;
  onToggleTour: () => void;
}

export default function MapTrackBar({
  properties,
  selectedPropertyId,
  onSelectProperty,
  onHoverProperty,
  isPlayingTour,
  onToggleTour,
}: MapTrackBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = properties.findIndex((p) => p.id === selectedPropertyId);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  // Auto-scroll track bar container to active thumbnail
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.children[activeIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  if (properties.length === 0) return null;

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + properties.length) % properties.length;
    onSelectProperty(properties[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % properties.length;
    onSelectProperty(properties[nextIndex].id);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 pointer-events-auto select-none">
      {/* iOS Floating Capsule Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-2xl border border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-xs font-bold text-[#17212B]">
        <div className="flex items-center gap-1.5 text-[#007AFF]">
          <Compass className="w-3.5 h-3.5 text-[#007AFF] animate-spin-slow" />
          <span className="uppercase tracking-widest text-[10px] font-extrabold text-[#53606C]">
            Location Track
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF]">
            {activeIndex + 1} of {properties.length}
          </span>

          <button
            onClick={onToggleTour}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all duration-300 ${
              isPlayingTour
                ? "bg-[#FF3B30] text-white shadow-md animate-pulse"
                : "bg-[#007AFF] text-white hover:bg-[#0066CC] shadow-sm hover:scale-105 active:scale-95"
            }`}
            title={isPlayingTour ? "Pause Photo Tour" : "Start Photo Tour"}
          >
            {isPlayingTour ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Track Scrubber Strip */}
      <div className="relative w-full max-w-2xl flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous property in track"
          className="shrink-0 w-9 h-9 rounded-full bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#17212B] hover:bg-white hover:text-[#007AFF] hover:scale-110 active:scale-90 transition-all z-10"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Scrollable Thumbnails Strip */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {properties.map((prop, idx) => {
            const isSelected = prop.id === selectedPropertyId;
            return (
              <button
                key={prop.id}
                onClick={() => onSelectProperty(prop.id)}
                onMouseEnter={() => onHoverProperty && onHoverProperty(prop.id)}
                onMouseLeave={() => onHoverProperty && onHoverProperty(null)}
                className={`group relative shrink-0 flex items-center gap-2 p-1.5 pr-3.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "bg-[#123B5D] text-white ring-2 ring-[#C7A76C] shadow-2xl scale-105"
                    : "bg-white/80 hover:bg-white hover:text-[#007AFF] text-[#17212B] border border-white/70 shadow-md hover:scale-105 hover:shadow-xl"
                }`}
              >
                {/* Photo Bubble */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/90 shadow-sm">
                  <img
                    src={prop.primaryImageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#C7A76C] border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-extrabold shadow">
                    {idx + 1}
                  </span>
                </div>

                {/* Text Info */}
                <div className="flex flex-col text-left pr-0.5">
                  <span className="text-[11px] font-extrabold line-clamp-1 leading-tight max-w-[100px]">
                    {prop.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-[#F2E9D8]" : "text-[#53606C] group-hover:text-[#007AFF]"
                    }`}
                  >
                    {formatCompactPrice(prop.price)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next property in track"
          className="shrink-0 w-9 h-9 rounded-full bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#17212B] hover:bg-white hover:text-[#007AFF] hover:scale-110 active:scale-90 transition-all z-10"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
