"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Navigation,
  MapPin,
  Layers,
  Star,
  Clock,
  Coffee,
  Fuel,
  ShoppingBag,
  UtensilsCrossed,
  Building2,
  TreePine,
  ChevronLeft,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  onNavigate: () => void;
}

const categories = [
  { id: "restaurants", icon: UtensilsCrossed, label: "Eat", color: "#ff6b6b" },
  { id: "coffee", icon: Coffee, label: "Coffee", color: "#c084fc" },
  { id: "gas", icon: Fuel, label: "Gas", color: "#fbbf24" },
  { id: "shopping", icon: ShoppingBag, label: "Shop", color: "#34d399" },
  { id: "hotels", icon: Building2, label: "Stay", color: "#60a5fa" },
  { id: "parks", icon: TreePine, label: "Parks", color: "#4ade80" },
];

const recentSearches = [
  "Central Park, New York",
  "Eiffel Tower, Paris",
  "Tokyo Station",
];

const favorites = [
  { name: "Home", address: "123 Main Street" },
  { name: "Work", address: "456 Business Ave" },
];

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  closed: {
    x: -320,
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function Sidebar({
  isOpen,
  onToggle,
  onSearch,
  onCategorySelect,
  onNavigate,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed left-0 top-0 bottom-0 z-40 w-80 flex flex-col overflow-hidden"
            style={{
              background: "var(--color-sidebar)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              borderRight: "1px solid var(--color-glass-border)",
            }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between px-5 pt-5 pb-3"
              variants={itemVariants}
            >
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                Maps
              </h1>
              <motion.button
                onClick={onToggle}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "var(--color-surface-hover)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={16} style={{ color: "var(--color-text)" }} />
              </motion.button>
            </motion.div>

            {/* Search */}
            <motion.form
              onSubmit={handleSearchSubmit}
              className="px-4 pb-3"
              variants={itemVariants}
            >
              <motion.div
                className="relative flex items-center rounded-2xl overflow-hidden"
                style={{
                  background: "var(--color-surface)",
                  boxShadow: searchFocused
                    ? `0 0 0 2px var(--color-accent)`
                    : "var(--shadow-sm)",
                }}
                animate={{
                  scale: searchFocused ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Search
                  size={16}
                  className="absolute left-3.5"
                  style={{ color: "var(--color-text-secondary)" }}
                />
                <input
                  type="text"
                  placeholder="Search maps"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full py-2.5 pl-10 pr-10 text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-text)" }}
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "var(--color-surface-hover)" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <X size={10} style={{ color: "var(--color-text-secondary)" }} />
                  </motion.button>
                )}
              </motion.div>
            </motion.form>

            {/* Directions button */}
            <motion.div className="px-4 pb-4" variants={itemVariants}>
              <motion.button
                onClick={onNavigate}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium text-white cursor-pointer"
                style={{
                  background: "var(--color-accent)",
                  boxShadow: "var(--shadow-sm)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "var(--shadow-md)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Navigation size={15} />
                Directions
              </motion.button>
            </motion.div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {/* Categories */}
              <motion.div className="mb-5" variants={itemVariants}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3 px-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Explore Nearby
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat, i) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => onCategorySelect(cat.id)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer"
                      style={{
                        background: "var(--color-surface)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "var(--shadow-md)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                    >
                      <motion.div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: `${cat.color}18` }}
                        whileHover={{
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.4 },
                        }}
                      >
                        <cat.icon size={17} style={{ color: cat.color }} />
                      </motion.div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--color-text)" }}
                      >
                        {cat.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Favorites */}
              <motion.div className="mb-5" variants={itemVariants}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Star size={12} />
                  Favorites
                </h3>
                <div className="flex flex-col gap-1.5">
                  {favorites.map((fav, i) => (
                    <motion.button
                      key={fav.name}
                      className="flex items-center gap-3 p-3 rounded-2xl text-left cursor-pointer"
                      style={{
                        background: "var(--color-surface)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                      whileHover={{
                        scale: 1.02,
                        x: 4,
                        boxShadow: "var(--shadow-md)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "var(--color-accent)", opacity: 0.15 }}
                      >
                        <MapPin
                          size={16}
                          style={{ color: "var(--color-accent)" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text)" }}
                        >
                          {fav.name}
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {fav.address}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Recent */}
              <motion.div variants={itemVariants}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Clock size={12} />
                  Recent
                </h3>
                <div className="flex flex-col gap-1">
                  {recentSearches.map((search, i) => (
                    <motion.button
                      key={search}
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch(search);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer"
                      style={{ color: "var(--color-text)" }}
                      whileHover={{
                        x: 4,
                        background: "var(--color-surface-hover)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                    >
                      <Clock
                        size={14}
                        style={{ color: "var(--color-text-secondary)" }}
                      />
                      <span className="text-sm truncate">{search}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
