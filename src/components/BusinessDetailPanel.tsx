"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe, Star, MessageSquare, Send, ExternalLink } from "lucide-react";
import type { BusinessProfile, BusinessReview } from "@/lib/types";

interface BusinessDetailPanelProps {
  business: BusinessProfile | null;
  onClose: () => void;
  onAddReview: (bizId: string, review: BusinessReview) => void;
}

export function BusinessDetailPanel({ business, onClose, onAddReview }: BusinessDetailPanelProps) {
  const [reviewText, setReviewText] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const canSubmit = reviewText.trim() && reviewAuthor.trim() && reviewRating > 0;

  const handleSubmitReview = () => {
    if (!canSubmit || !business) return;
    onAddReview(business.id, {
      id: `br-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
    });
    setReviewText("");
    setReviewAuthor("");
    setReviewRating(0);
  };

  return (
    <AnimatePresence>
      {business && (
        <motion.div
          className="fixed top-0 right-0 bottom-0 z-[65] w-full max-w-[380px]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 34 }}
        >
          <div
            className="h-full flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #1a1a1e 0%, #141416 100%)",
              boxShadow: "-12px 0 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Gloss overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
              }}
            />

            {/* Header image/gradient */}
            <div className="relative h-28 shrink-0" style={{
              background: business.imageUrl 
                ? `linear-gradient(to bottom, transparent 0%, #1a1a1e 100%), url(${business.imageUrl}) center/cover`
                : "linear-gradient(135deg, #2a2520 0%, #1a1a1e 100%)",
            }}>
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(26,26,30,0) 0%, rgba(26,26,30,1) 100%)",
              }} />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <X size={16} style={{ color: "#fff" }} />
              </button>
            </div>

            {/* Profile section */}
            <div className="px-6 -mt-10 relative z-10">
              {/* Logo */}
              <div
                className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {business.imageUrl ? (
                  <img src={business.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={32} style={{ color: "#d4af37" }} />
                )}
              </div>

              {/* Name & Category */}
              <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: "#f5f5f7" }}>
                {business.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {business.category && (
                  <span 
                    className="text-[11px] px-3 py-1 rounded-full font-semibold"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.1) 100%)",
                      color: "#d4af37",
                      border: "1px solid rgba(212,175,55,0.3)",
                    }}
                  >
                    {business.category}
                  </span>
                )}
                <span className="text-[11px] font-medium" style={{ color: "#6e6e73" }}>
                  Since {business.createdAt}
                </span>
              </div>

              {/* Website button */}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #2a2a2e 0%, #222224 100%)",
                    color: "#d4af37",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Globe size={14} />
                  Visit Website
                  <ExternalLink size={12} />
                </a>
              )}

              {/* Description */}
              {business.description && (
                <p className="text-[13px] mt-4 leading-relaxed" style={{ color: "#a1a1a6" }}>
                  {business.description}
                </p>
              )}
            </div>

            {/* Separator */}
            <div className="h-px mx-6 mt-5" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Reputation card */}
            <div className="px-6 py-5">
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider" style={{ color: "#6e6e73" }}>
                    REPUTATION
                  </span>
                  <span className="text-2xl font-bold" style={{ color: "#d4af37" }}>
                    {business.reputation > 0 ? business.reputation.toFixed(1) : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      fill={s <= Math.round(business.reputation) ? "#d4af37" : "transparent"}
                      style={{ color: s <= Math.round(business.reputation) ? "#d4af37" : "#3a3a3c" }}
                    />
                  ))}
                  <span className="text-[12px] ml-2 font-medium" style={{ color: "#6e6e73" }}>
                    {business.reviews.length} review{business.reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px mx-6" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Reviews */}
            <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={14} style={{ color: "#d4af37" }} />
                <span className="text-[12px] font-bold tracking-wide" style={{ color: "#d4af37" }}>
                  REVIEWS
                </span>
              </div>

              {business.reviews.length === 0 ? (
                <div 
                  className="py-8 text-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <p className="text-[13px] font-medium" style={{ color: "#6e6e73" }}>
                    No reviews yet — be the first!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {business.reviews.map((r) => (
                    <div 
                      key={r.id} 
                      className="p-4 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>{r.author}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={11} 
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
            </div>

            {/* Write review section */}
            <div 
              className="p-5 shrink-0"
              style={{
                background: "linear-gradient(180deg, #18181a 0%, #121214 100%)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-[11px] font-bold tracking-wider mb-3" style={{ color: "#6e6e73" }}>
                WRITE A REVIEW
              </div>

              {/* Star picker */}
              <div className="flex items-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className="cursor-pointer transition-transform duration-150 hover:scale-110"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(s)}
                  >
                    <Star
                      size={20}
                      fill={s <= (hoverRating || reviewRating) ? "#d4af37" : "transparent"}
                      style={{ 
                        color: s <= (hoverRating || reviewRating) ? "#d4af37" : "#3a3a3c",
                        transition: "color 0.15s, fill 0.15s",
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Name input */}
              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full py-3 px-4 rounded-xl text-[13px] font-medium outline-none mb-2 transition-all duration-200 focus:ring-2 focus:ring-[#d4af37]/30"
                style={{ 
                  background: "rgba(255,255,255,0.04)", 
                  color: "#f5f5f7", 
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />

              {/* Review input + send */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="flex-1 py-3 px-4 rounded-xl text-[13px] font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-[#d4af37]/30"
                  style={{ 
                    background: "rgba(255,255,255,0.04)", 
                    color: "#f5f5f7", 
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmitReview(); }}
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={!canSubmit}
                  className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: canSubmit 
                      ? "linear-gradient(135deg, #d4af37 0%, #c8a035 100%)" 
                      : "rgba(255,255,255,0.04)",
                    opacity: canSubmit ? 1 : 0.4,
                    boxShadow: canSubmit ? "0 4px 16px rgba(212,175,55,0.3)" : "none",
                    border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Send size={16} style={{ color: canSubmit ? "#000" : "#6e6e73" }} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
