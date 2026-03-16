"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
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

// Custom cluster icon creator - gold themed
function createClusterIcon(cluster: L.MarkerCluster, color: string = "#c8a84e") {
  const count = cluster.getChildCount();
  let size = 40;
  let fontSize = 12;
  
  if (count >= 1000) {
    size = 60;
    fontSize = 14;
  } else if (count >= 100) {
    size = 50;
    fontSize = 13;
  }
  
  return L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, ${color}40, ${color}80);
      border: 2px solid ${color};
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: ${fontSize}px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      box-shadow: 0 4px 12px ${color}60;
    ">${count >= 1000 ? Math.round(count/1000) + 'k' : count}</div>`,
    className: '',
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}

// Cluster config based on pin count
// 100+ pins = country level clustering (maxClusterRadius 80, disable at zoom 6)
// 1000+ pins = city level clustering (maxClusterRadius 120, disable at zoom 10)
function getClusterConfig(count: number) {
  if (count >= 1000) {
    return {
      maxClusterRadius: 120, // Larger radius = more aggressive grouping
      disableClusteringAtZoom: 12, // Stop clustering at city zoom
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
    };
  } else if (count >= 100) {
    return {
      maxClusterRadius: 80,
      disableClusteringAtZoom: 8, // Stop clustering at country zoom
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
    };
  }
  // Less than 100 - minimal clustering
  return {
    maxClusterRadius: 40,
    disableClusteringAtZoom: 5,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    animate: true,
  };
}

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
function ClusteredLocationMarkers({ 
  locations, 
  onLocationClick, 
  savedLocationIds 
}: { 
  locations: LocationData[]; 
  onLocationClick?: (loc: LocationData) => void;
  savedLocationIds: Set<string>;
}) {
  const clusterConfig = useMemo(() => getClusterConfig(locations.length), [locations.length]);
  
  return (
    <MarkerClusterGroup
      {...clusterConfig}
      iconCreateFunction={(cluster) => createClusterIcon(cluster, "#c8a84e")}
      chunkedLoading
    >
      {locations.map((loc) => {
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
    </MarkerClusterGroup>
  );
}

// Clustered person markers
function ClusteredPersonMarkers({ 
  persons, 
  onPersonClick,
  savedIds 
}: { 
  persons: PersonData[]; 
  onPersonClick?: (person: PersonData) => void;
  savedIds: Set<string>;
}) {
  const clusterConfig = useMemo(() => getClusterConfig(persons.length), [persons.length]);

  return (
    <MarkerClusterGroup
      {...clusterConfig}
      iconCreateFunction={(cluster) => createClusterIcon(cluster, "#06b6d4")}
      chunkedLoading
    >
      {persons.map((p) => {
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
    </MarkerClusterGroup>
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
      <ClusteredLocationMarkers 
        locations={locations} 
        onLocationClick={onLocationClick} 
        savedLocationIds={savedLocationIds}
      />
      <ClusteredPersonMarkers 
        persons={persons} 
        onPersonClick={onPersonClick} 
        savedIds={savedLocationIds}
      />
    </MapContainer>
  );
}
