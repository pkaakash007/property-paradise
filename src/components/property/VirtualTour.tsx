import React from "react";
import { Video, Calendar } from "lucide-react";

interface VirtualTourProps {
  videoId?: string;
  title: string;
  onScheduleVisit?: () => void;
}

export default function VirtualTour({ videoId, title, onScheduleVisit }: VirtualTourProps) {
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

  return (
    <div className="bg-ink text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-champagne text-xs font-semibold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Exclusive Virtual Tour</span>
          </div>
          <h3 className="text-xl font-bold font-serif">{title}</h3>
        </div>
        {onScheduleVisit && (
          <button
            onClick={onScheduleVisit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-champagne text-ink text-xs font-bold hover:bg-champagne-soft transition-all shadow shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule In-Person Visit</span>
          </button>
        )}
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate/40">
        <iframe
          src={embedUrl}
          title={`${title} Virtual Tour`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Experience a 4K walkthrough of the estate premises, architectural details, interior design, and outdoor living spaces.
      </p>
    </div>
  );
}
