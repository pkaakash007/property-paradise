import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Property, BoundingBox } from "../../types/property";
import { RefreshCw } from "lucide-react";

interface MapViewProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onPropertySelect?: (id: string | null) => void;
  onBoundsChange?: (bounds: BoundingBox) => void;
  interactiveLocationPicker?: boolean;
  initialLat?: number;
  initialLng?: number;
  onLocationPick?: (lat: number, lng: number) => void;
}

export function formatCompactPrice(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)}Cr`;
  }
  if (price >= 100000) {
    const l = price / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
  }
  return `₹${price}`;
}

export default function MapView({
  properties,
  selectedPropertyId,
  onPropertySelect,
  onBoundsChange,
  interactiveLocationPicker = false,
  initialLat = 11.0804,
  initialLng = 76.9944,
  onLocationPick,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const pickerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [mapMoved, setMapMoved] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Default center (Coimbatore / South India)
    const centerLat = properties.length > 0 && properties[0].location ? properties[0].location.latitude : initialLat;
    const centerLng = properties.length > 0 && properties[0].location ? properties[0].location.longitude : initialLng;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // Quiet light map style
      center: [centerLng, centerLat],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("moveend", () => {
      setMapMoved(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update listing markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || interactiveLocationPicker) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: maplibregl.Marker) => m.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    let validCount = 0;

    properties.forEach((prop) => {
      if (!prop.location) return;

      const { latitude, longitude } = prop.location;
      bounds.extend([longitude, latitude]);
      validCount++;

      // Create marker element
      const el = document.createElement("div");
      const isSelected = prop.id === selectedPropertyId;
      el.className = `custom-map-marker ${isSelected ? "active" : ""}`;
      el.innerText = formatCompactPrice(prop.price);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onPropertySelect) onPropertySelect(prop.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map);

      markersRef.current[prop.id] = marker;
    });

    if (validCount > 0 && !selectedPropertyId) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [properties, selectedPropertyId, interactiveLocationPicker]);

  // Handle selected property highlight & center
  useEffect(() => {
    if (!selectedPropertyId || !mapRef.current) return;
    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop?.location) {
      mapRef.current.easeTo({
        center: [prop.location.longitude, prop.location.latitude],
        zoom: 14,
        duration: 800,
      });
    }
  }, [selectedPropertyId, properties]);

  // Interactive picker mode for admin listing editor
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !interactiveLocationPicker) return;

    if (!pickerMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "w-7 h-7 bg-coral border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs cursor-grab";
      el.innerHTML = "📍";

      const marker = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat([initialLng, initialLat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        if (onLocationPick) onLocationPick(lngLat.lat, lngLat.lng);
      });

      map.on("click", (e: maplibregl.MapMouseEvent) => {
        marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        if (onLocationPick) onLocationPick(e.lngLat.lat, e.lngLat.lng);
      });

      pickerMarkerRef.current = marker;
    }
  }, [interactiveLocationPicker, initialLat, initialLng]);

  const handleSearchArea = () => {
    setMapMoved(false);
    if (mapRef.current && onBoundsChange) {
      const b = mapRef.current.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden shadow-inner border border-mist">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating "Search this area" button */}
      {mapMoved && onBoundsChange && !interactiveLocationPicker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <button
            onClick={handleSearchArea}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep-ocean text-white text-xs font-semibold shadow-xl border border-white/20 hover:bg-ink transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Search this area</span>
          </button>
        </div>
      )}
    </div>
  );
}
