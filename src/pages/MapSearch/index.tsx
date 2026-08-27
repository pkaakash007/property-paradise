import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import MapView from "../../components/property/MapView";
import PropertyCard from "../../components/property/PropertyCard";
import type { Property, BoundingBox } from "../../types/property";
import { getProperties, getPropertiesInMapBounds } from "../../lib/api";

export default function MapSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data);
      if (data.length > 0) setSelectedPropertyId(data[0].id);
    });
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const handleBoundsChange = (bounds: BoundingBox) => {
    getPropertiesInMapBounds(bounds).then((data) => setProperties(data));
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-porcelain">
      <Header />

      <main className="flex-1 relative">
        <MapView
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onPropertySelect={(id) => setSelectedPropertyId(id)}
          onBoundsChange={handleBoundsChange}
        />

        {/* Floating Property Card Carousel at bottom */}
        {selectedProperty && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm sm:max-w-md px-4 animate-slideUp">
            <PropertyCard property={selectedProperty} />
          </div>
        )}
      </main>
    </div>
  );
}
