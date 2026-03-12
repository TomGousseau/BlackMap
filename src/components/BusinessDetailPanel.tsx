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
          className="fixed top-0 right-0 bottom-0 z-[65] w-full max-w-sm"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        >
          <div
            className="h-full flex flex-col"
            style={{
              background: "var(--color-surface)",
              borderLeft: "1px solid var(--color-border)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Gold bar */}
            <div className="h-1 shrink-0" style={{ background: "linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))" }} />

            {/* Header */}
            <div className="p-5 shrink-0">
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border)" }}
                >
                  {business.imageUrl ? (
                    <img src={business.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={24} style={{ color: "var(--color-gold)" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold gold-text truncate">{business.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {business.category && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(200,168,78,0.15)", color: "var(--color-gold)" }}>
                        {business.category}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                      Since {business.createdAt}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shrink-0"
                  style={{ background: "var(--color-surface-hover)" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} style={{ color: "var(--color-text-secondary)" }} />
                </motion.button>
              </div>

              {/* Website link */}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 mt-3 text-xs font-medium"
                  style={{ color: "var(--color-gold)" }}
                >
                  <Globe size={12} />
                  {business.website.replace(/^https?:\/\//, "")}
                  <ExternalLink size={10} />
                </a>
              )}

              {/* Description */}
              {business.description && (
                <p className="text-sm mt-3" style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                  {business.description}
                </p>
              )}
            </div>

            <div className="h-px mx-4" style={{ background: "var(--color-border)" }} />

            {/* Reputation bar */}
            <div className="px-5 py-4 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>REPUTATION</span>
                <span className="text-lg font-bold gold-text">
                  {business.reputation > 0 ? business.reputation.toFixed(1) : "—"}
                </span>
              </div>
              {/* Star bar */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    fill={s <= Math.round(business.reputation) ? "var(--color-gold)" : "transparent"}
                    style={{
                      color: s <= Math.round(business.reputation) ? "var(--color-gold)" : "var(--color-border)",
                    }}
                  />
                ))}
                <span className="text-xs ml-2" style={{ color: "var(--color-text-secondary)" }}>
                  {business.reviews.length} review{business.reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="h-px mx-4" style={{ background: "var(--color-border)" }} />

            {/* Reviews */}
            <div className="flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
              <div className="flex items-center gap-1.5 mb-3">
                <MessageSquare size={13} style={{ color: "var(--color-gold)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                  Reviews
                </span>
              </div>

              {business.reviews.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: "var(--color-text-secondary)" }}>
                  No reviews yet — be the first!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {business.reviews.map((r) => (
                    <div key={r.id} className="p-3 rounded-2xl" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{r.author}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={9} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{r.text}</p>
                      <span className="text-[10px] mt-1 block" style={{ color: "var(--color-border)" }}>{r.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px mx-4" style={{ background: "var(--color-border)" }} />

            {/* Add review */}
            <div className="p-4 shrink-0" style={{ background: "var(--color-bg)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Write a Review
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(s)}
                  >
                    <Star
                      size={16}
                      fill={s <= (hoverRating || reviewRating) ? "var(--color-gold)" : "transparent"}
                      style={{
                        color: s <= (hoverRating || reviewRating) ? "var(--color-gold)" : "var(--color-border)",
                        transition: "color 0.15s",
                      }}
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full py-2 px-3 rounded-lg text-xs outline-none mb-2"
                style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="flex-1 py-2 px-3 rounded-lg text-xs outline-none"
                  style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmitReview(); }}
                />
                <motion.button
                  onClick={handleSubmitReview}
                  disabled={!canSubmit}
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                  style={{
                    background: canSubmit ? "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))" : "var(--color-surface)",
                    opacity: canSubmit ? 1 : 0.4,
                  }}
                  whileHover={canSubmit ? { scale: 1.1 } : {}}
                  whileTap={canSubmit ? { scale: 0.9 } : {}}
                >
                  <Send size={14} style={{ color: canSubmit ? "#fff" : "var(--color-text-secondary)" }} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
