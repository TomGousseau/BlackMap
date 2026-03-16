"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, ImagePlus, MapPinned, Navigation, Loader2, Plus, Trash2, MessageCircle, Youtube, Phone, Hash } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { PersonData } from "@/lib/types";

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
}

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: PersonData) => void;
  pendingCoords: { lat: number; lng: number } | null;
}

export function AddPersonModal({ isOpen, onClose, onSave, pendingCoords }: AddPersonModalProps) {
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [about, setAbout] = useState("");
  const [reason, setReason] = useState("");
  const [notableAction, setNotableAction] = useState("");
  const [workedFor, setWorkedFor] = useState("");
  // Social links
  const [discord, setDiscord] = useState("");
  const [youtube, setYoutube] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [phone, setPhone] = useState("");

  // Location input mode
  const [locationMode, setLocationMode] = useState<"address" | "coords">("address");
  const [locationAddress, setLocationAddress] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [geocodedCoords, setGeocodedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get final coordinates
  const finalCoords = pendingCoords || geocodedCoords || 
    (manualLat && manualLng ? { lat: parseFloat(manualLat), lng: parseFloat(manualLng) } : null);

  // Debounced address search for suggestions
  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { "User-Agent": "BlackrockMaps/1.0" } }
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data || []);
      setShowSuggestions(data.length > 0);
      if (data.length === 0 && query.trim().length > 5) {
        setGeocodeError("No results found");
      }
    } catch {
      setGeocodeError("Search failed");
    }
    setGeocoding(false);
  }, []);

  // Debounce address input
  useEffect(() => {
    setGeocodedCoords(null);
    setGeocodeError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(locationAddress);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [locationAddress, searchAddress]);

  // Select a suggestion
  const selectSuggestion = (result: NominatimResult) => {
    setGeocodedCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setLocationAddress(result.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!name.trim() || !finalCoords) return;
    const validImages = imageUrls.filter(url => url.trim());
    onSave({
      id: `person-${Date.now()}`,
      name: name.trim(),
      lat: finalCoords.lat,
      lng: finalCoords.lng,
      imageUrl: validImages[0] || undefined,
      imageUrls: validImages.length > 1 ? validImages : undefined,
      about: about.trim() || undefined,
      reason: reason.trim() || undefined,
      notableAction: notableAction.trim() || undefined,
      workedFor: workedFor.trim() || undefined,
      discord: discord.trim() || undefined,
      youtube: youtube.trim() || undefined,
      discordId: discordId.trim() || undefined,
      phone: phone.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    // Reset
    setName(""); setImageUrls([""]); setAbout("");
    setReason(""); setNotableAction(""); setWorkedFor("");
    setDiscord(""); setYoutube(""); setDiscordId(""); setPhone("");
    setLocationAddress(""); setManualLat(""); setManualLng("");
    setGeocodedCoords(null); setLocationMode("address"); setGeocodeError("");
    setSuggestions([]); setShowSuggestions(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[80] w-full max-w-lg px-4"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ scale: 0.9, opacity: 0, y: "-45%" }}
            animate={{ scale: 1, opacity: 1, y: "-50%" }}
            exit={{ scale: 0.9, opacity: 0, y: "-45%" }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
          >
            <div className="glass-strong rounded-3xl overflow-hidden max-h-[85vh] flex flex-col" style={{ boxShadow: "var(--shadow-lg)" }}>
              {/* Cyan top bar for person */}
              <div className="h-1.5 shrink-0" style={{ background: "linear-gradient(90deg, #06b6d4, #22d3ee, #67e8f9)" }} />
              
              <div className="p-6 overflow-y-auto" data-lenis-prevent>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                      <User size={20} style={{ color: "#06b6d4" }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: "#06b6d4" }}>Add Person</h2>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "var(--color-surface-hover)" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} style={{ color: "var(--color-text-secondary)" }} />
                  </motion.button>
                </div>

                {/* Location input - show if no pendingCoords from map click */}
                {!pendingCoords && (
                  <div className="mb-5">
                    <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--color-text-secondary)" }}>
                      Location *
                    </label>
                    {/* Mode toggle */}
                    <div className="flex items-center gap-2 mb-3">
                      <motion.button
                        onClick={() => setLocationMode("address")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                        style={{
                          background: locationMode === "address" ? "#06b6d4" : "var(--color-surface)",
                          color: locationMode === "address" ? "#000" : "var(--color-text-secondary)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPinned size={12} />
                        Address
                      </motion.button>
                      <motion.button
                        onClick={() => setLocationMode("coords")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                        style={{
                          background: locationMode === "coords" ? "#06b6d4" : "var(--color-surface)",
                          color: locationMode === "coords" ? "#000" : "var(--color-text-secondary)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Navigation size={12} />
                        Coordinates
                      </motion.button>
                    </div>

                    {locationMode === "address" ? (
                      <div className="relative" ref={suggestionsRef}>
                        <div className="relative">
                          <input
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            placeholder="Start typing an address..."
                            className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm outline-none"
                            style={{
                              background: "var(--color-surface)",
                              color: "var(--color-text)",
                              border: geocodedCoords ? "1px solid #06b6d4" : "1px solid var(--color-border)",
                            }}
                          />
                          {geocoding && (
                            <motion.div
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 size={14} style={{ color: "#06b6d4" }} />
                            </motion.div>
                          )}
                        </div>

                        {/* Suggestions dropdown */}
                        <AnimatePresence>
                          {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                              className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden z-10"
                              style={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                              }}
                              initial={{ opacity: 0, y: -4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div className="py-1 max-h-[200px] overflow-y-auto" data-lenis-prevent>
                                {suggestions.map((result, idx) => (
                                  <motion.button
                                    key={result.place_id}
                                    onClick={() => selectSuggestion(result)}
                                    className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left cursor-pointer transition-colors"
                                    style={{ borderBottom: idx < suggestions.length - 1 ? "1px solid var(--color-border)" : "none" }}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15, delay: idx * 0.04 }}
                                    whileHover={{ background: "var(--color-surface-hover)" }}
                                  >
                                    <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: "#06b6d4" }} />
                                    <span className="text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>
                                      {result.display_name}
                                    </span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          placeholder="Latitude"
                          type="number"
                          step="any"
                          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                        <input
                          value={manualLng}
                          onChange={(e) => setManualLng(e.target.value)}
                          placeholder="Longitude"
                          type="number"
                          step="any"
                          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                    )}

                    {geocodeError && (
                      <p className="text-xs mt-2" style={{ color: "#ff6961" }}>{geocodeError}</p>
                    )}
                  </div>
                )}

                {/* Coords badge */}
                {finalCoords && (
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                      style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
                      <MapPin size={11} style={{ color: "#06b6d4" }} />
                      {finalCoords.lat.toFixed(4)}, {finalCoords.lng.toFixed(4)}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name - Required */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Name *
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  </div>

                  {/* Multiple Image URLs */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Pictures <span className="text-[10px] font-normal">(optional, needs approval)</span>
                    </label>
                    <div className="space-y-2">
                      {imageUrls.map((url, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="relative flex-1">
                            <ImagePlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: "var(--color-text-secondary)" }} />
                            <input
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...imageUrls];
                                newUrls[idx] = e.target.value;
                                setImageUrls(newUrls);
                              }}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none"
                              style={{
                                background: "var(--color-surface)",
                                color: "var(--color-text)",
                                border: "1px solid var(--color-border)",
                              }}
                            />
                          </div>
                          {imageUrls.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                              style={{ background: "var(--color-surface)" }}
                              whileHover={{ scale: 1.05, background: "#ff3b30" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 size={14} style={{ color: "var(--color-text-secondary)" }} />
                            </motion.button>
                          )}
                        </div>
                      ))}
                      <motion.button
                        type="button"
                        onClick={() => setImageUrls([...imageUrls, ""])}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                        style={{ background: "var(--color-surface)", color: "#06b6d4" }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus size={12} />
                        Add another picture
                      </motion.button>
                    </div>
                    {/* Preview thumbnails */}
                    {imageUrls.filter(u => u.trim()).length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {imageUrls.filter(u => u.trim()).map((url, idx) => (
                          <motion.div
                            key={idx}
                            className="h-16 w-16 rounded-lg overflow-hidden"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Links Section */}
                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--color-text-secondary)" }}>
                      Social Links <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <div className="space-y-2">
                      {/* Discord Username */}
                      <div className="relative">
                        <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "#5865F2" }} />
                        <input
                          value={discord}
                          onChange={(e) => setDiscord(e.target.value)}
                          placeholder="Discord username"
                          className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                      {/* Discord ID */}
                      <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "#5865F2" }} />
                        <input
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          placeholder="Discord ID (numbers)"
                          className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                      {/* YouTube */}
                      <div className="relative">
                        <Youtube size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "#FF0000" }} />
                        <input
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          placeholder="YouTube channel URL"
                          className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                      {/* Phone */}
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "#34C759" }} />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      About <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Brief bio..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Reason <span className="text-[10px] font-normal">(why they're notable)</span>
                    </label>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Founded a tech company"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  </div>

                  {/* Notable Action */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Notable Action <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <input
                      value={notableAction}
                      onChange={(e) => setNotableAction(e.target.value)}
                      placeholder="e.g. Invented the smartphone"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  </div>

                  {/* Worked For */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Worked For <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <input
                      value={workedFor}
                      onChange={(e) => setWorkedFor(e.target.value)}
                      placeholder="e.g. Apple, Google, Tesla"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  </div>

                  {/* Save button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={!name.trim() || !finalCoords}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40 mt-2 mb-1"
                    style={{
                      background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                      boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Person
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
