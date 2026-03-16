"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  LocateFixed,
  Compass,
  Layers,
  Crosshair,
  Wrench,
  UserPlus,
} from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  devMode: boolean;
  addingLocation: boolean;
  addingPerson: boolean;
  onToggleAddLocation: () => void;
  onToggleAddPerson: () => void;
  onToggleDevMode: () => void;
}

function ControlButton({
  icon: Icon,
  onClick,
  label,
  size = 18,
  active = false,
  gold = false,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  onClick: () => void;
  label: string;
  size?: number;
  active?: boolean;
  gold?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
      style={{
        background: active
          ? gold ? "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))" : "var(--color-accent)"
          : "var(--color-surface)",
        boxShadow: active && gold ? "var(--shadow-glow)" : "var(--shadow-md)",
        border: `1px solid ${active ? "transparent" : "var(--color-glass-border)"}`,
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      aria-label={label}
    >
      <Icon
        size={size}
        style={{ color: active ? "#fff" : "var(--color-text)" }}
      />
    </motion.button>
  );
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  devMode,
  addingLocation,
  addingPerson,
  onToggleAddLocation,
  onToggleAddPerson,
  onToggleDevMode,
}: MapControlsProps) {
  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
    >
      <div
        className="rounded-full overflow-hidden flex flex-col"
        style={{
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--color-glass-border)",
        }}
      >
        <motion.button
          onClick={onZoomIn}
          className="w-11 h-11 flex items-center justify-center cursor-pointer"
          style={{ background: "transparent" }}
          whileHover={{ background: "var(--color-surface-hover)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Zoom in"
        >
          <Plus size={18} style={{ color: "var(--color-text)" }} />
        </motion.button>
        <div className="h-px mx-2" style={{ background: "var(--color-border)" }} />
        <motion.button
          onClick={onZoomOut}
          className="w-11 h-11 flex items-center justify-center cursor-pointer"
          style={{ background: "transparent" }}
          whileHover={{ background: "var(--color-surface-hover)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Zoom out"
        >
          <Minus size={18} style={{ color: "var(--color-text)" }} />
        </motion.button>
      </div>
      <ControlButton icon={LocateFixed} onClick={onLocate} label="My location" />

      {/* Dev mode toggle */}
      <ControlButton
        icon={Wrench}
        onClick={onToggleDevMode}
        label="Toggle dev mode"
        active={devMode}
        gold
      />

      {/* Add location (only in dev mode) */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
          >
            <ControlButton
              icon={Crosshair}
              onClick={onToggleAddLocation}
              label="Add location"
              active={addingLocation}
              gold
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add person (only in dev mode) */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 25, delay: 0.05 }}
          >
            <ControlButton
              icon={UserPlus}
              onClick={onToggleAddPerson}
              label="Add person"
              active={addingPerson}
              gold
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
