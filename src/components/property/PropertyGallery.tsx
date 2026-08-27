import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize } from "lucide-react";
import type { ListingImage } from "../../types/property";

interface PropertyGalleryProps {
  images: ListingImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const displayImages = images.length > 0 ? images : [
    { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", alt: title }
  ];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Primary Hero Image & Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden border border-mist shadow-sm">
        {/* Main Big Image */}
        <div className="md:col-span-3 relative aspect-[16/10] bg-porcelain group overflow-hidden">
          <img
            src={displayImages[activeIdx]?.url}
            alt={displayImages[activeIdx]?.alt || title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={() => setFullscreenOpen(true)}
            className="absolute bottom-4 right-4 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
          >
            <Maximize className="w-4 h-4" />
            <span>View All ({displayImages.length})</span>
          </button>
        </div>

        {/* Thumbnail Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col gap-3 justify-between">
          {displayImages.slice(0, 3).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === idx ? "border-deep-ocean shadow-md" : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt={img.alt || title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white">
            <span className="text-sm font-medium text-slate-300">
              {activeIdx + 1} of {displayImages.length}
            </span>
            <span className="font-serif text-lg font-semibold truncate max-w-md">
              {title}
            </span>
            <button
              onClick={() => setFullscreenOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Viewer */}
          <div className="relative max-w-5xl w-full flex-1 flex items-center justify-center my-4">
            <img
              src={displayImages[activeIdx]?.url}
              alt={displayImages[activeIdx]?.alt || title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Prev / Next controls */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all shadow"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all shadow"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Ribbon */}
          <div className="flex gap-2 overflow-x-auto max-w-2xl py-2 scrollbar-none">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeIdx === idx ? "border-champagne scale-105" : "border-transparent opacity-50"
                }`}
              >
                <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
