"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Star, Plus, ImagePlus } from "lucide-react";
import { useState } from "react";
import type { LocationData, ReviewData } from "@/lib/types";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: LocationData) => void;
  pendingCoords: { lat: number; lng: number } | null;
}

export function AddLocationModal({ isOpen, onClose, onSave, pendingCoords }: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [step, setStep] = useState<"info" | "review">("info");

  const categories = ["Restaurant", "Cafe", "Park", "Historic", "Beach", "Mountain", "City", "Luxury", "Adventure", "Nature"];

  const handleSave = () => {
    if (!name.trim() || !pendingCoords) return;
    const reviews: ReviewData[] = [];
    if (reviewText.trim()) {
      reviews.push({
        id: `rev-${Date.now()}`,
        author: reviewAuthor || "Anonymous",
        rating: rating || 5,
        text: reviewText,
        date: new Date().toISOString().split("T")[0],
      });
    }
    onSave({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      lat: pendingCoords.lat,
      lng: pendingCoords.lng,
      category: category || undefined,
      rating: rating || undefined,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      featured: false,
      views: 0,
      reviews,
    });
    // Reset
    setName(""); setCategory(""); setDescription(""); setImageUrl("");
    setRating(0); setReviewText(""); setReviewAuthor(""); setStep("info");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && pendingCoords && (
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
            <div className="glass-strong rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
              {/* Gold top bar */}
              <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))" }} />
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold gold-text">Add Location</h2>
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

                {/* Coords badge */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                    style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
                    <MapPin size={11} style={{ color: "var(--color-gold)" }} />
                    {pendingCoords.lat.toFixed(4)}, {pendingCoords.lng.toFixed(4)}
                  </div>
                </div>

                {step === "info" ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                        Location Name *
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bahnhofstrasse, Zürich"
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                        }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                        Category
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((c) => (
                          <motion.button
                            key={c}
                            onClick={() => setCategory(c)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                            style={{
                              background: category === c ? "var(--color-gold)" : "var(--color-surface)",
                              color: category === c ? "#fff" : "var(--color-text)",
                              border: `1px solid ${category === c ? "var(--color-gold)" : "var(--color-border)"}`,
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {c}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                        Image URL
                      </label>
                      <div className="relative">
                        <ImagePlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: "var(--color-text-secondary)" }} />
                        <input
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full py-3 pl-10 pr-4 rounded-2xl text-sm outline-none"
                          style={{
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      </div>
                      {imageUrl && (
                        <motion.div
                          className="mt-2 h-32 rounded-2xl overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 128, opacity: 1 }}
                        >
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </motion.div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell us about this place..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        onClick={() => setStep("review")}
                        className="flex-1 py-3 rounded-2xl text-sm font-medium cursor-pointer"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add Review →
                      </motion.button>
                      <motion.button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40"
                        style={{
                          background: "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))",
                          boxShadow: "var(--shadow-glow)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Location
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {/* Rating */}
                    <div>
                      <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--color-text-secondary)" }}>
                        Rating
                      </label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="cursor-pointer"
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Star
                              size={28}
                              fill={(hoverRating || rating) >= star ? "var(--color-gold)" : "transparent"}
                              style={{
                                color: (hoverRating || rating) >= star ? "var(--color-gold)" : "var(--color-border)",
                              }}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Author */}
                    <input
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />

                    {/* Review text */}
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                    />

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        onClick={() => setStep("info")}
                        className="flex-1 py-3 rounded-2xl text-sm font-medium cursor-pointer"
                        style={{
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ← Back
                      </motion.button>
                      <motion.button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40"
                        style={{
                          background: "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))",
                          boxShadow: "var(--shadow-glow)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save with Review
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
