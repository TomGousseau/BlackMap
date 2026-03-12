"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationData } from "@/lib/types";

// Custom gold marker icon
function createMarkerIcon(isGold = false) {
  const color = isGold ? "#c8a84e" : "#0a84ff";
  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="14" r="10" fill="${color}" fill-opacity="0.2"/>
      <circle cx="16" cy="14" r="6" fill="${color}"/>
      <circle cx="16" cy="14" r="3" fill="white"/>
      <path d="M16 20 L16 30" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="30" r="2" fill="${color}" fill-opacity="0.4"/>
    </svg>`,
  });
}

const goldIcon = createMarkerIcon(true);
const blueIcon = createMarkerIcon(false);

interface MapViewProps {
  center: [number, number];
  zoom: number;
  locations: LocationData[];
  onLocationClick?: (loc: LocationData) => void;
  onMapClick?: (lat: number, lng: number) => void;
  devMode?: boolean;
  addingLocation?: boolean;
}

function MapEvents({ onMapClick, addingLocation }: { onMapClick?: (lat: number, lng: number) => void; addingLocation?: boolean }) {
  useMapEvents({
    click(e) {
      if (addingLocation && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [map, center, zoom]);
  return null;
}

export function MapView({
  center,
  zoom,
  locations,
  onLocationClick,
  onMapClick,
  devMode,
  addingLocation,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
      preferCanvas={true}
      zoomAnimation={true}
      markerZoomAnimation={true}
      style={{ cursor: addingLocation ? "crosshair" : "grab" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <ChangeView center={center} zoom={zoom} />
      <MapEvents onMapClick={onMapClick} addingLocation={addingLocation} />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={loc.featured ? goldIcon : blueIcon}
          eventHandlers={{
            click: () => onLocationClick?.(loc),
          }}
        >
          <Popup>
            <div style={{ padding: "12px 16px", minWidth: 180, background: "#26262a", color: "#f0f0f2" }}>
              {loc.imageUrl && (
                <div style={{
                  width: "100%", height: 100, borderRadius: 12,
                  overflow: "hidden", marginBottom: 8
                }}>
                  <img src={loc.imageUrl} alt={loc.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f0f2" }}>{loc.name}</div>
              {loc.category && (
                <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{loc.category}</div>
              )}
              {loc.rating && (
                <div style={{ fontSize: 12, marginTop: 4, color: "#d4b85c" }}>
                  {"★".repeat(Math.floor(loc.rating))} {loc.rating}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
