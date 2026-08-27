import React, { useState } from "react";
import { SlidersHorizontal, MapPin, RotateCcw } from "lucide-react";
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
    <div className="bg-white rounded-2xl border border-[#E7E5DF] p-3 sm:p-4 shadow-md mb-6">
      {/* Scrollable Filter Ribbon for Mobile / Flex Row for Desktop */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap sm:justify-between">
        {/* Purpose Buttons (Buy / Rent) */}
        <div className="flex items-center bg-[#F7F5F0] p-1 rounded-xl border border-[#E7E5DF] shrink-0">
          <button
            onClick={() => handlePurposeChange(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              !filters.purpose ? "bg-[#123B5D] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handlePurposeChange("sale")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              filters.purpose === "sale" ? "bg-[#123B5D] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => handlePurposeChange("rent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              filters.purpose === "rent" ? "bg-[#123B5D] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Rent
          </button>
        </div>

        {/* Type Buttons (Villa / Plot) */}
        <div className="flex items-center bg-[#F7F5F0] p-1 rounded-xl border border-[#E7E5DF] shrink-0">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              !filters.type ? "bg-[#17212B] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => handleTypeChange("villa")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              filters.type === "villa" ? "bg-[#17212B] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Villas
          </button>
          <button
            onClick={() => handleTypeChange("plot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
              filters.type === "plot" ? "bg-[#17212B] text-white shadow-sm" : "text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            Plots
          </button>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-1.5 bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl px-2.5 py-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#C7A76C] shrink-0" />
          <select
            value={filters.city || "all"}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#17212B] focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">All Locations</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Ooty">Ooty</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>

        {/* Bedroom Filter (Desktop) */}
        {filters.type !== "plot" && (
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#17212B]">Beds:</span>
            {[undefined, 3, 4, 5].map((b) => (
              <button
                key={b || "any"}
                onClick={() => onChange({ ...filters, bedrooms: b })}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  filters.bedrooms === b
                    ? "bg-[#C7A76C] text-[#17212B] shadow"
                    : "bg-[#F7F5F0] text-[#17212B] border border-[#E7E5DF] hover:bg-[#E7E5DF]"
                }`}
              >
                {b ? `${b}+` : "Any"}
              </button>
            ))}
          </div>
        )}

        {/* More Filters Toggle */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              mobileFiltersOpen
                ? "bg-[#123B5D] text-white border-[#123B5D]"
                : "border-[#123B5D]/30 bg-[#F7F5F0] text-[#17212B] hover:bg-[#E7E5DF]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Filters</span>
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-xs font-bold text-[#123B5D] hover:bg-[#E7E5DF] transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="mt-3 pt-3 border-t border-[#E7E5DF] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
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

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#17212B] cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.verifiedOnly}
                onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
                className="rounded border-[#53606C] text-[#123B5D] focus:ring-[#123B5D]"
              />
              <span>Verified</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#17212B] cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.featuredOnly}
                onChange={(e) => onChange({ ...filters, featuredOnly: e.target.checked })}
                className="rounded border-[#53606C] text-[#123B5D] focus:ring-[#123B5D]"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
