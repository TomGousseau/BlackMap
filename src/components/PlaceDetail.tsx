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
          className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-[380px]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 34 }}
        >
          <div
            className="h-full flex flex-col overflow-hidden"
            style={{
              background: "#ffffff",
              boxShadow: "4px 0 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* Image header */}
            {location.imageUrl && (
              <div className="relative w-full h-52 shrink-0">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}
                >
                  <X size={14} style={{ color: "#1c1c1e" }} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              {/* Title section */}
              <div className="px-5 pt-4 pb-3">
                {!location.imageUrl && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={onClose}
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: "#e5e5ea" }}
                    >
                      <X size={14} style={{ color: "#3c3c43" }} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
                <h2 className="text-[22px] font-bold leading-tight" style={{ color: "#1c1c1e" }}>
                  {location.name}
                </h2>
                {location.category && (
                  <p className="text-[13px] mt-0.5" style={{ color: "#8e8e93" }}>{location.category}</p>
                )}
              </div>

              {/* Action buttons row */}
              <div className="px-5 pb-4 flex gap-2">
                <button className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer" style={{ background: "#007aff" }}>
                  <Navigation size={17} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#fff" }}>Directions</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer" style={{ background: "#f2f2f7" }}>
                  <Globe size={17} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Website</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer" style={{ background: "#f2f2f7" }}>
                  <Share size={17} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Share</span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer" style={{ background: "#f2f2f7" }}>
                  <Bookmark size={17} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Save</span>
                </button>
              </div>

              {/* Info bar */}
              <div className="mx-5 mb-4 flex items-center gap-4 px-4 py-2.5 rounded-xl" style={{ background: "#f2f2f7" }}>
                {location.rating != null && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} fill="#ff9500" style={{ color: "#ff9500" }} />
                    <span className="text-sm font-bold" style={{ color: "#1c1c1e" }}>{location.rating}</span>
                  </div>
                )}
                {location.views != null && location.views > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye size={13} style={{ color: "#8e8e93" }} />
                    <span className="text-xs font-medium" style={{ color: "#8e8e93" }}>{(location.views / 1000).toFixed(1)}k</span>
                  </div>
                )}
                {location.featured && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)", color: "#b8860b" }}>Featured</span>
                )}
              </div>

              <div className="h-px mx-5" style={{ background: "#e5e5ea" }} />

              {/* About */}
              {location.description && (
                <div className="px-5 py-4">
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: "#1c1c1e" }}>About</h3>
                  <div className="rounded-xl p-3.5" style={{ background: "#f2f2f7" }}>
                    <p className="text-[13px] leading-[1.65]" style={{ color: "#3c3c43" }}>{location.description}</p>
                  </div>
                </div>
              )}

              <div className="h-px mx-5" style={{ background: "#e5e5ea" }} />

              {/* Ratings & Reviews */}
              <div className="px-5 py-4">
                <h3 className="text-[15px] font-bold mb-3" style={{ color: "#1c1c1e" }}>Ratings &amp; Reviews</h3>

                {location.rating != null && (
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl font-bold" style={{ color: "#1c1c1e" }}>{location.rating}</span>
                    <div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14}
                            fill={s <= Math.round(location.rating!) ? "#ff9500" : "transparent"}
                            style={{ color: s <= Math.round(location.rating!) ? "#ff9500" : "#d1d1d6" }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px]" style={{ color: "#8e8e93" }}>
                        {(location.reviews?.length || 0)} review{(location.reviews?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* Existing reviews */}
                {location.reviews && location.reviews.length > 0 && (
                  <div className="space-y-2.5 mb-4">
                    {location.reviews.map((r) => (
                      <div key={r.id} className="p-3.5 rounded-xl" style={{ background: "#f2f2f7" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-semibold" style={{ color: "#1c1c1e" }}>{r.author}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={10}
                                fill={i < r.rating ? "#ff9500" : "transparent"}
                                style={{ color: i < r.rating ? "#ff9500" : "#d1d1d6" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] leading-[1.5]" style={{ color: "#3c3c43" }}>{r.text}</p>
                        <span className="text-[11px] mt-1.5 block" style={{ color: "#aeaeb2" }}>{r.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a review */}
                {onAddReview && (
                  <div className="rounded-xl p-3.5" style={{ background: "#f2f2f7" }}>
                    <p className="text-[12px] font-semibold mb-2" style={{ color: "#8e8e93" }}>Write a Review</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} className="cursor-pointer"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(s)}
                        >
                          <Star size={16}
                            fill={s <= (hoverRating || reviewRating) ? "#ff9500" : "transparent"}
                            style={{ color: s <= (hoverRating || reviewRating) ? "#ff9500" : "#d1d1d6", transition: "color 0.15s" }}
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
                      style={{ background: "#fff", color: "#1c1c1e", border: "1px solid #e5e5ea" }}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                        className="flex-1 py-2 px-3 rounded-lg text-xs outline-none"
                        style={{ background: "#fff", color: "#1c1c1e", border: "1px solid #e5e5ea" }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ background: canSubmit ? "#007aff" : "#e5e5ea", opacity: canSubmit ? 1 : 0.5 }}
                      >
                        <Send size={14} style={{ color: canSubmit ? "#fff" : "#8e8e93" }} />
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
