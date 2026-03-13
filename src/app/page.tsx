"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { MapControls } from "@/components/MapControls";
import { PlaceDetail } from "@/components/PlaceDetail";
import { AddLocationModal } from "@/components/AddLocationModal";
import { BusinessProfileButton } from "@/components/BusinessProfileButton";
import { AddBusinessModal } from "@/components/AddBusinessModal";
import { BusinessDetailPanel } from "@/components/BusinessDetailPanel";
import { FEATURED_LOCATIONS, POPULAR_SEARCHES, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/data";
import type { LocationData, BusinessProfile, BusinessReview, ReviewData } from "@/lib/types";
import Lenis from "lenis";

// Dynamic import Leaflet (no SSR)
const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full" style={{ background: "var(--color-bg)" }} />
  ),
});

export default function HomePage() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [locations, setLocations] = useState<LocationData[]>(FEATURED_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [addingLocation, setAddingLocation] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [savedLocationIds, setSavedLocationIds] = useState<Set<string>>(new Set());

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  const showStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2500);
  }, []);

  const handleSelectLocation = useCallback((loc: LocationData) => {
    setCenter([loc.lat, loc.lng]);
    setZoom(14);
    setSelectedLocation(loc);
  }, []);

  const handleSearch = useCallback((query: string) => {
    const found = locations.find(
      (l) => l.name.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      handleSelectLocation(found);
    } else {
      showStatus(`No results for "${query}"`);
    }
  }, [locations, handleSelectLocation, showStatus]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (addingLocation) {
      setPendingCoords({ lat, lng });
      setShowAddModal(true);
      setAddingLocation(false);
    }
  }, [addingLocation]);

  const handleSaveLocation = useCallback((loc: LocationData) => {
    setLocations((prev) => [...prev, loc]);
    showStatus(`"${loc.name}" added!`);
    setCenter([loc.lat, loc.lng]);
    setZoom(14);
  }, [showStatus]);

  const handleToggleSaveLocation = useCallback((locId: string) => {
    setSavedLocationIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(locId)) {
        newSet.delete(locId);
        showStatus("Location unsaved");
      } else {
        newSet.add(locId);
        showStatus("Location saved!");
      }
      return newSet;
    });
  }, [showStatus]);

  const handleSaveBusiness = useCallback((biz: BusinessProfile) => {
    setBusinesses((prev) => [...prev, biz]);
    showStatus(`"${biz.name}" created!`);
  }, [showStatus]);

  const handleAddBusinessReview = useCallback((bizId: string, review: BusinessReview) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== bizId) return b;
        const newReviews = [...b.reviews, review];
        const avgRep = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...b, reviews: newReviews, reputation: Math.round(avgRep * 10) / 10 };
      })
    );
    setSelectedBusiness((prev) => {
      if (!prev || prev.id !== bizId) return prev;
      const newReviews = [...prev.reviews, review];
      const avgRep = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
      return { ...prev, reviews: newReviews, reputation: Math.round(avgRep * 10) / 10 };
    });
    showStatus("Review added!");
  }, [showStatus]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 1, 18)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 1, 3)), []);

  const handleAddLocationReview = useCallback((locId: string, review: ReviewData) => {
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id !== locId) return l;
        const newReviews = [...(l.reviews || []), review];
        return { ...l, reviews: newReviews };
      })
    );
    setSelectedLocation((prev) => {
      if (!prev || prev.id !== locId) return prev;
      const newReviews = [...(prev.reviews || []), review];
      return { ...prev, reviews: newReviews };
    });
    showStatus("Review added!");
  }, [showStatus]);

  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      showStatus("Finding your location...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          setZoom(15);
          showStatus("Location found!");
        },
        () => showStatus("Could not get location")
      );
    }
  }, [showStatus]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Brand watermark */}
      <div
        className="fixed bottom-5 left-5 z-30 select-none pointer-events-none"
      >
        <div className="text-2xl font-black tracking-tight gold-text" style={{ letterSpacing: "-0.02em" }}>
          Blackrock
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--color-gold)", opacity: 0.6 }}>
          V2
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0">
        <MapView
          center={center}
          zoom={zoom}
          locations={locations}
          onLocationClick={handleSelectLocation}
          onMapClick={handleMapClick}
          devMode={devMode}
          addingLocation={addingLocation}
          savedLocationIds={savedLocationIds}
        />
      </div>

      {/* Search bar */}
      <SearchBar
        locations={locations}
        popularSearches={POPULAR_SEARCHES}
        onSelect={handleSelectLocation}
        onSearch={handleSearch}
      />

      {/* Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        devMode={devMode}
        addingLocation={addingLocation}
        onToggleDevMode={() => {
          setDevMode((v) => !v);
          if (devMode) setAddingLocation(false);
        }}
        onToggleAddLocation={() => {
          if (!addingLocation) showStatus("Click anywhere on the map to place a pin");
          setAddingLocation((v) => !v);
        }}
      />

      {/* Dev mode indicator */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            className="fixed top-5 left-5 z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2 gold-border">
              <div className="w-2 h-2 rounded-full pulse-gold" style={{ background: "var(--color-gold)" }} />
              <span className="text-xs font-semibold gold-text">DEV MODE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adding location indicator */}
      <AnimatePresence>
        {addingLocation && (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[55]"
            style={{ x: "-50%" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="glass-strong rounded-full px-6 py-3 gold-border shimmer">
              <span className="text-sm font-semibold gold-text">
                Click on the map to place a pin
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Business profile button (top-right) */}
      <BusinessProfileButton
        businesses={businesses}
        onAddBusiness={() => setShowAddBusiness(true)}
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
      />

      {/* Business detail side panel */}
      <BusinessDetailPanel
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onAddReview={handleAddBusinessReview}
      />

      {/* Add business modal */}
      <AddBusinessModal
        isOpen={showAddBusiness}
        onClose={() => setShowAddBusiness(false)}
        onSave={handleSaveBusiness}
      />

      {/* Place detail */}
      <PlaceDetail
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onAddReview={handleAddLocationReview}
        onSave={handleToggleSaveLocation}
        isSaved={selectedLocation ? savedLocationIds.has(selectedLocation.id) : false}
      />

      {/* Add location modal */}
      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setPendingCoords(null); }}
        onSave={handleSaveLocation}
        pendingCoords={pendingCoords}
      />

      {/* Status toast */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            className="fixed top-20 left-1/2 z-[60]"
            style={{ x: "-50%" }}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
          >
            <div className="glass-strong rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ color: "var(--color-text)", boxShadow: "var(--shadow-lg)" }}>
              {statusMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
