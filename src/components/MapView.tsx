"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationData, PersonData } from "@/lib/types";

// Custom marker icons
function createMarkerIcon(color: string) {
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

const goldIcon = createMarkerIcon("#c8a84e");
const blueIcon = createMarkerIcon("#0a84ff");
const redIcon = createMarkerIcon("#ff3b30");
const purpleIcon = createMarkerIcon("#af52de"); // Important - unused for now
const cyanIcon = createMarkerIcon("#06b6d4"); // Person marker

// Minimum zoom level to show markers when there are 200+ locations
const MIN_ZOOM_FOR_MARKERS = 8;

interface MapViewProps {
  center: [number, number];
  zoom: number;
  locations: LocationData[];
  persons?: PersonData[];
  onLocationClick?: (loc: LocationData) => void;
  onPersonClick?: (person: PersonData) => void;
  onMapClick?: (lat: number, lng: number) => void;
  addingLocation?: boolean;
  addingPerson?: boolean;
  savedLocationIds?: Set<string>;
}

function MapEvents({ onMapClick, addingLocation, addingPerson }: { onMapClick?: (lat: number, lng: number) => void; addingLocation?: boolean; addingPerson?: boolean }) {
  useMapEvents({
    click(e) {
      if ((addingLocation || addingPerson) && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Close popups on Escape key
function EscapeHandler() {
  const map = useMap();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        map.closePopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [map]);
  
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevZoom = useRef(zoom);
  
  useEffect(() => {
    // Slower animation when zooming out (dezoom)
    const isZoomingOut = zoom < prevZoom.current;
    const duration = isZoomingOut ? 1.4 : 1.0;
    prevZoom.current = zoom;
    
    map.flyTo(center, zoom, { 
      duration,
      easeLinearity: 0.25,
    });
  }, [map, center, zoom]);
  return null;
}

// Component to track zoom and bounds, filter visible markers
function ZoomAwareMarkers({ 
  locations, 
  onLocationClick, 
  requireZoom,
  savedLocationIds 
}: { 
  locations: LocationData[]; 
  onLocationClick?: (loc: LocationData) => void;
  requireZoom: boolean;
  savedLocationIds: Set<string>;
}) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState(map.getBounds());

  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
      setBounds(map.getBounds());
    },
    moveend: () => {
      setBounds(map.getBounds());
    },
  });

  // Filter locations: if requireZoom is true, only show when zoomed in enough and in viewport
  // BUT always show saved locations regardless of zoom
  const visibleLocations = useMemo(() => {
    if (!requireZoom) return locations;
    
    // Always show saved locations + locations in viewport when zoomed in
    return locations.filter(loc => {
      // Always show saved locations
      if (savedLocationIds.has(loc.id)) return true;
      // Show others only when zoomed in enough and in viewport
      if (currentZoom < MIN_ZOOM_FOR_MARKERS) return false;
      return bounds.contains([loc.lat, loc.lng]);
    });
  }, [locations, requireZoom, currentZoom, bounds, savedLocationIds]);

  return (
    <>
      {visibleLocations.map((loc) => {
        const isSaved = savedLocationIds.has(loc.id);
        let icon = blueIcon;
        if (isSaved) icon = redIcon;
        else if (loc.important) icon = purpleIcon;
        else if (loc.featured) icon = goldIcon;
        
        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={icon}
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
                {loc.rating ? (
                  <div style={{ fontSize: 12, marginTop: 4, color: "#d4b85c" }}>
                    {"★".repeat(Math.floor(loc.rating))} {loc.rating}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, marginTop: 4, color: "#8e8e93" }}>Unreviewed</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// Zoom-aware person markers - same behavior as locations
function ZoomAwarePersonMarkers({ 
  persons, 
  onPersonClick,
  requireZoom,
  savedIds 
}: { 
  persons: PersonData[]; 
  onPersonClick?: (person: PersonData) => void;
  requireZoom: boolean;
  savedIds: Set<string>;
}) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState(map.getBounds());

  useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
      setBounds(map.getBounds());
    },
    moveend: () => {
      setBounds(map.getBounds());
    },
  });

  const visiblePersons = useMemo(() => {
    if (!requireZoom) return persons;
    
    return persons.filter(p => {
      if (savedIds.has(p.id)) return true;
      if (currentZoom < MIN_ZOOM_FOR_MARKERS) return false;
      return bounds.contains([p.lat, p.lng]);
    });
  }, [persons, requireZoom, currentZoom, bounds, savedIds]);

  return (
    <>
      {visiblePersons.map((p) => {
        const isSaved = savedIds.has(p.id);
        const icon = isSaved ? redIcon : (p.important ? purpleIcon : cyanIcon);
        
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onPersonClick?.(p),
            }}
          >
            <Popup>
              <div style={{ padding: "12px 16px", minWidth: 180, background: "#26262a", color: "#f0f0f2" }}>
                {p.imageUrl && (
                  <div style={{
                    width: "100%", height: 100, borderRadius: 12,
                    overflow: "hidden", marginBottom: 8
                  }}>
                    <img src={p.imageUrl} alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ fontWeight: 600, fontSize: 14, color: isSaved ? "#ff3b30" : "#06b6d4" }}>{p.name}</div>
                {p.reason && (
                  <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{p.reason}</div>
                )}
                {p.rating ? (
                  <div style={{ fontSize: 12, marginTop: 4, color: "#d4b85c" }}>
                    {"★".repeat(Math.floor(p.rating))} {p.rating}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, marginTop: 4, color: "#8e8e93" }}>Unreviewed</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export function MapView({
  center,
  zoom,
  locations,
  persons = [],
  onLocationClick,
  onPersonClick,
  onMapClick,
  addingLocation,
  addingPerson,
  savedLocationIds = new Set(),
}: MapViewProps) {
  // Check once if we need zoom-to-reveal mode (200+ items)
  const [requireZoom] = useState(() => locations.length >= 200);
  const [requireZoomPersons] = useState(() => persons.length >= 200);

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
      minZoom={3}
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1.0}
      style={{ cursor: (addingLocation || addingPerson) ? "crosshair" : "grab", background: "#1a1a1d" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
        keepBuffer={8}
        updateWhenZooming={false}
        updateWhenIdle={false}
      />
      <ChangeView center={center} zoom={zoom} />
      <MapEvents onMapClick={onMapClick} addingLocation={addingLocation} addingPerson={addingPerson} />
      <EscapeHandler />
      <ZoomAwareMarkers 
        locations={locations} 
        onLocationClick={onLocationClick} 
        requireZoom={requireZoom}
        savedLocationIds={savedLocationIds}
      />
      <ZoomAwarePersonMarkers 
        persons={persons} 
        onPersonClick={onPersonClick} 
        requireZoom={requireZoomPersons}
        savedIds={savedLocationIds}
      />
    </MapContainer>
  );
}
