"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Volume2, VolumeX, Palette, PenTool } from "lucide-react";

interface UserSettings {
  soundEnabled: boolean;
  theme: string;
  defaultSignature: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: false,
  theme: "default",
  defaultSignature: "",
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserSettings) => void;
}

export function SettingsPanel({ isOpen, onClose, onSettingsChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("blackrock_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  // Save settings to localStorage and notify parent
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("blackrock_settings", JSON.stringify(updated));
    onSettingsChange?.(updated);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-sm glass-strong rounded-3xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-lg)" }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Gray accent bar */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, #636366, #8e8e93, #aeaeb2)" }} />

            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(142, 142, 147, 0.15)" }}>
                  <Settings size={20} style={{ color: "#8e8e93" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#8e8e93" }}>Settings</h2>
                  <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                    Preferences
                  </p>
                </div>
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

            {/* Settings content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: settings.soundEnabled ? "rgba(52, 199, 89, 0.15)" : "rgba(142, 142, 147, 0.15)" }}>
                    {settings.soundEnabled ? (
                      <Volume2 size={18} style={{ color: "#34c759" }} />
                    ) : (
                      <VolumeX size={18} style={{ color: "#8e8e93" }} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Sound</div>
                    <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      {settings.soundEnabled ? "Enabled" : "Disabled"} (coming soon)
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className="relative w-11 h-6 rounded-full cursor-pointer"
                  style={{ 
                    background: settings.soundEnabled ? "#34c759" : "var(--color-surface-hover)",
                    boxShadow: settings.soundEnabled ? "0 0 8px rgba(52,199,89,0.5)" : "none"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 rounded-full"
                    style={{ background: "#fff" }}
                    animate={{ left: settings.soundEnabled ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(142, 142, 147, 0.15)" }}>
                    <Palette size={18} style={{ color: "#8e8e93" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Theme</div>
                    <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      Default (more coming soon)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" 
                  style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)" }}>
                  Default
                </span>
              </div>

              {/* Default Signature */}
              <div className="p-4 rounded-2xl space-y-3" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(200, 168, 78, 0.15)" }}>
                    <PenTool size={18} style={{ color: "var(--color-gold)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Default Signature</div>
                    <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      Auto-fills when creating people
                    </div>
                  </div>
                </div>
                <input
                  value={settings.defaultSignature}
                  onChange={(e) => updateSettings({ defaultSignature: e.target.value.slice(0, 20) })}
                  placeholder="Your signature..."
                  maxLength={20}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--color-surface-hover)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <div className="text-[10px] text-right" style={{ color: settings.defaultSignature.length >= 18 ? "#ff6961" : "var(--color-text-secondary)" }}>
                  {settings.defaultSignature.length}/20
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for loading settings
export function useSettings(): UserSettings {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("blackrock_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  return settings;
}
