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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <form onSubmit={handleSubmit}>
        <div
          className="relative rounded-2xl overflow-visible"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: focused
              ? "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)"
              : "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.2s ease",
          }}
        >
          <div className="flex items-center px-4 py-3">
            <Search size={18} style={{ color: "#8e8e93" }} className="shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Maps"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              className="flex-1 ml-3 text-[15px] bg-transparent outline-none placeholder:text-[#8e8e93]"
              style={{ color: "#1c1c1e" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center cursor-pointer shrink-0"
                style={{ background: "#c7c7cc" }}
              >
                <X size={10} style={{ color: "#fff" }} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="rounded-2xl mt-2 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="max-h-[320px] overflow-y-auto" data-lenis-prevent>
              {/* Search results */}
              {query.trim() && filtered.length > 0 && (
                <div className="py-1">
                  {filtered.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setQuery(""); setFocused(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors"
                      style={{ color: "#1c1c1e" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f2f2f7"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#f2f2f7" }}>
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <MapPin size={16} style={{ color: "#007aff" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium truncate">{loc.name}</div>
                        <div className="text-[13px]" style={{ color: "#8e8e93" }}>
                          {loc.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Recents */}
              {!query.trim() && (
                <div className="py-1">
                  <div className="px-4 py-2 text-[13px] font-semibold" style={{ color: "#8e8e93" }}>
                    Recents
                  </div>
                  {recentPlaces.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setFocused(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors"
                      style={{ color: "#1c1c1e" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f2f2f7"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#f2f2f7" }}>
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <MapPin size={16} style={{ color: "#007aff" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium truncate">{loc.name}</div>
                        <div className="text-[13px]" style={{ color: "#8e8e93" }}>
                          {loc.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
