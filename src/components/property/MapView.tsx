import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Property, BoundingBox } from "../../types/property";
import { RefreshCw, Plus, Minus, Maximize2, Layers, Route, Sun, Moon, Globe, Eye } from "lucide-react";

interface MapViewProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
  onPropertySelect?: (id: string | null) => void;
  onBoundsChange?: (bounds: BoundingBox) => void;
  interactiveLocationPicker?: boolean;
  initialLat?: number;
  initialLng?: number;
  onLocationPick?: (lat: number, lng: number) => void;
  showTrackLine?: boolean;
  onToggleTrackLine?: () => void;
  onOpenStreetView?: () => void;
  isPlayingTour?: boolean;
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

type MapStyleMode = "standard" | "satellite" | "dark";

export default function MapView({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onPropertySelect,
  onBoundsChange,
  interactiveLocationPicker = false,
  initialLat = 11.0804,
  initialLng = 76.9944,
  onLocationPick,
  showTrackLine = true,
  onToggleTrackLine,
  onOpenStreetView,
  isPlayingTour = false,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const pickerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [mapMoved, setMapMoved] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MapStyleMode>("standard");
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Map Tile Sources helper
  const getStyleObject = (mode: MapStyleMode): maplibregl.StyleSpecification => {
    if (mode === "satellite") {
      return {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            ],
            tileSize: 256,
            attribution: "&copy; Google Satellite",
          },
        },
        layers: [
          {
            id: "base-tiles",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      };
    }

    if (mode === "dark") {
      return {
        version: 8,
        sources: {
          "dark-tiles": {
            type: "raster",
            tiles: [
              "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; CartoDB",
          },
        },
        layers: [
          {
            id: "base-tiles",
            type: "raster",
            source: "dark-tiles",
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      };
    }

    // Standard Google tiles default
    return {
      version: 8,
      sources: {
        "google-tiles": {
          type: "raster",
          tiles: [
            "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            "https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            "https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          ],
          tileSize: 256,
          attribution: "&copy; Google Maps",
        },
      },
      layers: [
        {
          id: "base-tiles",
          type: "raster",
          source: "google-tiles",
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const centerLat =
      properties.length > 0 && properties[0].location
        ? properties[0].location.latitude
        : initialLat;
    const centerLng =
      properties.length > 0 && properties[0].location
        ? properties[0].location.longitude
        : initialLng;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: getStyleObject(currentStyle),
      center: [centerLng, centerLat],
      zoom: 12.5,
      pitch: 0,
      attributionControl: false,
    });

    map.on("moveend", () => {
      setMapMoved(true);
    });

    map.on("click", (e: maplibregl.MapMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement;
      if (
        !target.closest(".custom-photo-marker") &&
        !target.closest(".custom-map-marker") &&
        !target.closest(".marker-hover-card")
      ) {
        if (onPropertySelect) onPropertySelect(null);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map style when changed
  const switchMapStyle = (mode: MapStyleMode) => {
    setCurrentStyle(mode);
    setShowStyleMenu(false);
    if (mapRef.current) {
      mapRef.current.setStyle(getStyleObject(mode));
    }
  };

  // Render Custom iPhone Photo Markers & Track Line
  useEffect(() => {
    const map = mapRef.current;
    if (!map || interactiveLocationPicker) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: maplibregl.Marker) => m.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    const trackCoords: [number, number][] = [];
    let validCount = 0;

    properties.forEach((prop) => {
      if (!prop.location) return;

      const { latitude, longitude } = prop.location;
      bounds.extend([longitude, latitude]);
      trackCoords.push([longitude, latitude]);
      validCount++;

      const isSelected = prop.id === selectedPropertyId || prop.id === hoveredPropertyId;

      // Create iPhone Photo Pin Marker Element
      const el = document.createElement("div");
      el.className = `custom-photo-marker ${isSelected ? "active" : ""}`;

      const imgUrl =
        prop.primaryImageUrl ||
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80";

      const locality = prop.location.locality || prop.location.city;
      const formattedPrice = formatCompactPrice(prop.price);

      el.innerHTML = `
        ${isSelected ? '<div class="radar-ring"></div>' : ''}
        <div class="marker-hover-card">
          <img src="${imgUrl}" alt="${prop.title}" class="w-full h-24 object-cover rounded-xl mb-1.5 shadow-sm" />
          <div class="text-[#123B5D] font-extrabold text-xs leading-tight line-clamp-1">${prop.title}</div>
          <div class="text-[10px] font-semibold text-[#53606C] line-clamp-1">${locality}</div>
          <div class="text-xs font-black text-[#123B5D] mt-1">${formattedPrice}</div>
        </div>
        <div class="marker-bubble">
          <div class="marker-img-wrapper">
            <img src="${imgUrl}" alt="${prop.title}" />
          </div>
          <span class="marker-price">${formattedPrice}</span>
        </div>
        <div class="marker-pin-tip"></div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onPropertySelect) onPropertySelect(prop.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([longitude, latitude])
        .addTo(map);

      markersRef.current[prop.id] = marker;
    });

    // Render / Update GeoJSON Connecting Track Line
    const updateTrackLine = () => {
      const lineFeatures: any[] = [];
      if (showTrackLine && trackCoords.length >= 2) {
        for (let i = 0; i < trackCoords.length - 1; i++) {
          lineFeatures.push({
            type: "Feature",
            properties: { id: i },
            geometry: {
              type: "LineString",
              coordinates: [trackCoords[i], trackCoords[i + 1]],
            },
          });
        }
      }

      const trackGeoJson = {
        type: "FeatureCollection" as const,
        features: lineFeatures,
      };

      const existingSource = map.getSource("track-source") as maplibregl.GeoJSONSource;
      if (existingSource) {
        existingSource.setData(trackGeoJson);
      } else {
        if (!map.isStyleLoaded()) {
          map.once("styledata", updateTrackLine);
          return;
        }

        map.addSource("track-source", {
          type: "geojson",
          data: trackGeoJson,
        });

        // Glowing outer path halo
        map.addLayer({
          id: "track-glow-layer",
          type: "line",
          source: "track-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FF2D55",
            "line-width": 8,
            "line-opacity": 0.45,
            "line-blur": 3,
          },
        });

        // Inner dashed connecting line
        map.addLayer({
          id: "track-line-layer",
          type: "line",
          source: "track-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FF3B30",
            "line-width": 4.5,
            "line-dasharray": [2, 2],
          },
        });
      }
    };

    updateTrackLine();

    if (validCount > 0 && !selectedPropertyId && !hoveredPropertyId) {
      map.fitBounds(bounds, { padding: 65, maxZoom: 14 });
    }
  }, [properties, selectedPropertyId, hoveredPropertyId, interactiveLocationPicker, showTrackLine]);

  // Handle selected or hovered property camera redirection (clean, stable 2D pan)
  useEffect(() => {
    const targetId = hoveredPropertyId || selectedPropertyId;
    if (!targetId || !mapRef.current) return;
    const prop = properties.find((p) => p.id === targetId);
    if (prop?.location) {
      mapRef.current.easeTo({
        center: [prop.location.longitude, prop.location.latitude],
        zoom: 14.5,
        pitch: 0,
        bearing: 0,
        duration: 600,
        essential: true,
      });
    }
  }, [hoveredPropertyId, selectedPropertyId, properties]);

  // Interactive location picker for admin listing editor
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !interactiveLocationPicker) return;

    if (!pickerMarkerRef.current) {
      const el = document.createElement("div");
      el.className =
        "w-9 h-9 bg-[#C65A52] border-2 border-white rounded-full shadow-2xl flex items-center justify-center text-white font-extrabold text-sm cursor-grab hover:scale-110 transition-transform";
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

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleRecenter = () => {
    if (!mapRef.current || properties.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    properties.forEach((p) => {
      if (p.location) bounds.extend([p.location.longitude, p.location.latitude]);
    });
    mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden shadow-xl border border-white/60">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating "Search this area" button */}
      {mapMoved && onBoundsChange && !interactiveLocationPicker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-in fade-in slide-in-from-top-4">
          <button
            onClick={handleSearchArea}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#123B5D]/90 backdrop-blur-xl text-white text-xs font-extrabold shadow-2xl border border-white/40 hover:bg-[#123B5D] hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Search this area</span>
          </button>
        </div>
      )}

      {/* Custom Floating iOS Glass Controls (Right Side) */}
      {!interactiveLocationPicker && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
          {/* Zoom controls card */}
          <div className="flex flex-col bg-white/85 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden text-[#17212B]">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="p-2.5 hover:bg-white hover:text-[#123B5D] transition-colors border-b border-[#E7E5DF]/60"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="p-2.5 hover:bg-white hover:text-[#123B5D] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Fit Bounds / Recenter button */}
          <button
            onClick={handleRecenter}
            aria-label="Recenter map"
            className="p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl text-[#17212B] hover:bg-white hover:text-[#123B5D] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Fit all listings on map"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Map Track Route Toggle */}
          {onToggleTrackLine && (
            <button
              onClick={onToggleTrackLine}
              aria-label="Toggle location track line"
              className={`p-2.5 rounded-2xl backdrop-blur-xl border border-white/60 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                showTrackLine
                  ? "bg-[#C7A76C] text-white"
                  : "bg-white/85 text-[#17212B] hover:bg-white"
              }`}
              title={showTrackLine ? "Hide Photo Track Line" : "Show Photo Track Line"}
            >
              <Route className="w-4 h-4" />
            </button>
          )}

          {/* 360° Street View Button */}
          {onOpenStreetView && (
            <button
              onClick={onOpenStreetView}
              aria-label="Open 360 Street View"
              className="p-2.5 rounded-2xl bg-[#007AFF] text-white backdrop-blur-xl border border-white/60 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
              title="Open 360° Street View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Map Layer Switcher Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              aria-label="Switch map style"
              className={`p-2.5 rounded-2xl backdrop-blur-xl border border-white/60 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                showStyleMenu
                  ? "bg-[#123B5D] text-white"
                  : "bg-white/85 text-[#17212B] hover:bg-white"
              }`}
              title="Change Map Style"
            >
              <Layers className="w-4 h-4" />
            </button>

            {showStyleMenu && (
              <div className="absolute right-0 top-12 w-44 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-2xl p-2 flex flex-col gap-1 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-extrabold uppercase text-[#53606C] px-2.5 py-1">
                  Map Layers
                </div>

                <button
                  onClick={() => switchMapStyle("standard")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStyle === "standard"
                      ? "bg-[#123B5D] text-white"
                      : "text-[#17212B] hover:bg-[#F7F5F0]"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#C7A76C]" />
                  <span>Standard Map</span>
                </button>

                <button
                  onClick={() => switchMapStyle("satellite")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStyle === "satellite"
                      ? "bg-[#123B5D] text-white"
                      : "text-[#17212B] hover:bg-[#F7F5F0]"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#4F7A69]" />
                  <span>Satellite Hybrid</span>
                </button>

                <button
                  onClick={() => switchMapStyle("dark")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStyle === "dark"
                      ? "bg-[#123B5D] text-white"
                      : "text-[#17212B] hover:bg-[#F7F5F0]"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#C7A76C]" />
                  <span>Dark Night</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
