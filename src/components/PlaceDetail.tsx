"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Navigation, Globe, Share, Bookmark, BookmarkCheck, Send, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { LocationData, ReviewData } from "@/lib/types";

interface PlaceDetailProps {
  location: LocationData | null;
  onClose: () => void;
  onAddReview?: (locId: string, review: ReviewData) => void;
  onSave?: (locId: string) => void;
  onShare?: (locId: string) => void;
  onDelete?: (locId: string) => void;
  isSaved?: boolean;
  currentUserId?: string; // Hide review form if user owns this location
}

export function PlaceDetail({ location, onClose, onAddReview, onSave, onShare, onDelete, isSaved, currentUserId }: PlaceDetailProps) {
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (combine imageUrl and imageUrls for backward compatibility)
  // Use Set for O(n) deduplication instead of O(n²) indexOf
  const allImages = location
    ? [...new Set([
        ...(location.imageUrl ? [location.imageUrl] : []),
        ...(location.imageUrls || []),
      ])]
    : [];
  // Reset image index when location changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [location?.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Check if owner can still delete (within 10 min)
  const isOwner = currentUserId && location?.ownerId === currentUserId;
  
  useEffect(() => {
    if (!location?.createdAt || !isOwner) {
      setTimeLeft(null);
      return;
    }
    
    const checkTime = () => {
      const created = new Date(location.createdAt!).getTime();
      const now = Date.now();
      const elapsed = now - created;
      const tenMinutes = 10 * 60 * 1000;
      const remaining = tenMinutes - elapsed;
      
      if (remaining > 0) {
        setTimeLeft(Math.ceil(remaining / 1000));
      } else {
        setTimeLeft(null);
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [location?.createdAt, isOwner]);

  // Close on Escape key
  useEffect(() => {
    if (!location) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location, onClose]);

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
            {/* Image header with gallery */}
            {allImages.length > 0 && (
              <div className="relative w-full h-44 shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={allImages[currentImageIndex]}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #161618 0%, transparent 70%)" }} />
                
                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                    >
                      <ChevronLeft size={18} style={{ color: "#fff" }} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                    >
                      <ChevronRight size={18} style={{ color: "#fff" }} />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className="w-1.5 h-1.5 rounded-full cursor-pointer"
                          style={{ 
                            background: idx === currentImageIndex ? "#fff" : "rgba(255,255,255,0.4)",
                            transition: "background 0.2s ease"
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                
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
                {allImages.length === 0 && (
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
                  className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation size={18} className="action-icon" />
                  <span className="text-[11px] font-semibold action-text">Directions</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe size={18} className="action-icon" />
                  <span className="text-[11px] font-medium action-text">Website</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                  style={{ background: "#232326" }}
                  whileHover={{ scale: 1.05, background: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => location && onShare?.(location.id)}
                >
                  <Share size={18} className="action-icon" />
                  <span className="text-[11px] font-medium action-text">Share</span>
                </motion.button>
                <motion.button 
                  className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                  style={{ background: isSaved ? "#d4af37" : "#232326" }}
                  whileHover={{ scale: 1.05, background: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => location && onSave?.(location.id)}
                >
                  {isSaved ? (
                    <BookmarkCheck size={18} style={{ color: "#000" }} />
                  ) : (
                    <Bookmark size={18} className="action-icon" />
                  )}
                  <span className="text-[11px] font-medium" style={{ color: isSaved ? "#000" : undefined }}>{isSaved ? "Saved" : "Save"}</span>
                </motion.button>
              </div>

              {/* Delete button - only for owner within 10 min */}
              {isOwner && timeLeft !== null && onDelete && (
                <div className="px-6 pb-4">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer"
                    style={{ background: "#3a1a1a" }}
                    whileHover={{ scale: 1.02, background: "#ff3b30" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete(location.id)}
                  >
                    <Trash2 size={16} style={{ color: "#ff6961" }} />
                    <span className="text-[13px] font-medium" style={{ color: "#ff6961" }}>
                      Delete ({Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} left)
                    </span>
                  </motion.button>
                </div>
              )}

              {/* Divider */}
              <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />

              {/* About */}
              {location.description && (
                <div className="px-6 py-5">
                  <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>ABOUT</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc" }}>
                    {location.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />

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

              {/* Write Review - separate section (hidden if viewing own business) */}
              {onAddReview && !(currentUserId && location.ownerId === currentUserId) && (
                <>
                  <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-5" style={{ color: "#8e8e93" }}>WRITE A REVIEW</h3>
                    
                    {/* Star picker */}
                    <div className="flex items-center gap-2 mb-5">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const isActive = s <= (hoverRating || reviewRating);
                        return (
                          <button 
                            key={s} 
                            className="cursor-pointer"
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(s)}
                            style={{ 
                              transform: "scale(1)",
                              transition: "transform 0.15s ease",
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          >
                            <Star 
                              size={24}
                              fill={isActive ? "#d4af37" : "transparent"}
                              color={isActive ? "#d4af37" : "#48484a"}
                            />
                          </button>
                        );
                      })}
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
