"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { LocationData } from "@/lib/types";

interface SearchBarProps {
  locations: LocationData[];
  popularSearches: string[];
  onSelect: (location: LocationData) => void;
  onSearch: (query: string) => void;
}

export function SearchBar({ locations, popularSearches, onSelect, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? locations.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const showDropdown = focused && (query.trim() === "" || filtered.length > 0);
  const recentPlaces = [...locations].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && focused) {
        setFocused(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      {/* Apple Maps style search card */}
      <AnimatePresence>
        {focused ? (
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header with Search label and X */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="text-[17px] font-semibold" style={{ color: "#000" }}>Search</span>
              <button
                onClick={() => { setFocused(false); setQuery(""); }}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "#e5e5ea" }}
              >
                <X size={16} style={{ color: "#3c3c43" }} />
              </button>
            </div>

            {/* Search input */}
            <form onSubmit={handleSubmit} className="px-4 pb-3">
              <div
                className="flex items-center rounded-xl px-3 py-2.5"
                style={{ background: "#f2f2f7", border: "2px solid #007aff" }}
              >
                <Search size={16} style={{ color: "#8e8e93" }} className="shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Apple Maps"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 ml-2 text-[15px] bg-transparent outline-none placeholder:text-[#8e8e93]"
                  style={{ color: "#000" }}
                />
              </div>
            </form>

            {/* Dropdown content */}
            <div className="max-h-[280px] overflow-y-auto border-t border-[#e5e5ea]" data-lenis-prevent>
              {query.trim() && filtered.length > 0 ? (
                <div className="py-1">
                  {filtered.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setQuery(""); setFocused(false); }}
                      className="w-full flex items-center gap-3 pl-5 pr-4 py-3 text-left cursor-pointer transition-colors hover:bg-[#f2f2f7]"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#f2f2f7" }}
                      >
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <MapPin size={18} style={{ color: "#007aff" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium truncate" style={{ color: "#000" }}>{loc.name}</div>
                        <div className="text-[13px]" style={{ color: "#8e8e93" }}>{loc.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-1">
                  <div className="px-5 py-2 text-[13px] font-medium" style={{ color: "#8e8e93" }}>
                    Recents
                  </div>
                  {recentPlaces.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setFocused(false); }}
                      className="w-full flex items-center gap-3 pl-5 pr-4 py-3 text-left cursor-pointer transition-colors hover:bg-[#f2f2f7]"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#f2f2f7" }}
                      >
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <MapPin size={18} style={{ color: "#007aff" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium truncate" style={{ color: "#000" }}>{loc.name}</div>
                        <div className="text-[13px]" style={{ color: "#8e8e93" }}>{loc.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setFocused(true)}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Search size={16} style={{ color: "#8e8e93" }} />
            <span className="text-[15px]" style={{ color: "#8e8e93" }}>Search Maps</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
