"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { MapControls } from "@/components/MapControls";
import { PlaceDetail } from "@/components/PlaceDetail";
import { AddLocationModal } from "@/components/AddLocationModal";
import { AddPersonModal } from "@/components/AddPersonModal";
import { PersonDetailPanel } from "@/components/PersonDetailPanel";
import { BusinessProfileButton } from "@/components/BusinessProfileButton";
import { AddBusinessModal } from "@/components/AddBusinessModal";
import { BusinessDetailPanel } from "@/components/BusinessDetailPanel";
import { AdminPanel } from "@/components/AdminPanel";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/data";
import type { LocationData, BusinessProfile, BusinessReview, ReviewData, PersonData } from "@/lib/types";
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
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [addingLocation, setAddingLocation] = useState(false);
  const [addingPerson, setAddingPerson] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedLocationIds, setSavedLocationIds] = useState<Set<string>>(new Set());
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [pendingPersonCoords, setPendingPersonCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  // Load data from MongoDB on mount
  useEffect(() => {
    fetch("/api/locations").then(r => r.json()).then(setLocations).catch(() => {});
    fetch("/api/businesses").then(r => r.json()).then(setBusinesses).catch(() => {});
    fetch("/api/persons").then(r => r.json()).then(setPersons).catch(() => {});
    fetch("/api/auth/check").then(r => r.json()).then(d => setIsAdmin(d.authenticated)).catch(() => {});
  }, []);

  // Check URL for shared location/person on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locId = params.get("loc");
    const personId = params.get("person");
    if (locId) {
      const loc = locations.find(l => l.id === locId);
      if (loc) {
        setCenter([loc.lat, loc.lng]);
        setZoom(14);
        setSelectedLocation(loc);
        window.history.replaceState({}, "", window.location.pathname);
      }
    } else if (personId) {
      const p = persons.find(pr => pr.id === personId);
      if (p) {
        setCenter([p.lat, p.lng]);
        setZoom(14);
        setSelectedPerson(p);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [locations, persons]);

  const showStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2500);
  }, []);

  const handleSelectLocation = useCallback((loc: LocationData) => {
    setCenter([loc.lat, loc.lng]);
    setZoom(14);
    setSelectedLocation(loc);
    setSelectedPerson(null);
  }, []);

  const handleSelectPerson = useCallback((p: PersonData) => {
    setCenter([p.lat, p.lng]);
    setZoom(14);
    setSelectedPerson(p);
    setSelectedLocation(null);
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
    } else if (addingPerson) {
      setPendingPersonCoords({ lat, lng });
      setShowAddPerson(true);
      setAddingPerson(false);
    }
  }, [addingLocation, addingPerson]);

  const handleSaveLocation = useCallback((loc: LocationData) => {
    fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loc),
    }).then(r => r.json()).then((saved) => {
      setLocations((prev) => [...prev, saved]);
      showStatus(`"${loc.name}" added!`);
      setCenter([loc.lat, loc.lng]);
      setZoom(14);
    }).catch(() => showStatus("Failed to save location"));
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

  const handleShareLocation = useCallback((locId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?loc=${locId}`;
    navigator.clipboard.writeText(url).then(() => {
      showStatus("Link copied!");
    }).catch(() => {
      showStatus("Failed to copy link");
    });
  }, [showStatus]);

  const handleSaveBusiness = useCallback((biz: BusinessProfile) => {
    fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(biz),
    }).then(r => r.json()).then((saved) => {
      setBusinesses((prev) => [...prev, saved]);
      showStatus(`"${biz.name}" created! Pending approval.`);
    }).catch(() => showStatus("Failed to save business"));
  }, [showStatus]);

  const handleApproveBusiness = useCallback((bizId: string) => {
    fetch(`/api/businesses/${bizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    }).then(() => {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === bizId ? { ...b, approved: true } : b))
      );
      showStatus("Business approved!");
    }).catch(() => showStatus("Failed to approve"));
  }, [showStatus]);

  const handleRejectBusiness = useCallback((bizId: string) => {
    fetch(`/api/businesses/${bizId}`, { method: "DELETE" }).then(() => {
      setBusinesses((prev) => prev.filter((b) => b.id !== bizId));
      showStatus("Business rejected");
    }).catch(() => showStatus("Failed to reject"));
  }, [showStatus]);

  const handleToggleImportant = useCallback((bizId: string) => {
    const biz = businesses.find(b => b.id === bizId);
    if (!biz) return;
    fetch(`/api/businesses/${bizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ important: !biz.important }),
    }).then(() => {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === bizId ? { ...b, important: !b.important } : b))
      );
    }).catch(() => {});
  }, [businesses]);

  const handleSavePerson = useCallback((person: PersonData) => {
    fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    }).then(r => r.json()).then((saved) => {
      setPersons((prev) => [...prev, saved]);
      showStatus(`"${person.name}" added!`);
      setCenter([person.lat, person.lng]);
      setZoom(14);
    }).catch(() => showStatus("Failed to save person"));
  }, [showStatus]);

  const handleAddBusinessReview = useCallback((bizId: string, review: BusinessReview) => {
    fetch(`/api/businesses/${bizId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    }).then(() => {
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
    }).catch(() => showStatus("Failed to add review"));
  }, [showStatus]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 1, 18)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 1, 3)), []);

  const handleAddLocationReview = useCallback((locId: string, review: ReviewData) => {
    fetch(`/api/locations/${locId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    }).then(() => {
      setLocations((prev) =>
        prev.map((l) => {
          if (l.id !== locId) return l;
          const newReviews = [...(l.reviews || []), review];
          const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
          return { ...l, reviews: newReviews, rating: Math.round(avgRating * 10) / 10 };
        })
      );
      setSelectedLocation((prev) => {
        if (!prev || prev.id !== locId) return prev;
        const newReviews = [...(prev.reviews || []), review];
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...prev, reviews: newReviews, rating: Math.round(avgRating * 10) / 10 };
      });
      showStatus("Review added!");
    }).catch(() => showStatus("Failed to add review"));
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
          persons={persons}
          onLocationClick={handleSelectLocation}
          onPersonClick={handleSelectPerson}
          onMapClick={handleMapClick}
          addingLocation={addingLocation}
          addingPerson={addingPerson}
          savedLocationIds={savedLocationIds}
        />
      </div>

      {/* Search bar */}
      <SearchBar
        locations={locations}
        persons={persons}
        popularSearches={[]}
        onSelect={handleSelectLocation}
        onSelectPerson={handleSelectPerson}
        onSearch={handleSearch}
      />

      {/* Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        isAdmin={isAdmin}
        addingLocation={addingLocation}
        onToggleAddLocation={() => {
          if (!addingLocation) showStatus("Click anywhere on the map to place a location pin");
          setAddingLocation((v) => !v);
        }}
      />



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
            <div className="glass-strong rounded-full px-6 py-3 gold-border shimmer flex items-center gap-3">
              <span className="text-sm font-semibold gold-text">
                Click on the map to place a pin
              </span>
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>or</span>
              <button
                onClick={() => { setShowAddModal(true); setAddingLocation(false); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                style={{ background: "var(--color-gold)", color: "#000" }}
              >
                Enter Address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Business profile button (top-right) */}
      <BusinessProfileButton
        businesses={businesses}
        persons={persons}
        onAddBusiness={() => setShowAddBusiness(true)}
        onAddPerson={() => setShowAddPerson(true)}
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
        onSelectPerson={handleSelectPerson}
        onOpenAdmin={() => {
          if (isAdmin) {
            setShowAdminPanel(true);
          } else {
            setShowAdminLogin(true);
          }
        }}
        isAdmin={isAdmin}
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

      {/* Admin panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        businesses={businesses}
        onApprove={handleApproveBusiness}
        onReject={handleRejectBusiness}
        onToggleImportant={handleToggleImportant}
      />

      {/* Place detail */}
      <PlaceDetail
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onAddReview={handleAddLocationReview}
        onSave={handleToggleSaveLocation}
        onShare={handleShareLocation}
        isSaved={selectedLocation ? savedLocationIds.has(selectedLocation.id) : false}
      />

      {/* Add location modal */}
      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setPendingCoords(null); }}
        onSave={handleSaveLocation}
        pendingCoords={pendingCoords}
      />

      {/* Add person modal */}
      <AddPersonModal
        isOpen={showAddPerson}
        onClose={() => { setShowAddPerson(false); setPendingPersonCoords(null); }}
        onSave={handleSavePerson}
        pendingCoords={pendingPersonCoords}
      />

      {/* Person detail panel */}
      <PersonDetailPanel
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSave={(personId) => {
          setSavedLocationIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(personId)) {
              newSet.delete(personId);
              showStatus("Person unsaved");
            } else {
              newSet.add(personId);
              showStatus("Person saved!");
            }
            return newSet;
          });
        }}
        onShare={(personId) => {
          const url = `${window.location.origin}${window.location.pathname}?person=${personId}`;
          navigator.clipboard.writeText(url).then(() => showStatus("Link copied!")).catch(() => showStatus("Failed to copy"));
        }}
        onDelete={(personId) => {
          fetch(`/api/persons/${personId}`, { method: "DELETE" })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then(() => {
              setPersons((prev) => prev.filter((p) => p.id !== personId));
              setSelectedPerson(null);
              showStatus("Person deleted");
            })
            .catch(() => showStatus("Failed to delete person"));
        }}
        isSaved={selectedPerson ? savedLocationIds.has(selectedPerson.id) : false}
        isAdmin={isAdmin}
        onShowStatus={showStatus}
      />

      {/* Admin login modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setShowAdminLogin(false);
          setShowAdminPanel(true);
          showStatus("Logged in as admin");
        }}
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
