import React, { useState } from "react";
import { SlidersHorizontal, MapPin, ChevronDown, X, Check } from "lucide-react";
import type { PropertyFilters, PropertyType } from "../../types/property";

interface SearchFiltersProps {
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
}

const activeFilterCount = (filters: PropertyFilters) => {
  let count = 0;
  if (filters.type) count++;
  if (filters.city) count++;
  if (filters.maxPrice) count++;
  if (filters.bedrooms) count++;
  if (filters.facing) count++;
  if (filters.verifiedOnly) count++;
  if (filters.featuredOnly) count++;
  return count;
};

export default function SearchFilters({ filters, onChange, onReset }: SearchFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const filterCount = activeFilterCount(filters);

  const handleTypeChange = (type?: PropertyType) => {
    onChange({ ...filters, type });
  };

  const handleCityChange = (city?: string) => {
    onChange({ ...filters, city: city === "all" ? undefined : city });
  };

  const typeOptions = [
    { label: "All Types", value: undefined },
    { label: "Villas", value: "villa" as PropertyType },
    { label: "Plots", value: "plot" as PropertyType },
  ];

  return (
    <div className="space-y-0">
      {/* Main Filter Row */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">

        {/* Type Toggle Pill */}
        <div className="flex items-center bg-[#F7F5F0] p-0.5 rounded-full border border-[#E7E5DF] shrink-0">
          {typeOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleTypeChange(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                filters.type === opt.value
                  ? "bg-[#17212B] text-white shadow"
                  : "text-[#53606C] hover:text-[#17212B]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-6 w-px bg-[#E7E5DF] shrink-0" />

        {/* Location Dropdown */}
        <div className="relative flex items-center gap-1.5 bg-[#F7F5F0] border border-[#E7E5DF] rounded-full px-3 py-1.5 shrink-0 hover:border-[#123B5D]/40 transition-colors cursor-pointer group">
          <MapPin className="w-3.5 h-3.5 text-[#C7A76C] shrink-0" />
          <select
            value={filters.city || "all"}
            onChange={(e) => handleCityChange(e.target.value)}
            className="appearance-none bg-transparent text-xs font-bold text-[#17212B] focus:outline-none cursor-pointer pr-4"
          >
            <option value="all">All Locations</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Ooty">Ooty</option>
            <option value="Erode">Erode</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#53606C] absolute right-2.5 pointer-events-none" />
        </div>

        {/* Bedrooms (Desktop) */}
        {filters.type !== "plot" && (
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-[#53606C] whitespace-nowrap">Beds:</span>
            <div className="flex items-center gap-1">
              {[undefined, 3, 4, 5].map((b) => (
                <button
                  key={b || "any"}
                  onClick={() => onChange({ ...filters, bedrooms: b })}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    filters.bedrooms === b
                      ? "bg-[#C7A76C] text-white border-[#C7A76C] shadow"
                      : "bg-[#F7F5F0] text-[#17212B] border-[#E7E5DF] hover:border-[#C7A76C]/60"
                  }`}
                >
                  {b ? `${b}+` : "Any"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* Advanced Filters Button */}
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 whitespace-nowrap ${
              advancedOpen || filterCount > 0
                ? "bg-[#123B5D] text-white border-[#123B5D] shadow"
                : "bg-[#F7F5F0] text-[#17212B] border-[#E7E5DF] hover:border-[#123B5D]/50"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-white/25 text-white rounded-full text-[10px] font-extrabold">
                {filterCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Reset Button */}
          {filterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#C65A52] border border-[#C65A52]/30 bg-red-50 hover:bg-red-100 transition-colors"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {advancedOpen && (
        <div className="pt-3 mt-2 border-t border-[#E7E5DF] animate-fadeInUp" style={{ animationDelay: "0s" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Budget */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#17212B] uppercase tracking-wide">
                Budget
              </label>
              <div className="relative">
                <select
                  value={filters.maxPrice || "all"}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      maxPrice: e.target.value === "all" ? undefined : Number(e.target.value),
                    })
                  }
                  className="w-full appearance-none bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-3 py-2.5 text-xs font-bold text-[#17212B] focus:outline-none focus:border-[#123B5D]/50 cursor-pointer pr-8"
                >
                  <option value="all">Any Price</option>
                  <option value="10000000">Under ₹1 Cr</option>
                  <option value="20000000">Under ₹2 Cr</option>
                  <option value="50000000">Under ₹5 Cr</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#53606C] pointer-events-none" />
              </div>
            </div>

            {/* Facing */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#17212B] uppercase tracking-wide">
                Facing
              </label>
              <div className="relative">
                <select
                  value={filters.facing || "all"}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      facing: e.target.value === "all" ? undefined : e.target.value,
                    })
                  }
                  className="w-full appearance-none bg-[#F7F5F0] border border-[#E7E5DF] rounded-xl px-3 py-2.5 text-xs font-bold text-[#17212B] focus:outline-none focus:border-[#123B5D]/50 cursor-pointer pr-8"
                >
                  <option value="all">Any Facing</option>
                  <option value="East">East</option>
                  <option value="North">North</option>
                  <option value="East-North">East-North Corner</option>
                  <option value="South-East">South-East</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#53606C] pointer-events-none" />
              </div>
            </div>

            {/* Special Tags */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-extrabold text-[#17212B] uppercase tracking-wide">
                Tags
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    filters.verifiedOnly
                      ? "bg-[#4F7A69] text-white border-[#4F7A69] shadow"
                      : "bg-[#F7F5F0] text-[#17212B] border-[#E7E5DF] hover:border-[#4F7A69]/50"
                  }`}
                >
                  {filters.verifiedOnly && <Check className="w-3.5 h-3.5" />}
                  ✓ Verified Only
                </button>
                <button
                  onClick={() => onChange({ ...filters, featuredOnly: !filters.featuredOnly })}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    filters.featuredOnly
                      ? "bg-[#C7A76C] text-white border-[#C7A76C] shadow"
                      : "bg-[#F7F5F0] text-[#17212B] border-[#E7E5DF] hover:border-[#C7A76C]/50"
                  }`}
                >
                  {filters.featuredOnly && <Check className="w-3.5 h-3.5" />}
                  ★ Featured Only
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
