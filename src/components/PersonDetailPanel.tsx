"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Share, Bookmark, BookmarkCheck, Send, Trash2, ChevronLeft, ChevronRight, MessageCircle, Youtube, Phone, Maximize2, Download, BadgeCheck, ShieldAlert, Globe, Gamepad2, Github, User } from "lucide-react";
import type { PersonData, ReviewData } from "@/lib/types";
import { getFlagEmoji } from "@/lib/flags";
import { truncateText } from "@/lib/sanitize";

interface PersonDetailPanelProps {
  person: PersonData | null;
  onClose: () => void;
  onAddReview?: (personId: string, review: ReviewData) => void;
  onSetRating?: (personId: string, rating: number) => void;
  onToggleVerified?: (personId: string) => void;
  onSave?: (personId: string) => void;
  onShare?: (personId: string) => void;
  onDelete?: (personId: string) => void;
  onShowStatus?: (msg: string) => void;
  isAdmin?: boolean;
  isSaved?: boolean;
  currentUserId?: string;
}

export function PersonDetailPanel({ person, onClose, onAddReview, onSetRating, onToggleVerified, onSave, onShare, onDelete, onShowStatus, isSaved, currentUserId, isAdmin }: PersonDetailPanelProps) {
  const location = person;
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [discordTooltip, setDiscordTooltip] = useState(false);
  const [telegramTooltip, setTelegramTooltip] = useState(false);
  const [tooltipCount, setTooltipCount] = useState(0);

  // Load tooltip count from localStorage
  useEffect(() => {
    const count = parseInt(localStorage.getItem('personTooltipViews') || '0', 10);
    setTooltipCount(count);
  }, []);

  // Increment tooltip count (max 3 views)
  const handleTooltipHover = (setter: (v: boolean) => void, show: boolean) => {
    setter(show);
    if (show && tooltipCount < 3) {
      const newCount = tooltipCount + 1;
      setTooltipCount(newCount);
      localStorage.setItem('personTooltipViews', String(newCount));
    }
  };

  const showTooltips = tooltipCount < 3;

  // Download image handler
  const handleDownload = async () => {
    if (!allImages[currentImageIndex]) return;
    try {
      const response = await fetch(allImages[currentImageIndex]);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${location?.name || 'image'}-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowStatus?.("Image downloaded!");
    } catch {
      onShowStatus?.("Failed to download");
    }
  };

  // Get all images
  const allImages = location ? [
    ...(location.imageUrl ? [location.imageUrl] : []),
    ...(location.imageUrls || []),
  ].filter((v, i, a) => a.indexOf(v) === i) : []; // dedupe

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

  // Close on Escape key - fullscreen first, then panel
  useEffect(() => {
    if (!location) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImage) {
          setFullscreenImage(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location, onClose, fullscreenImage]);

  const canSubmit = isAdmin && reviewRating > 0;

  const handleSubmit = () => {
    if (!canSubmit || !location || !onSetRating) return;
    onSetRating(location.id, reviewRating);
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
                
                {/* Fullscreen & Download buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => setFullscreenImage(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                  >
                    <Maximize2 size={14} style={{ color: "#fff" }} />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                  >
                    <Download size={14} style={{ color: "#fff" }} />
                  </button>
                </div>
              </div>
            )}

            {/* Fullscreen image overlay */}
            <AnimatePresence>
              {fullscreenImage && allImages.length > 0 && (
                <motion.div
                  className="fixed inset-0 z-[100] flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.95)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFullscreenImage(false)}
                >
                  <motion.img
                    src={allImages[currentImageIndex]}
                    alt={location?.name}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setFullscreenImage(false)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                  >
                    <X size={20} style={{ color: "#fff" }} />
                  </button>
                  {/* Download in fullscreen */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                  >
                    <Download size={20} style={{ color: "#fff" }} />
                  </button>
                  {/* Gallery navigation in fullscreen */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                      >
                        <ChevronLeft size={24} style={{ color: "#fff" }} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                      >
                        <ChevronRight size={24} style={{ color: "#fff" }} />
                      </button>
                      {/* Image counter */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <span className="text-sm font-medium" style={{ color: "#fff" }}>{currentImageIndex + 1} / {allImages.length}</span>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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
                <h2 className="text-[22px] font-semibold flex items-center gap-2" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
                  {location.name}
                  {location.nationality && getFlagEmoji(location.nationality) && (
                    <span className="text-xl">{getFlagEmoji(location.nationality)}</span>
                  )}
                </h2>
              </div>

              {/* Social & Action buttons - dynamic grid based on what's available */}
              {(() => {
                const hasSocial = location.discord || location.youtube || location.phone || location.telegram || location.vk || location.github || location.steam || location.website;
                const socialCount = [location.discord, location.youtube, location.phone, location.telegram, location.vk, location.github, location.steam, location.website].filter(Boolean).length;
                const baseButtons = 2; // Share + Save
                const adminButton = isAdmin && onDelete ? 1 : 0;
                const totalButtons = socialCount + baseButtons + adminButton;
                const cols = Math.min(totalButtons, 5);
                return (
                  <>
                    {/* Separator line when more than 5 buttons */}
                    {totalButtons > 5 && (
                      <div className="h-[1px] mx-6 mb-4" style={{ background: "#2a2a2e" }} />
                    )}
                    <div className={`px-6 pb-5 grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {/* Discord - single click = username, double click = ID */}
                    {location.discord && (
                      <div className="relative">
                        <motion.button 
                          className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer w-full" 
                          style={{ background: "#232326" }}
                          whileHover={{ scale: 1.05, background: "#5865F2" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigator.clipboard.writeText(location.discord!).then(() => onShowStatus?.("Discord username copied!"))}
                          onDoubleClick={() => location.discordId && navigator.clipboard.writeText(location.discordId).then(() => onShowStatus?.("Discord ID copied!"))}
                          onMouseEnter={() => showTooltips && handleTooltipHover(setDiscordTooltip, true)}
                          onMouseLeave={() => setDiscordTooltip(false)}
                        >
                          <MessageCircle size={18} className="action-icon" />
                          <span className="text-[11px] font-medium action-text">Discord</span>
                        </motion.button>
                        {/* Tooltip */}
                        <AnimatePresence>
                          {discordTooltip && showTooltips && (
                            <motion.div
                              className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] whitespace-nowrap z-50"
                              style={{ background: "rgba(0,0,0,0.85)" }}
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <span style={{ color: "#ccc" }}>1x user{location.discordId ? " • 2x ID" : ""}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {/* YouTube */}
                    {location.youtube && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#FF0000" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(location.youtube, "_blank")}
                      >
                        <Youtube size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">YouTube</span>
                      </motion.button>
                    )}
                    {/* Phone */}
                    {location.phone && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#34C759" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigator.clipboard.writeText(location.phone!).then(() => onShowStatus?.("Phone copied!"))}
                      >
                        <Phone size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">Phone</span>
                      </motion.button>
                    )}
                    {/* Telegram - single click = copy @, double click = ID */}
                    {location.telegram && (
                      <div className="relative">
                        <motion.button 
                          className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer w-full" 
                          style={{ background: "#232326" }}
                          whileHover={{ scale: 1.05, background: "#0088cc" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigator.clipboard.writeText(location.telegram!).then(() => onShowStatus?.("Telegram @ copied!"))}
                          onDoubleClick={() => location.telegramId && navigator.clipboard.writeText(location.telegramId).then(() => onShowStatus?.("Telegram ID copied!"))}
                          onMouseEnter={() => showTooltips && handleTooltipHover(setTelegramTooltip, true)}
                          onMouseLeave={() => setTelegramTooltip(false)}
                        >
                          <Send size={18} className="action-icon" />
                          <span className="text-[11px] font-medium action-text">Telegram</span>
                        </motion.button>
                        {/* Tooltip */}
                        <AnimatePresence>
                          {telegramTooltip && showTooltips && (
                            <motion.div
                              className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] whitespace-nowrap z-50"
                              style={{ background: "rgba(0,0,0,0.85)" }}
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <span style={{ color: "#ccc" }}>1x @{location.telegramId ? " • 2x ID" : ""}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {/* VK */}
                    {location.vk && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#4C75A3" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(location.vk!.startsWith('http') ? location.vk : `https://${location.vk}`, '_blank')}
                      >
                        <span className="text-xs font-bold action-icon">VK</span>
                        <span className="text-[11px] font-medium action-text">VK</span>
                      </motion.button>
                    )}
                    {/* GitHub */}
                    {location.github && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#333" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(`https://github.com/${location.github}`, '_blank')}
                      >
                        <Github size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">GitHub</span>
                      </motion.button>
                    )}
                    {/* Steam */}
                    {location.steam && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#1b2838" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(location.steam!.startsWith('http') ? location.steam : `https://${location.steam}`, '_blank')}
                      >
                        <Gamepad2 size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">Steam</span>
                      </motion.button>
                    )}
                    {/* Website */}
                    {location.website && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#3b82f6" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(location.website!.startsWith('http') ? location.website : `https://${location.website}`, '_blank')}
                      >
                        <Globe size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">Website</span>
                      </motion.button>
                    )}
                    {/* Share */}
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
                    {/* Save */}
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
                    {/* Delete (admin only) */}
                    {isAdmin && onDelete && (
                      <motion.button 
                        className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-3 rounded-2xl cursor-pointer" 
                        style={{ background: "#232326" }}
                        whileHover={{ scale: 1.05, background: "#ff3b30" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => location && onDelete(location.id)}
                      >
                        <Trash2 size={18} className="action-icon" />
                        <span className="text-[11px] font-medium action-text">Delete</span>
                      </motion.button>
                    )}
                  </div>
                  </>
                );
              })()}

              {/* Divider */}
              <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />

              {/* Age */}
              {location.age && (
                <div className="px-6 py-5">
                  <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>AGE</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc" }}>
                    {location.age}
                  </p>
                </div>
              )}

              {/* About */}
              {location.about && (
                <div className="px-6 py-5">
                  <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>ABOUT</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {truncateText(location.about, 200)}
                  </p>
                </div>
              )}

              {/* Why Notable */}
              {location.reason && (
                <>
                  <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>WHY NOTABLE</h3>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {truncateText(location.reason, 200)}
                    </p>
                  </div>
                </>
              )}

              {/* Notable Action */}
              {location.notableAction && (
                <>
                  <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>NOTABLE ACTION</h3>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {truncateText(location.notableAction, 200)}
                    </p>
                  </div>
                </>
              )}

              {/* Worked For */}
              {location.workedFor && (
                <>
                  <div className="h-[1px] mx-6" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>WORKED FOR</h3>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "#c7c7cc" }}>
                      {location.workedFor}
                    </p>
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />

              {/* Quality & Verification Status */}
              <div className="px-6 py-5">
                <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>STATUS</h3>

                {/* Verified badge */}
                <div className="flex items-center gap-3 mb-5">
                  {location.verified ? (
                    <button 
                      onClick={() => isAdmin && onToggleVerified?.(location.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isAdmin ? 'cursor-pointer' : ''}`}
                      style={{ background: "rgba(52, 199, 89, 0.15)" }}
                    >
                      <BadgeCheck size={18} style={{ color: "#34C759" }} />
                      <span className="text-sm font-semibold" style={{ color: "#34C759" }}>Verified</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => isAdmin && onToggleVerified?.(location.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isAdmin ? 'cursor-pointer' : ''}`}
                      style={{ background: "rgba(255, 149, 0, 0.15)" }}
                    >
                      <ShieldAlert size={18} style={{ color: "#FF9500" }} />
                      <span className="text-sm font-semibold" style={{ color: "#FF9500" }}>Unverified</span>
                    </button>
                  )}
                  {isAdmin && <span className="text-[10px]" style={{ color: "#636366" }}>Click to toggle</span>}
                </div>

                {/* Quality rating display */}
                {location.rating != null && location.rating > 0 ? (
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
                      <span className="text-[13px]" style={{ color: "#8e8e93" }}>Quality Rating</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[13px]" style={{ color: "#8e8e93" }}>Not yet rated</span>
                )}

                {/* Relations / Connections - as badges with pics */}
                {location.relations && location.relations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-4" style={{ color: "#8e8e93" }}>CONNECTIONS</h3>
                    <div className="flex flex-wrap gap-3">
                      {location.relations.map((rel, idx) => {
                        const relData = typeof rel === 'string' ? { name: rel } : rel;
                        return (
                          <motion.button
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
                            style={{ background: "rgba(6, 182, 212, 0.12)" }}
                            whileHover={{ scale: 1.05, background: "rgba(6, 182, 212, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onShowStatus?.(`Search for "${relData.name}" in the search bar`)}
                          >
                            {relData.imageUrl ? (
                              <img src={relData.imageUrl} alt={relData.name} className="w-7 h-7 rounded-full object-cover" />
                            ) : (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#06b6d4" }}>
                                <User size={12} style={{ color: "#000" }} />
                              </div>
                            )}
                            <span className="text-sm font-medium" style={{ color: "#06b6d4" }}>{relData.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Rate Quality */}
              {isAdmin && onSetRating && (
                <>
                  <div className="h-[1px] mx-6 mt-8 mb-8" style={{ background: "#2a2a2e" }} />
                  <div className="px-6 py-5">
                    <h3 className="text-[12px] font-semibold tracking-wider mb-5" style={{ color: "#8e8e93" }}>RATE QUALITY (ADMIN)</h3>
                    
                    {/* Star picker */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
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
                                size={28}
                                fill={isActive ? "#d4af37" : "transparent"}
                                color={isActive ? "#d4af37" : "#48484a"}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="ml-auto px-5 py-2.5 rounded-xl flex items-center justify-center cursor-pointer text-sm font-semibold"
                        style={{ 
                          background: canSubmit ? "#d4af37" : "#2a2a2e", 
                          color: canSubmit ? "#000" : "#636366",
                          opacity: canSubmit ? 1 : 0.5,
                        }}
                      >
                        Set Rating
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
