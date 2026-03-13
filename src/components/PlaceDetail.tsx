"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Navigation, Globe, Share, Bookmark, Send } from "lucide-react";
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
          className="fixed top-4 left-4 bottom-4 z-50 w-full max-w-[380px]"
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-120%", opacity: 0 }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 34 }}
        >
          <div
            className="h-full flex flex-col overflow-hidden rounded-3xl"
            style={{
              background: "#161618",
              boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Image header */}
            {location.imageUrl && (
              <div className="relative w-full h-44 shrink-0">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #161618 0%, transparent 70%)" }} />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                >
                  <X size={14} style={{ color: "#fff" }} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              {/* Title */}
              <div className="px-6 pt-5 pb-4">
                {!location.imageUrl && (
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <X size={14} style={{ color: "#fff" }} />
                    </button>
                  </div>
                )}
                <h2 className="text-[22px] font-semibold" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
                  {location.name}
                </h2>
                {location.category && (
                  <p className="text-[14px] mt-1" style={{ color: "#8e8e93" }}>{location.category}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="px-6 pb-5 grid grid-cols-4 gap-3">
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1 pt-3 pb-3.5 rounded-2xl cursor-pointer" 
                  style={{ background: "#d4af37" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(212,175,55,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation size={18} style={{ color: "#000" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#000" }}>Directions</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1 pt-3 pb-3.5 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#2a2a2e" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe size={18} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-medium" style={{ color: "#fff" }}>Website</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1 pt-3 pb-3.5 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#2a2a2e" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share size={18} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-medium" style={{ color: "#fff" }}>Share</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1 pt-3 pb-3.5 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#2a2a2e" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark size={18} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-medium" style={{ color: "#fff" }}>Save</span>
                </motion.button>
              </div>

              {/* Divider */}
              <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />

              {/* About */}
              {location.description && (
                <div className="px-6 py-7">
                  <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>ABOUT</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc" }}>
                    {location.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />

              {/* Ratings & Reviews */}
              <div className="px-6 py-5">
                <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>RATINGS & REVIEWS</h3>

                {location.rating != null && (location.reviews?.length || 0) > 0 ? (
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-[44px] font-bold" style={{ color: "#fff", letterSpacing: "-0.02em" }}>{location.rating}</span>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={16}
                            fill={s <= Math.round(location.rating!) ? "#d4af37" : "transparent"}
                            style={{ color: s <= Math.round(location.rating!) ? "#d4af37" : "#48484a" }}
                          />
                        ))}
                      </div>
                      <span className="text-[13px]" style={{ color: "#8e8e93" }}>
                        {(location.reviews?.length || 0)} reviews
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[13px]" style={{ color: "#8e8e93" }}>Unreviewed</span>
                )}

                {/* Existing reviews */}
                {location.reviews && location.reviews.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {location.reviews.map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl" style={{ background: "#1e1e21" }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>{r.author}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12}
                                fill={i < r.rating ? "#d4af37" : "transparent"}
                                style={{ color: i < r.rating ? "#d4af37" : "#48484a" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] leading-[1.5]" style={{ color: "#a1a1a6" }}>{r.text}</p>
                        <span className="text-[12px] mt-2 block" style={{ color: "#636366" }}>{r.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Write Review - separate section */}
              {onAddReview && (
                <>
                  <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>WRITE A REVIEW</h3>
                    
                    {/* Star picker */}
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} className="cursor-pointer"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(s)}
                        >
                          <Star size={24}
                            fill={s <= (hoverRating || reviewRating) ? "#d4af37" : "transparent"}
                            style={{ color: s <= (hoverRating || reviewRating) ? "#d4af37" : "#48484a" }}
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
                      className="w-full py-3.5 px-4 rounded-xl text-[14px] outline-none mb-3"
                      style={{ background: "#1e1e21", color: "#fff", border: "none" }}
                    />

                    {/* Review input + send */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                        className="flex-1 py-3.5 px-4 rounded-xl text-[14px] outline-none"
                        style={{ background: "#1e1e21", color: "#fff", border: "none" }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer"
                        style={{ 
                          background: canSubmit ? "#d4af37" : "#2a2a2e", 
                          opacity: canSubmit ? 1 : 0.5,
                        }}
                      >
                        <Send size={18} style={{ color: canSubmit ? "#000" : "#636366" }} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="h-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
