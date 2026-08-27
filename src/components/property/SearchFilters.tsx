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
    <div className="bg-white rounded-2xl border border-[#E7E5DF] p-4 shadow-sm mb-6">
      {/* Desktop Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Purpose Buttons (Buy / Rent) */}
        <div className="flex items-center bg-[#F7F5F0] p-1.5 rounded-xl border border-[#E7E5DF]">
          <button
            onClick={() => handlePurposeChange(undefined)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              !filters.purpose ? "bg-[#123B5D] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handlePurposeChange("sale")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filters.purpose === "sale" ? "bg-[#123B5D] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => handlePurposeChange("rent")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filters.purpose === "rent" ? "bg-[#123B5D] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Rent
          </button>
        </div>

        {/* Type Buttons (Villa / Plot) */}
        <div className="flex items-center bg-[#F7F5F0] p-1.5 rounded-xl border border-[#E7E5DF]">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              !filters.type ? "bg-[#17212B] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => handleTypeChange("villa")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filters.type === "villa" ? "bg-[#17212B] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Villas
          </button>
          <button
            onClick={() => handleTypeChange("plot")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filters.type === "plot" ? "bg-[#17212B] text-white shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Plots
          </button>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C7A76C] shrink-0" />
          <select
            value={filters.city || "all"}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#17212B] focus:outline-none focus:ring-2 focus:ring-[#123B5D]"
          >
            <option value="all">All Locations</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Ooty">Ooty</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Bedroom Filter */}
        {filters.type !== "plot" && (
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#17212B]">Beds:</span>
            {[undefined, 3, 4, 5].map((b) => (
              <button
                key={b || "any"}
                onClick={() => onChange({ ...filters, bedrooms: b })}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  filters.bedrooms === b
                    ? "bg-[#C7A76C] text-white shadow"
                    : "bg-[#F7F5F0] text-[#17212B] border border-[#E7E5DF] hover:bg-[#E7E5DF]"
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
            className="px-4 py-2 rounded-xl border border-[#123B5D]/30 bg-[#F7F5F0] hover:bg-[#E7E5DF] text-xs font-bold text-[#17212B] flex items-center gap-2 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#123B5D]" />
            <span>More Filters</span>
          </button>
          <button
            onClick={onReset}
            className="text-xs font-bold text-[#123B5D] hover:text-[#C65A52] transition-colors underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-[#E7E5DF] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-[#17212B] mb-1">Max Budget</label>
            <select
              value={filters.maxPrice || "all"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value === "all" ? undefined : Number(e.target.value),
                })
              }
              className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-2 text-xs font-bold text-[#17212B]"
            >
              <option value="all">Any Price</option>
              <option value="10000000">Under ₹1 Cr</option>
              <option value="20000000">Under ₹2 Cr</option>
              <option value="50000000">Under ₹5 Cr</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17212B] mb-1">Facing</label>
            <select
              value={filters.facing || "all"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  facing: e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className="w-full bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl p-2 text-xs font-bold text-[#17212B]"
            >
              <option value="all">Any Facing</option>
              <option value="East">East</option>
              <option value="North">North</option>
              <option value="East-North">East-North Corner</option>
              <option value="South-East">South-East</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 text-xs font-bold text-[#17212B] cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.verifiedOnly}
                onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
                className="rounded border-[#53606C] text-[#123B5D] focus:ring-[#123B5D]"
              />
              <span>Verified Only</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#17212B] cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.featuredOnly}
                onChange={(e) => onChange({ ...filters, featuredOnly: e.target.checked })}
                className="rounded border-[#53606C] text-[#123B5D] focus:ring-[#123B5D]"
              />
              <span>Featured Only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
