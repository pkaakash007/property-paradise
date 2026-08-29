import React from "react";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "../ui/Skeleton";
import type { Property } from "../../types/property";
import { SearchX } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  hoveredPropertyId?: string | null;
  onPropertyHover?: (id: string | null) => void;
  onResetFilters?: () => void;
  cardLayout?: "grid" | "list";
  splitMode?: boolean;
}

const staggerClasses = [
  "card-stagger-1", "card-stagger-2", "card-stagger-3",
  "card-stagger-4", "card-stagger-5", "card-stagger-6",
  "card-stagger-7", "card-stagger-8", "card-stagger-9",
];

export default function PropertyGrid({
  properties,
  loading,
  hoveredPropertyId,
  onPropertyHover,
  onResetFilters,
  cardLayout = "grid",
  splitMode = false,
}: PropertyGridProps) {
  // In split mode: 2-col max; in full page: 3-col max
  const gridClass =
    cardLayout === "list"
      ? "flex flex-col gap-3"
      : splitMode
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  if (loading) {
    return (
      <div className={gridClass}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="animate-fadeInUp" style={{ animationDelay: `${n * 0.06}s` }}>
            <PropertyCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fadeInUp">
        <div className="bg-white rounded-3xl border border-[#E7E5DF] p-10 text-center max-w-sm shadow-sm space-y-4 w-full">
          <div className="w-14 h-14 rounded-2xl bg-[#123B5D]/8 flex items-center justify-center mx-auto">
            <SearchX className="w-7 h-7 text-[#123B5D]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#17212B] mb-1.5 font-serif">No Results Found</h3>
            <p className="text-[#53606C] text-sm leading-relaxed">
              Try adjusting your budget, location, or property type to find more options.
            </p>
          </div>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="w-full px-6 py-2.5 rounded-full bg-[#123B5D] text-white text-sm font-bold hover:bg-[#17212B] shadow transition-all active:scale-95"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {properties.map((property, idx) => (
        <div
          key={property.id}
          className={`animate-fadeInUp ${staggerClasses[idx % staggerClasses.length]}`}
        >
          <PropertyCard
            property={property}
            isHovered={hoveredPropertyId === property.id}
            onHover={onPropertyHover}
            layout={cardLayout}
          />
        </div>
      ))}
    </div>
  );
}
