"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, MapPin, Clock, Sparkles } from "lucide-react";
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
      )
    : [];

  const showDropdown = focused && (query.trim() === "" || filtered.length > 0);

  const mostViewed = [...locations].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);

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
    <div ref={containerRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <form onSubmit={handleSubmit}>
        <div
          className="relative glass-strong rounded-full overflow-visible transition-shadow duration-200"
          style={{
            boxShadow: focused
              ? "0 8px 40px rgba(200, 168, 78, 0.2), 0 0 0 2px var(--color-gold)"
              : "var(--shadow-lg)",
            transform: focused ? "scale(1.02)" : "scale(1)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={18} style={{ color: focused ? "var(--color-gold)" : "var(--color-text-secondary)" }} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Blackrock V2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            className="w-full py-3.5 pl-12 pr-12 text-sm font-medium bg-transparent outline-none rounded-full"
            style={{ color: "var(--color-text)" }}
          />
          <AnimatePresence>
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "var(--color-surface-hover)" }}
              >
                <X size={11} style={{ color: "var(--color-text-secondary)" }} />
              </button>
            )}
          </AnimatePresence>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="glass-strong rounded-3xl mt-2 overflow-hidden"
            style={{ boxShadow: "var(--shadow-lg)" }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
          >
            <div className="max-h-[60vh] overflow-y-auto p-3" data-lenis-prevent>
              {/* Search results */}
              {query.trim() && filtered.length > 0 && (
                <div>
                  {filtered.map((loc, i) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setQuery(loc.name); setFocused(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl text-left cursor-pointer hover:translate-x-1 transition-all duration-150"
                      style={{ color: "var(--color-text)" }}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                        style={{ background: "var(--color-surface-hover)" }}>
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin size={16} style={{ color: "var(--color-gold)" }} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{loc.name}</div>
                        <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {loc.category} {loc.rating && `· ★ ${loc.rating}`}
                        </div>
                      </div>
                      {loc.featured && (
                        <Sparkles size={14} style={{ color: "var(--color-gold)" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Popular / Most Viewed */}
              {!query.trim() && (
                <>
                  <div className="px-2 pt-1 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-gold)" }}>
                      <TrendingUp size={12} />
                      Most Viewed
                    </div>
                  </div>
                  {mostViewed.map((loc, i) => (
                    <button
                      key={loc.id}
                      onClick={() => { onSelect(loc); setQuery(loc.name); setFocused(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl text-left cursor-pointer hover:translate-x-1 transition-all duration-150"
                      style={{ color: "var(--color-text)" }}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                        style={{ background: "var(--color-surface-hover)" }}>
                        {loc.imageUrl ? (
                          <img src={loc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin size={16} style={{ color: "var(--color-gold)" }} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{loc.name}</div>
                        <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {loc.category} · {((loc.views || 0) / 1000).toFixed(1)}k views
                        </div>
                      </div>
                      <span className="text-xs font-bold tabular-nums shrink-0"
                        style={{ color: "var(--color-gold)" }}>
                        #{i + 1}
                      </span>
                    </button>
                  ))}

                  <div className="h-px my-2 mx-2" style={{ background: "var(--color-border)" }} />
                  <div className="px-2 pb-1 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-text-secondary)" }}>
                      <Clock size={11} />
                      Popular Searches
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                    {popularSearches.slice(0, 8).map((s, i) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); onSearch(s); }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-150"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
