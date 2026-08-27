import React, { useState } from "react";
import { SlidersHorizontal, MapPin } from "lucide-react";
import type { PropertyFilters, PropertyType, ListingPurpose } from "../../types/property";

interface SearchFiltersProps {
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
}

export default function SearchFilters({ filters, onChange, onReset }: SearchFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handlePurposeChange = (purpose?: ListingPurpose) => {
    onChange({ ...filters, purpose });
  };

  const handleTypeChange = (type?: PropertyType) => {
    onChange({ ...filters, type });
  };

  const handleCityChange = (city?: string) => {
    onChange({ ...filters, city: city === "all" ? undefined : city });
  };

  return (
    <div className="bg-white rounded-2xl border border-mist p-4 shadow-sm mb-6">
      {/* Desktop Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Purpose Buttons (Buy / Rent) */}
        <div className="flex items-center bg-porcelain p-1 rounded-xl border border-mist">
          <button
            onClick={() => handlePurposeChange(undefined)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filters.purpose ? "bg-deep-ocean text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handlePurposeChange("sale")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.purpose === "sale" ? "bg-deep-ocean text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => handlePurposeChange("rent")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.purpose === "rent" ? "bg-deep-ocean text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            Rent
          </button>
        </div>

        {/* Type Buttons (Villa / Plot) */}
        <div className="flex items-center bg-porcelain p-1 rounded-xl border border-mist">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filters.type ? "bg-ink text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => handleTypeChange("villa")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.type === "villa" ? "bg-ink text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            Villas
          </button>
          <button
            onClick={() => handleTypeChange("plot")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.type === "plot" ? "bg-ink text-white shadow" : "text-slate hover:text-ink"
            }`}
          >
            Plots
          </button>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-champagne shrink-0" />
          <select
            value={filters.city || "all"}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-porcelain border border-mist rounded-xl px-3 py-1.5 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-deep-ocean"
          >
            <option value="all">All Locations</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Ooty">Ooty</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Bedroom Filter (If Villa or All) */}
        {filters.type !== "plot" && (
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate">Beds:</span>
            {[undefined, 3, 4, 5].map((b) => (
              <button
                key={b || "any"}
                onClick={() => onChange({ ...filters, bedrooms: b })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filters.bedrooms === b ? "bg-champagne text-white" : "bg-porcelain text-slate hover:bg-mist"
                }`}
              >
                {b ? `${b}+` : "Any"}
              </button>
            ))}
          </div>
        )}

        {/* Mobile / Extra Filter Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="px-4 py-2 rounded-xl border border-mist bg-porcelain hover:bg-mist/50 text-xs font-semibold text-ink flex items-center gap-2 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-deep-ocean" />
            <span>More Filters</span>
          </button>
          <button
            onClick={onReset}
            className="text-xs font-medium text-slate hover:text-coral transition-colors underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-mist grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate mb-1">Max Budget</label>
            <select
              value={filters.maxPrice || "all"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value === "all" ? undefined : Number(e.target.value),
                })
              }
              className="w-full bg-porcelain border border-mist rounded-xl p-2 text-xs font-medium text-ink"
            >
              <option value="all">Any Price</option>
              <option value="10000000">Under ₹1 Cr</option>
              <option value="20000000">Under ₹2 Cr</option>
              <option value="50000000">Under ₹5 Cr</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate mb-1">Facing</label>
            <select
              value={filters.facing || "all"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  facing: e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className="w-full bg-porcelain border border-mist rounded-xl p-2 text-xs font-medium text-ink"
            >
              <option value="all">Any Facing</option>
              <option value="East">East</option>
              <option value="North">North</option>
              <option value="East-North">East-North Corner</option>
              <option value="South-East">South-East</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.verifiedOnly}
                onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
                className="rounded border-mist text-deep-ocean focus:ring-deep-ocean"
              />
              <span>Verified Only</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.featuredOnly}
                onChange={(e) => onChange({ ...filters, featuredOnly: e.target.checked })}
                className="rounded border-mist text-deep-ocean focus:ring-deep-ocean"
              />
              <span>Featured Only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
