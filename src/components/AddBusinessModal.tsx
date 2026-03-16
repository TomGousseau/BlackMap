"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe, Star, ImageIcon, Tag, FileText } from "lucide-react";
import type { BusinessProfile } from "@/lib/types";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (biz: BusinessProfile) => void;
}

const CATEGORIES = ["Tech", "Finance", "E-Commerce", "SaaS", "Agency", "Media", "Crypto", "Gaming", "AI", "Other"];

export function AddBusinessModal({ isOpen, onClose, onSave }: AddBusinessModalProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: `biz-${Date.now()}`,
      name: name.trim(),
      website: website.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      category: category || undefined,
      reputation: 0,
      reviews: [],
      createdAt: new Date().toISOString().split("T")[0],
    });
    setName("");
    setWebsite("");
    setImageUrl("");
    setDescription("");
    setCategory("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md glass-strong rounded-3xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-lg)" }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
          >
            {/* Gold bar */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))" }} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(200,168,78,0.15)" }}>
                    <Building2 size={20} style={{ color: "var(--color-gold)" }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold gold-text">Add Business</h2>
                    <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>Internet-only corp or brand</p>
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

              {/* Form */}
              <div className="space-y-4">
                {/* Name (required) */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                    Business Name <span style={{ color: "var(--color-gold)" }}>*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-gold)" }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Blackrock Corp"
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

                {/* Website (optional) */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                    Website <span className="text-[10px] font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#3b82f6" }} />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
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

                {/* Image URL (optional) */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                    Logo / Image URL <span className="text-[10px] font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <ImageIcon size={16} className="absolute top-1/2 -translate-y-1/2"
                      style={{ color: "#06b6d4", left: "16px" }} />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full py-3 pr-4 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        paddingLeft: "52px",
                      }}
                    />
                  </div>
                  {/* Preview */}
                  {imageUrl.trim() && (
                    <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden" style={{ background: "var(--color-surface)" }}>
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                </div>

                {/* Category (optional) */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                    Category <span className="text-[10px] font-normal">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(category === cat ? "" : cat)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                        style={{
                          background: category === cat ? "rgba(200,168,78,0.2)" : "var(--color-surface)",
                          color: category === cat ? "var(--color-gold)" : "var(--color-text-secondary)",
                          border: `1px solid ${category === cat ? "var(--color-gold)" : "var(--color-border)"}`,
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description (optional) */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                    Description <span className="text-[10px] font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this business do?"
                    rows={3}
                    className="w-full py-3 px-4 rounded-2xl text-sm outline-none resize-none"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <motion.button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{
                    background: canSave
                      ? "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))"
                      : "var(--color-surface)",
                    color: canSave ? "#fff" : "var(--color-text-secondary)",
                    boxShadow: canSave ? "var(--shadow-glow)" : "none",
                    opacity: canSave ? 1 : 0.5,
                  }}
                  whileHover={canSave ? { scale: 1.02 } : {}}
                  whileTap={canSave ? { scale: 0.98 } : {}}
                >
                  Create Business
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ background: "var(--color-surface)", color: "var(--color-text)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
