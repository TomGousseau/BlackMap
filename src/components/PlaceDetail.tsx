"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Navigation, Globe, Eye, MessageSquare, Share, Bookmark } from "lucide-react";
import type { LocationData } from "@/lib/types";

interface PlaceDetailProps {
  location: LocationData | null;
  onClose: () => void;
}

export function PlaceDetail({ location, onClose }: PlaceDetailProps) {
  return (
    <AnimatePresence>
      {location && (
        <motion.div
          className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px]"
          style={{ x: "-50%" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring" as const, stiffness: 350, damping: 32 }}
        >
          <div
            className="rounded-t-[20px] overflow-hidden max-h-[85vh] flex flex-col"
            style={{
              background: "#ffffff",
              boxShadow: "0 -4px 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-9 h-[5px] rounded-full" style={{ background: "#d1d1d6" }} />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1" data-lenis-prevent>
              {/* Header */}
              <div className="px-5 pb-3 pt-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <h2 className="text-[22px] font-bold leading-tight" style={{ color: "#1c1c1e" }}>
                      {location.name}
                    </h2>
                    {location.category && (
                      <p className="text-[13px] mt-0.5" style={{ color: "#8e8e93" }}>
                        {location.category}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 cursor-pointer mt-0.5"
                    style={{ background: "#e5e5ea" }}
                  >
                    <X size={14} style={{ color: "#3c3c43" }} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Action buttons — Apple Maps style pills */}
              <div className="px-5 pb-4 flex gap-2">
                <button
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer"
                  style={{ background: "#007aff" }}
                >
                  <Navigation size={18} style={{ color: "#fff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#fff" }}>Directions</span>
                </button>
                <button
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer"
                  style={{ background: "#f2f2f7" }}
                >
                  <Globe size={18} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Website</span>
                </button>
                <button
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer"
                  style={{ background: "#f2f2f7" }}
                >
                  <Share size={18} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Share</span>
                </button>
                <button
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer"
                  style={{ background: "#f2f2f7" }}
                >
                  <Bookmark size={18} style={{ color: "#007aff" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "#007aff" }}>Save</span>
                </button>
              </div>

              {/* Info bar */}
              <div className="mx-5 mb-4 flex items-center gap-4 px-4 py-2.5 rounded-xl" style={{ background: "#f2f2f7" }}>
                {location.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} fill="#ff9500" style={{ color: "#ff9500" }} />
                    <span className="text-sm font-bold" style={{ color: "#1c1c1e" }}>{location.rating}</span>
                  </div>
                )}
                {location.views != null && location.views > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye size={13} style={{ color: "#8e8e93" }} />
                    <span className="text-xs font-medium" style={{ color: "#8e8e93" }}>
                      {(location.views / 1000).toFixed(1)}k views
                    </span>
                  </div>
                )}
                {location.featured && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(212,175,55,0.15)", color: "#b8860b" }}>
                    Featured
                  </span>
                )}
              </div>

              {/* Photos */}
              {location.imageUrl && (
                <div className="px-5 mb-4">
                  <div className="rounded-2xl overflow-hidden" style={{ background: "#f2f2f7" }}>
                    <img
                      src={location.imageUrl}
                      alt={location.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="h-px mx-5" style={{ background: "#e5e5ea" }} />

              {/* About section */}
              {location.description && (
                <div className="px-5 py-4">
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: "#1c1c1e" }}>About</h3>
                  <div className="rounded-xl p-3.5" style={{ background: "#f2f2f7" }}>
                    <p className="text-[13px] leading-[1.65]" style={{ color: "#3c3c43" }}>
                      {location.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="h-px mx-5" style={{ background: "#e5e5ea" }} />

              {/* Ratings & Reviews section */}
              <div className="px-5 py-4">
                <h3 className="text-[15px] font-bold mb-3" style={{ color: "#1c1c1e" }}>Ratings &amp; Reviews</h3>

                {/* Rating summary */}
                {location.rating && (
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl font-bold" style={{ color: "#1c1c1e" }}>
                      {location.rating}
                    </span>
                    <div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= Math.round(location.rating!) ? "#ff9500" : "transparent"}
                            style={{ color: s <= Math.round(location.rating!) ? "#ff9500" : "#d1d1d6" }}
                          />
                        ))}
                      </div>
                      {location.reviews && (
                        <span className="text-[11px]" style={{ color: "#8e8e93" }}>
                          {location.reviews.length} review{location.reviews.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Review cards */}
                {location.reviews && location.reviews.length > 0 ? (
                  <div className="space-y-2.5">
                    {location.reviews.map((r) => (
                      <div key={r.id} className="p-3.5 rounded-xl" style={{ background: "#f2f2f7" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-semibold" style={{ color: "#1c1c1e" }}>
                            {r.author}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                fill={i < r.rating ? "#ff9500" : "transparent"}
                                style={{ color: i < r.rating ? "#ff9500" : "#d1d1d6" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] leading-[1.5]" style={{ color: "#3c3c43" }}>
                          {r.text}
                        </p>
                        <span className="text-[11px] mt-1.5 block" style={{ color: "#aeaeb2" }}>
                          {r.date}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] py-3 text-center" style={{ color: "#8e8e93" }}>
                    No reviews yet
                  </p>
                )}
              </div>

              {/* Bottom safe area padding */}
              <div className="h-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
