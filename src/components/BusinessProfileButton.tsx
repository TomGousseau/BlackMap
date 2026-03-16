"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Plus, Star, Globe, ChevronRight, X, Shield, Sparkles, Clock, User, Users } from "lucide-react";
import type { BusinessProfile, PersonData } from "@/lib/types";

interface BusinessProfileButtonProps {
  businesses: BusinessProfile[];
  persons?: PersonData[];
  onAddBusiness: () => void;
  onAddPerson?: () => void;
  onSelectBusiness: (biz: BusinessProfile) => void;
  onSelectPerson?: (person: PersonData) => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export function BusinessProfileButton({
  businesses,
  persons = [],
  onAddBusiness,
  onAddPerson,
  onSelectBusiness,
  onSelectPerson,
  onOpenAdmin,
  isAdmin,
}: BusinessProfileButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="fixed top-5 right-5 z-50">
      {/* Profile button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: open ? "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))" : "var(--color-surface)",
          boxShadow: open ? "var(--shadow-glow)" : "var(--shadow-md)",
          border: `1px solid ${open ? "transparent" : "var(--color-glass-border)"}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Business profiles"
      >
        <Building2 size={18} style={{ color: open ? "#fff" : "var(--color-text)" }} />
      </motion.button>

      {/* Count badge */}
      {businesses.length > 0 && !open && (
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: "var(--color-gold)", color: "#1c1c20" }}
        >
          {businesses.length}
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-14 right-0 w-80 glass-strong rounded-2xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-lg)" }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
          >
            {/* Header */}
            <div className="pl-5 pr-4 pt-4 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold gold-text">Business Profiles</h3>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  Internet-only corps & brands
                </p>
              </div>
              <motion.button
                onClick={() => { onAddBusiness(); setOpen(false); }}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))",
                  boxShadow: "var(--shadow-glow)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={14} style={{ color: "#fff" }} />
              </motion.button>
            </div>

            <div className="h-px mx-3" style={{ background: "var(--color-border)" }} />

            {/* Admin button */}
            {onOpenAdmin && (
              <>
                <motion.button
                  onClick={() => { onOpenAdmin(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
                  style={{ color: "var(--color-text)" }}
                  whileHover={{ background: "var(--color-surface-hover)" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(175, 82, 222, 0.15)" }}>
                    <Shield size={16} style={{ color: "#af52de" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: "#af52de" }}>Admin Panel</div>
                    <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      {isAdmin ? "Manage businesses" : "Login required"}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--color-text-secondary)" }} />
                </motion.button>
                <div className="h-px mx-3" style={{ background: "var(--color-border)" }} />
              </>
            )}

            {/* List */}
            <div className="max-h-72 overflow-y-auto p-2" data-lenis-prevent>
              {businesses.length === 0 ? (
                <div className="py-8 text-center">
                  <Building2 size={28} style={{ color: "var(--color-text-secondary)", margin: "0 auto 8px" }} />
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    No businesses yet
                  </p>
                  <button
                    onClick={() => { onAddBusiness(); setOpen(false); }}
                    className="mt-3 text-xs font-semibold cursor-pointer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    + Add your first business
                  </button>
                </div>
              ) : (
                businesses.map((biz) => (
                  <motion.button
                    key={biz.id}
                    onClick={() => { onSelectBusiness(biz); setOpen(false); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left cursor-pointer"
                    style={{ color: "var(--color-text)", opacity: biz.approved === false ? 0.6 : 1 }}
                    whileHover={{ background: "var(--color-surface-hover)", x: 2 }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative"
                      style={{ background: "var(--color-surface-hover)" }}
                    >
                      {biz.imageUrl ? (
                        <img src={biz.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 size={18} style={{ color: "var(--color-gold)" }} />
                      )}
                      {biz.important && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "#af52de" }}>
                          <Sparkles size={10} style={{ color: "#fff" }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold truncate">{biz.name}</span>
                        {biz.approved === false && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                            style={{ background: "rgba(255, 149, 0, 0.15)", color: "#ff9500" }}>
                            <Clock size={8} />
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {biz.category && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(200,168,78,0.15)", color: "var(--color-gold)" }}>
                            {biz.category}
                          </span>
                        )}
                        <div className="flex items-center gap-0.5">
                          <Star size={10} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />
                          <span className="text-[11px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
                            {biz.reputation.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                          · {biz.reviews.length} review{biz.reviews.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={14} style={{ color: "var(--color-text-secondary)" }} />
                  </motion.button>
                ))
              )}
            </div>

            {/* People section */}
            <div className="h-px mx-3" style={{ background: "var(--color-border)" }} />
            <div className="pl-5 pr-4 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: "#06b6d4" }} />
                <h3 className="text-sm font-bold" style={{ color: "#06b6d4" }}>People</h3>
              </div>
              {onAddPerson && (
                <motion.button
                  onClick={() => { onAddPerson(); setOpen(false); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    background: "#06b6d4",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={13} style={{ color: "#fff" }} />
                </motion.button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto p-2 pb-4" data-lenis-prevent>
              {persons.length === 0 ? (
                <div className="py-4 text-center">
                  <User size={22} style={{ color: "var(--color-text-secondary)", margin: "0 auto 6px" }} />
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    No people added yet
                  </p>
                </div>
              ) : (
                persons.map((p) => (
                  <motion.button
                    key={p.id}
                    onClick={() => { onSelectPerson?.(p); setOpen(false); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left cursor-pointer"
                    style={{ color: "var(--color-text)" }}
                    whileHover={{ background: "var(--color-surface-hover)", x: 2 }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} style={{ color: "#06b6d4" }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold truncate block">{p.name}</span>
                      {p.reason && (
                        <span className="text-[10px] truncate block" style={{ color: "var(--color-text-secondary)" }}>
                          {p.reason}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--color-text-secondary)" }} />
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
