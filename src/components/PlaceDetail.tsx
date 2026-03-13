"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Navigation, Globe, Share, Bookmark, Eye, Send } from "lucide-react";
import type { LocationData, ReviewData } from "@/lib/types";

interface PlaceDetailProps {
  location: LocationData | null;
  onClose: () => void;
  onAddReview?: (locId: string, review: ReviewData) => void;
}

export function PlaceDetail({ location, onClose, onAddReview }: PlaceDetailProps) {
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const canSubmit = reviewAuthor.trim() && reviewText.trim() && reviewRating > 0;

  const handleSubmit = () => {
    if (!canSubmit || !location || !onAddReview) return;
    onAddReview(location.id, {
      id: `r-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
    });
    setReviewAuthor("");
    setReviewText("");
    setReviewRating(0);
  };

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          className="fixed top-4 left-4 bottom-4 z-50 w-full max-w-[360px]"
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-120%", opacity: 0 }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 34 }}
        >
          <div
            className="h-full flex flex-col overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(180deg, #1a1a1e 0%, #121214 100%)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Gloss overlay */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />

            {/* Image header */}
            {location.imageUrl && (
              <div className="relative w-full h-48 shrink-0 rounded-t-3xl overflow-hidden">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1a1a1e 0%, transparent 60%)" }} />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <X size={16} style={{ color: "#fff" }} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto relative z-10" data-lenis-prevent>
              {/* Title section */}
              <div className="px-5 pt-4 pb-3">
                {!location.imageUrl && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={onClose}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <X size={16} style={{ color: "#fff" }} />
                    </button>
                  </div>
                )}
                <h2 className="text-xl font-bold leading-tight" style={{ color: "#f5f5f7" }}>
                  {location.name}
                </h2>
                {location.category && (
                  <p className="text-[13px] mt-1 font-medium" style={{ color: "#86868b" }}>{location.category}</p>
                )}
              </div>

              {/* Action buttons row */}
              <div className="px-5 pb-4 flex gap-2">
                <button 
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ background: "linear-gradient(135deg, #0a84ff 0%, #0070e0 100%)", boxShadow: "0 4px 12px rgba(10,132,255,0.3)" }}
                >
                  <Navigation size={18} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#fff" }}>Directions</span>
                </button>
                <button 
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Globe size={18} style={{ color: "#0a84ff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#0a84ff" }}>Website</span>
                </button>
                <button 
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Share size={18} style={{ color: "#0a84ff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#0a84ff" }}>Share</span>
                </button>
                <button 
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Bookmark size={18} style={{ color: "#0a84ff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#0a84ff" }}>Save</span>
                </button>
              </div>

              {/* Info bar */}
              <div 
                className="mx-5 mb-4 flex items-center gap-4 px-4 py-3 rounded-2xl" 
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {location.rating != null && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} fill="#d4af37" style={{ color: "#d4af37" }} />
                    <span className="text-sm font-bold" style={{ color: "#f5f5f7" }}>{location.rating}</span>
                  </div>
                )}
                {location.views != null && location.views > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye size={13} style={{ color: "#86868b" }} />
                    <span className="text-xs font-medium" style={{ color: "#86868b" }}>{(location.views / 1000).toFixed(1)}k</span>
                  </div>
                )}
                {location.featured && (
                  <span 
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full" 
                    style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.2)" }}
                  >
                    Featured
                  </span>
                )}
              </div>

              <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* About */}
              {location.description && (
                <div className="px-5 py-4">
                  <h3 className="text-[13px] font-bold mb-2 tracking-wide" style={{ color: "#86868b" }}>ABOUT</h3>
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#a1a1a6" }}>{location.description}</p>
                  </div>
                </div>
              )}

              <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Ratings & Reviews */}
              <div className="px-5 py-4">
                <h3 className="text-[13px] font-bold mb-3 tracking-wide" style={{ color: "#86868b" }}>RATINGS & REVIEWS</h3>

                {location.rating != null && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold" style={{ color: "#f5f5f7" }}>{location.rating}</span>
                    <div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14}
                            fill={s <= Math.round(location.rating!) ? "#d4af37" : "transparent"}
                            style={{ color: s <= Math.round(location.rating!) ? "#d4af37" : "#3a3a3c" }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: "#86868b" }}>
                        {(location.reviews?.length || 0)} review{(location.reviews?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* Existing reviews */}
                {location.reviews && location.reviews.length > 0 && (
                  <div className="space-y-2.5 mb-4">
                    {location.reviews.map((r) => (
                      <div 
                        key={r.id} 
                        className="p-4 rounded-2xl" 
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>{r.author}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={10}
                                fill={i < r.rating ? "#d4af37" : "transparent"}
                                style={{ color: i < r.rating ? "#d4af37" : "#3a3a3c" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: "#a1a1a6" }}>{r.text}</p>
                        <span className="text-[11px] mt-2 block font-medium" style={{ color: "#48484a" }}>{r.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a review */}
                {onAddReview && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[11px] font-bold tracking-wide mb-3" style={{ color: "#86868b" }}>WRITE A REVIEW</p>
                    <div className="flex items-center gap-1.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} className="cursor-pointer transition-transform duration-150 hover:scale-110"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(s)}
                        >
                          <Star size={20}
                            fill={s <= (hoverRating || reviewRating) ? "#d4af37" : "transparent"}
                            style={{ color: s <= (hoverRating || reviewRating) ? "#d4af37" : "#3a3a3c", transition: "color 0.15s" }}
                          />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Your name"
                      className="w-full py-3 px-4 rounded-xl text-[13px] font-medium outline-none mb-2 transition-all duration-200 focus:ring-2 focus:ring-[#d4af37]/30"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                        className="flex-1 py-3 px-4 rounded-xl text-[13px] font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-[#d4af37]/30"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.08)" }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{ 
                          background: canSubmit ? "linear-gradient(135deg, #d4af37 0%, #c8a035 100%)" : "rgba(255,255,255,0.06)", 
                          opacity: canSubmit ? 1 : 0.4,
                          boxShadow: canSubmit ? "0 4px 16px rgba(212,175,55,0.3)" : "none",
                          border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Send size={16} style={{ color: canSubmit ? "#000" : "#6e6e73" }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
