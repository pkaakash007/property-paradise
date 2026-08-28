import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/layout/Header";
import MapView from "../../components/property/MapView";
import PropertyCard from "../../components/property/PropertyCard";
import MapTrackBar from "../../components/property/MapTrackBar";
import PropertyPopupCard from "../../components/property/PropertyPopupCard";
import StreetViewModal from "../../components/property/StreetViewModal";
import type { Property, BoundingBox, PropertyFilters } from "../../types/property";
import { getProperties, getPropertiesInMapBounds } from "../../lib/api";
import { SlidersHorizontal, Map, LayoutList, Sparkles, Filter } from "lucide-react";

export default function MapSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showPopupCard, setShowPopupCard] = useState<boolean>(false);
  const [showStreetView, setShowStreetView] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"track" | "split" | "full">("track");
  const [showTrackLine, setShowTrackLine] = useState<boolean>(true);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);

  // Filters state
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const tourIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadProperties();
  }, [activeFilter]);

  const loadProperties = () => {
    const filters: PropertyFilters = {};
    if (activeFilter === "villa") filters.type = "villa";
    if (activeFilter === "plot") filters.type = "plot";
    if (activeFilter === "sale") filters.purpose = "sale";
    if (activeFilter === "rent") filters.purpose = "rent";

    getProperties(filters).then((data) => {
      setProperties(data);
    });
  };

  // Auto Tour Timer
  useEffect(() => {
    if (isPlayingTour && properties.length > 0) {
      tourIntervalRef.current = setInterval(() => {
        setSelectedPropertyId((currentId) => {
          const currentIndex = properties.findIndex((p) => p.id === currentId);
          const nextIndex = (currentIndex + 1) % properties.length;
          return properties[nextIndex].id;
        });
        setShowPopupCard(true);
      }, 4500);
    } else {
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    }

    return () => {
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    };
  }, [isPlayingTour, properties]);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  const activeProperty = selectedProperty || properties[0];

  const handlePropertySelect = (id: string | null) => {
    setSelectedPropertyId(id);
    if (id) {
      setShowPopupCard(true);
    } else {
      setShowPopupCard(false);
    }
  };

  const handleOpenStreetView = (prop?: Property) => {
    const targetProp = prop || selectedProperty || properties[0];
    if (targetProp) {
      setSelectedPropertyId(targetProp.id);
      setShowStreetView(true);
    }
  };

  const handleBoundsChange = (bounds: BoundingBox) => {
    const filters: PropertyFilters = {};
    if (activeFilter === "villa") filters.type = "villa";
    if (activeFilter === "plot") filters.type = "plot";
    if (activeFilter === "sale") filters.purpose = "sale";
    if (activeFilter === "rent") filters.purpose = "rent";

    getPropertiesInMapBounds(bounds, filters).then((data) => setProperties(data));
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans overflow-hidden bg-[#F7F5F0]">
      <Header />

      {/* Sub-Header Floating iOS Glass Filter Bar */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-white/60 shadow-sm px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#53606C] flex items-center gap-1 pr-1">
            <Filter className="w-3.5 h-3.5 text-[#007AFF]" />
            Filters:
          </span>

          {[
            { id: "all", label: "All Properties" },
            { id: "villa", label: "Villas" },
            { id: "plot", label: "Plots" },
            { id: "sale", label: "For Sale" },
            { id: "rent", label: "For Rent" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all duration-300 shrink-0 ${
                activeFilter === f.id
                  ? "bg-[#007AFF] text-white shadow-md scale-102"
                  : "bg-white/80 text-[#17212B] hover:bg-white hover:text-[#007AFF] border border-white/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* iOS Segmented Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>{properties.length} Properties</span>
          </div>

          <div className="flex items-center bg-[#767680]/15 p-1 rounded-full text-xs font-semibold text-[#17212B] backdrop-blur-lg">
            <button
              onClick={() => setViewMode("track")}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                viewMode === "track"
                  ? "bg-white text-[#17212B] shadow-sm font-extrabold"
                  : "text-[#53606C] hover:text-[#17212B]"
              }`}
              title="Photo Track View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Photos Track</span>
            </button>

            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                viewMode === "split"
                  ? "bg-white text-[#17212B] shadow-sm font-extrabold"
                  : "text-[#53606C] hover:text-[#17212B]"
              }`}
              title="Split Map + List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Map View Area */}
        <div className="flex-1 relative h-full w-full">
          <MapView
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredPropertyId}
            onPropertySelect={handlePropertySelect}
            onBoundsChange={handleBoundsChange}
            showTrackLine={showTrackLine}
            onToggleTrackLine={() => setShowTrackLine(!showTrackLine)}
            onOpenStreetView={() => handleOpenStreetView()}
            isPlayingTour={isPlayingTour}
          />

          {/* iPhone Photos Map Track Scrubber Bar (Top/Bottom Center) */}
          {viewMode === "track" && properties.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-none">
              <MapTrackBar
                properties={properties}
                selectedPropertyId={selectedPropertyId}
                onSelectProperty={(id) => handlePropertySelect(id)}
                onHoverProperty={(id) => setHoveredPropertyId(id)}
                isPlayingTour={isPlayingTour}
                onToggleTour={() => setIsPlayingTour(!isPlayingTour)}
              />
            </div>
          )}

          {/* Floating iOS House Image Popup Sheet */}
          {selectedProperty && showPopupCard && (
            <div className="absolute bottom-6 left-4 sm:left-6 z-30 max-w-sm sm:max-w-md pointer-events-auto">
              <PropertyPopupCard
                property={selectedProperty}
                onClose={() => setShowPopupCard(false)}
                onOpenStreetView={() => handleOpenStreetView(selectedProperty)}
              />
            </div>
          )}
        </div>

        {/* Split View Side Listing Panel */}
        {viewMode === "split" && (
          <aside className="w-full md:w-[420px] h-full bg-[#F7F5F0] border-l border-[#E7E5DF] overflow-y-auto p-4 flex flex-col gap-4 shrink-0 shadow-2xl z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#123B5D]">
                Listings in this Area ({properties.length})
              </h2>
              <span className="text-xs font-bold text-[#53606C]">
                Hover to highlight on map
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => handlePropertySelect(prop.id)}
                  onMouseEnter={() => setHoveredPropertyId(prop.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  className={`cursor-pointer transition-all ${
                    prop.id === selectedPropertyId || prop.id === hoveredPropertyId
                      ? "ring-2 ring-[#007AFF] rounded-2xl shadow-lg scale-[1.01]"
                      : ""
                  }`}
                >
                  <PropertyCard
                    property={prop}
                    onHover={(id) => setHoveredPropertyId(id)}
                    isHovered={prop.id === selectedPropertyId || prop.id === hoveredPropertyId}
                  />
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* 360 Street View Modal */}
      {showStreetView && activeProperty?.location && (
        <StreetViewModal
          latitude={activeProperty.location.latitude}
          longitude={activeProperty.location.longitude}
          title={activeProperty.title}
          locationName={`${activeProperty.location.locality}, ${activeProperty.location.city}`}
          onClose={() => setShowStreetView(false)}
        />
      )}
    </div>
  );
}
