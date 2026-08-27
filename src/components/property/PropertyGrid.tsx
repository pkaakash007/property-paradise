import React from "react";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "../ui/Skeleton";
import type { Property } from "../../types/property";
import { Building2 } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  hoveredPropertyId?: string | null;
  onPropertyHover?: (id: string | null) => void;
  onResetFilters?: () => void;
}

export default function PropertyGrid({
  properties,
  loading,
  hoveredPropertyId,
  onPropertyHover,
  onResetFilters,
}: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <PropertyCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E5DF] p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#53606C] mx-auto mb-4">
          <Building2 className="w-8 h-8 text-[#123B5D]" />
        </div>
        <h3 className="text-xl font-bold text-[#17212B] mb-2 font-serif">
          Nothing matches these filters
        </h3>
        <p className="text-[#53606C] text-sm mb-6 leading-relaxed">
          Try widening your budget range, changing location, or selecting another property type.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#123B5D] text-white text-sm font-semibold hover:bg-[#17212B] shadow transition-all"
          >
            Adjust Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isHovered={hoveredPropertyId === property.id}
          onHover={onPropertyHover}
        />
      ))}
    </div>
  );
}
