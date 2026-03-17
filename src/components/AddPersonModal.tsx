"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, ImagePlus, MapPinned, Navigation, Loader2, Plus, Trash2, MessageCircle, Youtube, Phone, Hash, Send, Globe, Gamepad2, Github, Flag, Users, ChevronDown, PenTool, Calendar, FileText, Star, Briefcase } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { PersonData } from "@/lib/types";
import { getNationalitySuggestions } from "@/lib/flags";

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
  editMode?: boolean;
  personToEdit?: PersonData | null;
  selectedStatus?: 'Updated' | 'Terminated' | 'Outdated';
  defaultSignature?: string;
}

export function AddPersonModal({ isOpen, onClose, onSave, pendingCoords, editMode = false, personToEdit, selectedStatus, defaultSignature = "" }: AddPersonModalProps) {
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
  const [telegram, setTelegram] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [vk, setVk] = useState("");
  const [github, setGithub] = useState("");
  const [steam, setSteam] = useState("");
  const [website, setWebsite] = useState("");
  const [nationality, setNationality] = useState("");
  const [relations, setRelations] = useState<{ name: string; imageUrl?: string }[]>([]);
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [newRelationName, setNewRelationName] = useState("");
  const [newRelationImage, setNewRelationImage] = useState("");
  const [age, setAge] = useState("");
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [signature, setSignature] = useState("");

  // URL Validation functions
  const isValidUrl = (url: string, domain: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional field)
    const trimmed = url.trim().toLowerCase();
    // Accept: domain.com/..., www.domain.com/..., http(s)://domain.com/..., http(s)://www.domain.com/...
    const pattern = new RegExp(`^(https?:\\/\\/)?(www\\.)?${domain.replace('.', '\\.')}`);
    return pattern.test(trimmed);
  };
  
  const youtubeError = youtube.trim() && !isValidUrl(youtube, 'youtube.com');
  const vkError = vk.trim() && !isValidUrl(vk, 'vk.com');
  const githubError = github.trim() && !isValidUrl(github, 'github.com');
  const steamError = steam.trim() && !isValidUrl(steam, 'steamcommunity.com');
  const hasSocialErrors = youtubeError || vkError || githubError || steamError;

  // Pre-fill signature with default when opening (not editing)
  useEffect(() => {
    if (isOpen && !editMode && defaultSignature) {
      setSignature(defaultSignature);
    }
  }, [isOpen, editMode, defaultSignature]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editMode && personToEdit) {
      setName(personToEdit.name || "");
      setImageUrls(personToEdit.imageUrls?.length ? personToEdit.imageUrls : [personToEdit.imageUrl || ""]);
      setAbout(personToEdit.about || "");
      setReason(personToEdit.reason || "");
      setNotableAction(personToEdit.notableAction || "");
      setWorkedFor(personToEdit.workedFor || "");
      setDiscord(personToEdit.discord || "");
      setYoutube(personToEdit.youtube || "");
      setDiscordId(personToEdit.discordId || "");
      setPhone(personToEdit.phone || "");
      setTelegram(personToEdit.telegram || "");
      setTelegramId(personToEdit.telegramId || "");
      setVk(personToEdit.vk || "");
      setGithub(personToEdit.github || "");
      setSteam(personToEdit.steam || "");
      setWebsite(personToEdit.website || "");
      setNationality(personToEdit.nationality || "");
      setRelations(personToEdit.relations || []);
      setAge(personToEdit.age || "");
      setSignature(personToEdit.signature || "");
      setManualLat(personToEdit.lat?.toString() || "");
      setManualLng(personToEdit.lng?.toString() || "");
      setLocationMode("coords");
    }
  }, [editMode, personToEdit]);

  // Nationality suggestions
  const [nationalitySuggestions, setNationalitySuggestions] = useState<{ name: string; emoji: string }[]>([]);
  const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
  const nationalityRef = useRef<HTMLDivElement>(null);

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

  // Nationality suggestions effect
  useEffect(() => {
    if (nationality.length >= 2) {
      const results = getNationalitySuggestions(nationality);
      setNationalitySuggestions(results);
      setShowNationalitySuggestions(results.length > 0);
    } else {
      setNationalitySuggestions([]);
      setShowNationalitySuggestions(false);
    }
  }, [nationality]);

  // Close nationality suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nationalityRef.current && !nationalityRef.current.contains(e.target as Node)) {
        setShowNationalitySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add relation
  const addRelation = () => {
    if (newRelationName.trim()) {
      // Check if name already exists
      if (!relations.some(r => r.name.toLowerCase() === newRelationName.trim().toLowerCase())) {
        setRelations([...relations, { 
          name: newRelationName.trim(), 
          imageUrl: newRelationImage.trim() || undefined 
        }]);
      }
      setNewRelationName("");
      setNewRelationImage("");
      setShowAddRelation(false);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !finalCoords || hasSocialErrors) return;
    const validImages = imageUrls.filter(url => url.trim());
    onSave({
      id: editMode && personToEdit ? personToEdit.id : `person-${Date.now()}`,
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
      telegram: telegram.trim() || undefined,
      telegramId: telegramId.trim() || undefined,
      vk: vk.trim() || undefined,
      github: github.trim() || undefined,
      steam: steam.trim() || undefined,
      website: website.trim() || undefined,
      nationality: nationality.trim() || undefined,
      relations: relations.length > 0 ? relations : undefined,
      age: age.trim() || undefined,
      signature: signature.trim() || undefined,
      createdAt: editMode && personToEdit ? personToEdit.createdAt : new Date().toISOString(),
      ownerId: editMode && personToEdit ? personToEdit.ownerId : undefined,
      status: editMode ? selectedStatus : undefined,
      approved: editMode ? false : undefined, // Edits require re-approval
    });
    // Reset
    setName(""); setImageUrls([""]); setAbout("");
    setReason(""); setNotableAction(""); setWorkedFor("");
    setDiscord(""); setYoutube(""); setDiscordId(""); setPhone(""); setTelegram(""); setTelegramId("");
    setVk(""); setGithub(""); setSteam(""); setWebsite(""); setNationality("");
    setRelations([]); setNewRelationName(""); setNewRelationImage(""); setAge(""); setSignature(""); setShowSocialLinks(false); setShowAddRelation(false);
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
              
              <div className="p-6 pb-8 overflow-y-auto" data-lenis-prevent>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                      <User size={20} style={{ color: "#06b6d4" }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: "#06b6d4" }}>{editMode ? "Edit Person" : "Add Person"}</h2>
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

                {/* Status badge when editing */}
                {editMode && selectedStatus && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>Status:</span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        background: selectedStatus === 'Updated' ? 'rgba(52, 199, 89, 0.15)' : 
                                   selectedStatus === 'Terminated' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 149, 0, 0.15)',
                        color: selectedStatus === 'Updated' ? '#34c759' : 
                               selectedStatus === 'Terminated' ? '#ff3b30' : '#ff9500'
                      }}
                    >
                      {selectedStatus}
                    </span>
                  </div>
                )}

                {/* Location input - show if no pendingCoords from map click (or in edit mode) */}
                {(!pendingCoords || editMode) && (
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
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "#06b6d4" }} />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Smith"
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "44px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Multiple Image URLs */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Pictures <span className="text-[10px] font-normal">(optional, needs approval)</span>
                    </label>
                    <div className="space-y-2">
                      {imageUrls.map((url, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <div className="relative flex-1 min-w-0">
                            <ImagePlus size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                              style={{ color: "#06b6d4", left: "16px", zIndex: 1 }} />
                            <input
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...imageUrls];
                                newUrls[idx] = e.target.value;
                                setImageUrls(newUrls);
                              }}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                              style={{
                                background: "var(--color-surface)",
                                color: "var(--color-text)",
                                border: "1px solid var(--color-border)",
                                paddingLeft: "52px",
                              }}
                            />
                          </div>
                          {imageUrls.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                              className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
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

                  {/* Separator */}
                  <div className="h-[1px] my-2" style={{ background: "var(--color-border)" }} />

                  {/* Social Links Section - Collapsible */}
                  <div>
                    <motion.button
                      type="button"
                      onClick={() => setShowSocialLinks(!showSocialLinks)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                      style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}
                      whileHover={{ background: "var(--color-surface-hover)" }}
                    >
                      <span>Social Links <span className="text-[10px] font-normal">(optional)</span></span>
                      <motion.div
                        animate={{ rotate: showSocialLinks ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {showSocialLinks && (
                        <motion.div
                          className="space-y-2 mt-3"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                      {/* Discord Username */}
                      <div className="relative">
                        <MessageCircle size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#5865F2", left: "16px", zIndex: 1 }} />
                        <input
                          value={discord}
                          onChange={(e) => setDiscord(e.target.value)}
                          placeholder="Discord username"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                      {/* Discord ID */}
                      <div className="relative">
                        <Hash size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#5865F2", left: "16px", zIndex: 1 }} />
                        <input
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          placeholder="Discord ID (numbers)"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                      {/* YouTube */}
                      <div className="relative">
                        <Youtube size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#FF0000", left: "16px", zIndex: 1 }} />
                        <input
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          placeholder="youtube.com/..."
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: youtubeError ? "1px solid #ef4444" : "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                        {youtubeError && (
                          <span className="text-xs mt-0.5 block" style={{ color: "#ef4444" }}>
                            Must start with youtube.com
                          </span>
                        )}
                      </div>
                      {/* Phone */}
                      <div className="relative">
                        <Phone size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#34C759", left: "16px", zIndex: 1 }} />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Include country code (+1, +44...)"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                      {/* Telegram */}
                      <div className="relative">
                        <Send size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#0088cc", left: "16px", zIndex: 1 }} />
                        <input
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          placeholder="Telegram @ username"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                      {/* Telegram ID */}
                      <div className="relative">
                        <Hash size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#0088cc", left: "16px", zIndex: 1 }} />
                        <input
                          value={telegramId}
                          onChange={(e) => setTelegramId(e.target.value)}
                          placeholder="Telegram ID (numbers)"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                      {/* VK */}
                      <div className="relative">
                        <span className="absolute top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none"
                          style={{ color: "#4C75A3", left: "16px", zIndex: 1 }}>VK</span>
                        <input
                          value={vk}
                          onChange={(e) => setVk(e.target.value)}
                          placeholder="vk.com/..."
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: vkError ? "1px solid #ef4444" : "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                        {vkError && (
                          <span className="text-xs mt-0.5 block" style={{ color: "#ef4444" }}>
                            Must start with vk.com
                          </span>
                        )}
                      </div>
                      {/* GitHub */}
                      <div className="relative">
                        <Github size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#fff", left: "16px", zIndex: 1 }} />
                        <input
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github.com/..."
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: githubError ? "1px solid #ef4444" : "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                        {githubError && (
                          <span className="text-xs mt-0.5 block" style={{ color: "#ef4444" }}>
                            Must start with github.com
                          </span>
                        )}
                      </div>
                      {/* Steam */}
                      <div className="relative">
                        <Gamepad2 size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#66c0f4", left: "16px", zIndex: 1 }} />
                        <input
                          value={steam}
                          onChange={(e) => setSteam(e.target.value)}
                          placeholder="steamcommunity.com/..."
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: steamError ? "1px solid #ef4444" : "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                        {steamError && (
                          <span className="text-xs mt-0.5 block" style={{ color: "#ef4444" }}>
                            Must start with steamcommunity.com
                          </span>
                        )}
                      </div>
                      {/* Website */}
                      <div className="relative">
                        <Globe size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "#3b82f6", left: "16px", zIndex: 1 }} />
                        <input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="Website URL"
                          className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            paddingLeft: "52px",
                          }}
                        />
                      </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Nationality <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <div className="relative" ref={nationalityRef}>
                      <Flag size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-gold)", left: "16px", zIndex: 1 }} />
                      <input
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        onFocus={() => { if (nationalitySuggestions.length > 0) setShowNationalitySuggestions(true); }}
                        placeholder="Start typing..."
                        className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                      {/* Nationality suggestions dropdown */}
                      <AnimatePresence>
                        {showNationalitySuggestions && nationalitySuggestions.length > 0 && (
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
                              {nationalitySuggestions.map((suggestion, idx) => (
                                <motion.button
                                  key={suggestion.name}
                                  onClick={() => {
                                    setNationality(suggestion.name);
                                    setShowNationalitySuggestions(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer transition-colors"
                                  style={{ borderBottom: idx < nationalitySuggestions.length - 1 ? "1px solid var(--color-border)" : "none" }}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.15, delay: idx * 0.04 }}
                                  whileHover={{ background: "var(--color-surface-hover)" }}
                                >
                                  <span className="text-lg">{suggestion.emoji}</span>
                                  <span className="text-sm" style={{ color: "var(--color-text)" }}>
                                    {suggestion.name}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Age <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#a855f7", left: "16px", zIndex: 1 }} />
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      About <span className="text-[10px] font-normal">(optional, max 200 chars)</span>
                    </label>
                    <div className="relative">
                      <FileText size={16} className="absolute top-3 pointer-events-none"
                        style={{ color: "#3b82f6", left: "16px", zIndex: 1 }} />
                      <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value.slice(0, 200))}
                        placeholder="Brief bio..."
                        rows={2}
                        maxLength={200}
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none resize-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                    <div className="text-[10px] mt-1 text-right" style={{ color: about.length >= 180 ? "#ff6961" : "var(--color-text-secondary)" }}>
                      {about.length}/200
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Reason <span className="text-[10px] font-normal">(why they're notable, max 200 chars)</span>
                    </label>
                    <div className="relative">
                      <MessageCircle size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#22c55e", left: "16px", zIndex: 1 }} />
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value.slice(0, 200))}
                        placeholder="e.g. Founded a tech company"
                        maxLength={200}
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                    <div className="text-[10px] mt-1 text-right" style={{ color: reason.length >= 180 ? "#ff6961" : "var(--color-text-secondary)" }}>
                      {reason.length}/200
                    </div>
                  </div>

                  {/* Notable Action */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Notable Action <span className="text-[10px] font-normal">(optional, max 200 chars)</span>
                    </label>
                    <div className="relative">
                      <Star size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#eab308", left: "16px", zIndex: 1 }} />
                      <input
                        value={notableAction}
                        onChange={(e) => setNotableAction(e.target.value.slice(0, 200))}
                        placeholder="e.g. Invented the smartphone"
                        maxLength={200}
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                    <div className="text-[10px] mt-1 text-right" style={{ color: notableAction.length >= 180 ? "#ff6961" : "var(--color-text-secondary)" }}>
                      {notableAction.length}/200
                    </div>
                  </div>

                  {/* Worked For */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Worked For <span className="text-[10px] font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#f97316", left: "16px", zIndex: 1 }} />
                      <input
                        value={workedFor}
                        onChange={(e) => setWorkedFor(e.target.value)}
                        placeholder="e.g. Apple, Google, Tesla"
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Relations / Connections */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Relations <span className="text-[10px] font-normal">(connected people)</span>
                    </label>
                    
                    {/* Show added relations as badges with pics */}
                    {relations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {relations.map((rel, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer"
                            style={{ background: "rgba(6, 182, 212, 0.15)" }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ background: "rgba(255, 59, 48, 0.2)" }}
                            onClick={() => setRelations(relations.filter((_, i) => i !== idx))}
                          >
                            {rel.imageUrl ? (
                              <img src={rel.imageUrl} alt={rel.name} className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#06b6d4" }}>
                                <User size={10} style={{ color: "#000" }} />
                              </div>
                            )}
                            <span className="text-xs font-medium" style={{ color: "#06b6d4" }}>{rel.name}</span>
                            <X size={12} style={{ color: "#06b6d4" }} />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Add relation button or form */}
                    {!showAddRelation ? (
                      <motion.button
                        type="button"
                        onClick={() => setShowAddRelation(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer w-full justify-center"
                        style={{ background: "var(--color-surface)", color: "#06b6d4", border: "1px dashed rgba(6, 182, 212, 0.3)" }}
                        whileHover={{ scale: 1.01, borderColor: "#06b6d4" }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Plus size={14} />
                        Add Connection
                      </motion.button>
                    ) : (
                      <motion.div
                        className="p-4 rounded-2xl space-y-3"
                        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold" style={{ color: "#06b6d4" }}>New Connection</span>
                          <motion.button
                            type="button"
                            onClick={() => { setShowAddRelation(false); setNewRelationName(""); setNewRelationImage(""); }}
                            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                            style={{ background: "rgba(255,255,255,0.1)" }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X size={12} style={{ color: "var(--color-text-secondary)" }} />
                          </motion.button>
                        </div>
                        <div className="relative">
                          <User size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "#06b6d4", left: "12px", zIndex: 1 }} />
                          <input
                            value={newRelationName}
                            onChange={(e) => setNewRelationName(e.target.value)}
                            placeholder="Person name *"
                            className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                            style={{
                              background: "var(--color-surface-hover)",
                              color: "var(--color-text)",
                              border: "1px solid var(--color-border)",
                              paddingLeft: "40px",
                            }}
                          />
                        </div>
                        <div className="relative">
                          <ImagePlus size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "#06b6d4", left: "12px", zIndex: 1 }} />
                          <input
                            value={newRelationImage}
                            onChange={(e) => setNewRelationImage(e.target.value)}
                            placeholder="Image URL (optional)"
                            className="w-full py-2.5 pr-4 rounded-xl text-sm outline-none"
                            style={{
                              background: "var(--color-surface-hover)",
                              color: "var(--color-text)",
                              border: "1px solid var(--color-border)",
                              paddingLeft: "40px",
                            }}
                          />
                        </div>
                        {/* Preview */}
                        {(newRelationName || newRelationImage) && (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(6, 182, 212, 0.1)" }}>
                            {newRelationImage ? (
                              <img src={newRelationImage} alt="Preview" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#06b6d4" }}>
                                <User size={14} style={{ color: "#000" }} />
                              </div>
                            )}
                            <span className="text-sm" style={{ color: "#06b6d4" }}>{newRelationName || "Name..."}</span>
                          </div>
                        )}
                        <motion.button
                          type="button"
                          onClick={addRelation}
                          disabled={!newRelationName.trim()}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-40"
                          style={{ background: "#06b6d4", color: "#000" }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Save Connection
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  {/* Signature */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Signature <span className="text-[10px] font-normal">(creator tag, max 20 chars)</span>
                    </label>
                    <div className="relative">
                      <PenTool size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-gold)", left: "16px", zIndex: 1 }} />
                      <input
                        value={signature}
                        onChange={(e) => setSignature(e.target.value.slice(0, 20))}
                        placeholder="Your tag..."
                        maxLength={20}
                        className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          paddingLeft: "52px",
                        }}
                      />
                    </div>
                    <div className="text-[10px] mt-1 text-right" style={{ color: signature.length >= 18 ? "#ff6961" : "var(--color-text-secondary)" }}>
                      {signature.length}/20
                    </div>
                  </div>

                  {/* Save button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={!name.trim() || !finalCoords}
                    className="w-full py-4.5 rounded-2xl text-base font-bold text-white cursor-pointer disabled:opacity-40 mt-4 mb-2"
                    style={{
                      background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                      boxShadow: "0 6px 20px rgba(6, 182, 212, 0.4)",
                      fontSize: "16px",
                      padding: "18px",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(6, 182, 212, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editMode ? "Save Changes" : "Add Person"}
                  </motion.button>
                  {editMode && (
                    <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>
                      Changes will require admin re-approval
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
