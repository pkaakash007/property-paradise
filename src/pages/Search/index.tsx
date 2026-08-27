import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SearchFilters from "../../components/property/SearchFilters";
import PropertyGrid from "../../components/property/PropertyGrid";
import MapView from "../../components/property/MapView";
import type { Property, PropertyFilters, BoundingBox } from "../../types/property";
import { getProperties, getPropertiesInMapBounds } from "../../lib/api";
import { Map, ListFilter } from "lucide-react";

interface SearchPageProps {
  initialPurpose?: "sale" | "rent";
  initialType?: "villa" | "plot";
}

export default function Search({ initialPurpose, initialType }: SearchPageProps) {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>(() => {
    return {
      purpose: initialPurpose || (searchParams.get("purpose") as any) || undefined,
      type: initialType || (searchParams.get("type") as any) || undefined,
      city: searchParams.get("city") || undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    };
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "map">("split");

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

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-porcelain flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Page Title & View Toggle Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold font-serif text-[#17212B] tracking-tight">
              {filters.type === "villa"
                ? "Luxury Villas for Sale & Rent"
                : filters.type === "plot"
                ? "Residential Plots for Sale"
                : filters.purpose === "rent"
                ? "Properties for Rent"
                : "Properties for Sale & Rent"}
            </h1>
            <p className="text-xs text-[#53606C] mt-0.5">
              {properties.length} verified listings in South India
            </p>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden items-center bg-[#F7F5F0] p-1 rounded-xl border border-[#E7E5DF] shrink-0">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === "split" ? "bg-[#123B5D] text-white shadow-sm" : "text-[#17212B]"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === "map" ? "bg-[#123B5D] text-white shadow-sm" : "text-[#17212B]"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <SearchFilters
          filters={filters}
          onChange={(newF) => setFilters(newF)}
          onReset={handleResetFilters}
        />

        {/* Synchronized Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Property Cards List */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              viewMode === "map" ? "hidden lg:flex" : "flex"
            }`}
          >
            <PropertyGrid
              properties={properties}
              loading={loading}
              hoveredPropertyId={hoveredPropertyId}
              onPropertyHover={(id) => setHoveredPropertyId(id)}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Map View Column */}
          <div
            className={`lg:col-span-5 h-[600px] lg:h-auto lg:sticky lg:top-24 rounded-2xl overflow-hidden shadow-sm ${
              viewMode === "split" ? "hidden lg:block" : "block"
            }`}
          >
            <MapView
              properties={properties}
              selectedPropertyId={selectedPropertyId || hoveredPropertyId}
              onPropertySelect={(id) => setSelectedPropertyId(id)}
              onBoundsChange={handleBoundsChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
