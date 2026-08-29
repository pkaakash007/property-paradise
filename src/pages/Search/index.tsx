import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SearchFilters from "../../components/property/SearchFilters";
import PropertyGrid from "../../components/property/PropertyGrid";
import MapView from "../../components/property/MapView";
import type { Property, PropertyFilters, BoundingBox } from "../../types/property";
import { getProperties, getPropertiesInMapBounds } from "../../lib/api";
import { Map, LayoutList, Columns2, SlidersHorizontal, ChevronDown, LayoutGrid } from "lucide-react";

interface SearchPageProps {
  initialPurpose?: "sale";
  initialType?: "villa" | "plot";
}

export default function Search({ initialPurpose, initialType }: SearchPageProps) {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    purpose: initialPurpose || (searchParams.get("purpose") as any) || undefined,
    type: initialType || (searchParams.get("type") as any) || undefined,
    city: searchParams.get("city") || undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    search: searchParams.get("search") || undefined,
  }));

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "split" | "map">("grid");
  const [cardLayout, setCardLayout] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  // Sync URL params → filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("search") || undefined,
      city: searchParams.get("city") || undefined,
      purpose: (searchParams.get("purpose") as any) || undefined,
      type: (searchParams.get("type") as any) || undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getProperties(filters)
      .then((data) => setProperties(data))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleBoundsChange = (bounds: BoundingBox) => {
    setLoading(true);
    getPropertiesInMapBounds(bounds, filters)
      .then((data) => setProperties(data))
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => setFilters({});

  // Sorted properties
  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0; // newest — server already sorts by created_at
  });

  const pageTitle =
    filters.type === "villa" ? "Luxury Villas" :
    filters.type === "plot" ? "Residential Plots" : "All Properties";

  const pageSubtitle =
    filters.search ? `Results for "${filters.search}"` :
    filters.city ? `in ${filters.city}` : "South India";

  return (
    <div className="w-full min-h-screen bg-[#F4F2ED] flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* ── Compact Page Header ─────────────────────────────── */}
        <div className="bg-white border-b border-[#E7E5DF]">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Title */}
            <div className="animate-fadeInUp min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#17212B] tracking-tight leading-tight truncate">
                {pageTitle}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#53606C]">
                  <span className="font-extrabold text-[#123B5D]">{loading ? "…" : properties.length}</span>
                  {" "}listings · {pageSubtitle}
                </span>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-[#E7E5DF] rounded-full pl-3 pr-8 py-1.5 text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C7A76C] cursor-pointer shadow-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#53606C] pointer-events-none" />
              </div>

              {/* Card layout toggle (grid/list) — only in non-map modes */}
              {viewMode !== "map" && (
                <div className="flex items-center bg-[#F4F2ED] p-0.5 rounded-full border border-[#E7E5DF]">
                  <button
                    onClick={() => setCardLayout("grid")}
                    title="Grid View"
                    className={`p-1.5 rounded-full transition-all ${cardLayout === "grid" ? "bg-white shadow text-[#123B5D]" : "text-[#53606C] hover:text-[#17212B]"}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCardLayout("list")}
                    title="List View"
                    className={`p-1.5 rounded-full transition-all ${cardLayout === "list" ? "bg-white shadow text-[#123B5D]" : "text-[#53606C] hover:text-[#17212B]"}`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* View mode toggle */}
              <div className="flex items-center bg-[#F4F2ED] p-0.5 rounded-full border border-[#E7E5DF]">
                {([
                  { id: "grid", label: "List", icon: <LayoutList className="w-3.5 h-3.5" /> },
                  { id: "split", label: "Split", icon: <Columns2 className="w-3.5 h-3.5" /> },
                  { id: "map", label: "Map", icon: <Map className="w-3.5 h-3.5" /> },
                ] as const).map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setViewMode(btn.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      viewMode === btn.id
                        ? "bg-[#123B5D] text-white shadow"
                        : "text-[#53606C] hover:text-[#17212B]"
                    }`}
                  >
                    {btn.icon}
                    <span className="hidden sm:inline">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Filter Bar ─────────────────────────────── */}
        <div className="sticky top-[64px] z-30 bg-white/96 backdrop-blur-md border-b border-[#E7E5DF] shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <SearchFilters
              filters={filters}
              onChange={(newF) => setFilters(newF)}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className={`flex-1 ${viewMode === "split" ? "" : "max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"}`}>

          {/* Grid / List only */}
          {viewMode === "grid" && (
            <PropertyGrid
              properties={sortedProperties}
              loading={loading}
              hoveredPropertyId={hoveredPropertyId}
              onPropertyHover={setHoveredPropertyId}
              onResetFilters={handleResetFilters}
              cardLayout={cardLayout}
            />
          )}

          {/* Split view */}
          {viewMode === "split" && (
            <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-180px)]">
              {/* Left: Cards */}
              <div className="w-full lg:w-[58%] xl:w-[55%] shrink-0 overflow-y-auto px-4 sm:px-6 lg:pl-8 lg:pr-4 py-5">
                <PropertyGrid
                  properties={sortedProperties}
                  loading={loading}
                  hoveredPropertyId={hoveredPropertyId}
                  onPropertyHover={setHoveredPropertyId}
                  onResetFilters={handleResetFilters}
                  cardLayout={cardLayout}
                  splitMode
                />
              </div>

              {/* Right: Map sticky */}
              <div className="w-full lg:flex-1 h-[400px] lg:h-auto lg:sticky lg:top-[130px] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E7E5DF]">
                <MapView
                  properties={properties}
                  selectedPropertyId={selectedPropertyId || hoveredPropertyId}
                  onPropertySelect={(id) => setSelectedPropertyId(id)}
                  onBoundsChange={handleBoundsChange}
                />
              </div>
            </div>
          )}

          {/* Map only */}
          {viewMode === "map" && (
            <div className="h-[calc(100vh-180px)] rounded-2xl overflow-hidden shadow-lg border border-[#E7E5DF] animate-scaleIn">
              <MapView
                properties={properties}
                selectedPropertyId={selectedPropertyId || hoveredPropertyId}
                onPropertySelect={(id) => setSelectedPropertyId(id)}
                onBoundsChange={handleBoundsChange}
              />
            </div>
          )}
        </div>
      </main>

      {viewMode !== "split" && <Footer />}
    </div>
  );
}
