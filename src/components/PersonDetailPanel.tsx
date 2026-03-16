"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, MapPin, Briefcase, Award, FileText } from "lucide-react";
import type { PersonData } from "@/lib/types";

interface PersonDetailPanelProps {
  person: PersonData | null;
  onClose: () => void;
}

export function PersonDetailPanel({ person, onClose }: PersonDetailPanelProps) {
  return (
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[65] flex flex-col glass-strong"
          style={{
            boxShadow: "var(--shadow-lg)",
            borderLeft: "1px solid var(--color-glass-border)",
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 35 }}
        >
          {/* Cyan accent bar */}
          <div className="h-1 shrink-0" style={{ background: "linear-gradient(90deg, #06b6d4, #22d3ee, #67e8f9)" }} />

          {/* Header image / avatar */}
          <div className="relative shrink-0">
            {person.imageUrl ? (
              <div className="w-full h-48 overflow-hidden">
                <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to top, var(--color-bg), transparent 60%)"
                }} />
              </div>
            ) : (
              <div className="w-full h-32 flex items-center justify-center"
                style={{ background: "rgba(6, 182, 212, 0.1)" }}>
                <User size={48} style={{ color: "#06b6d4", opacity: 0.5 }} />
              </div>
            )}

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} style={{ color: "#fff" }} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
            <h2 className="text-xl font-bold mb-1" style={{ color: "#06b6d4" }}>
              {person.name}
            </h2>

            {person.address && (
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={12} style={{ color: "var(--color-text-secondary)" }} />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {person.address}
                </span>
              </div>
            )}

            <div className="mt-6 space-y-5">
              {person.about && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} style={{ color: "#06b6d4" }} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      About
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {person.about}
                  </p>
                </div>
              )}

              {person.reason && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={14} style={{ color: "#06b6d4" }} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      Why Notable
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text)" }}>
                    {person.reason}
                  </p>
                </div>
              )}

              {person.notableAction && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={14} style={{ color: "#d4a84e" }} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      Notable Action
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text)" }}>
                    {person.notableAction}
                  </p>
                </div>
              )}

              {person.workedFor && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} style={{ color: "#06b6d4" }} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      Worked For
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text)" }}>
                    {person.workedFor}
                  </p>
                </div>
              )}
            </div>

            {/* Coords */}
            <div className="mt-6 flex items-center gap-1.5 px-3 py-2 rounded-full w-fit"
              style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
              <MapPin size={11} style={{ color: "#06b6d4" }} />
              <span className="text-[11px] font-mono">{person.lat.toFixed(4)}, {person.lng.toFixed(4)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
