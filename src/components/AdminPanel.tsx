"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Check, X as XIcon, Star, Building2, Sparkles } from "lucide-react";
import type { BusinessProfile } from "@/lib/types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessProfile[];
  onApprove: (bizId: string) => void;
  onReject: (bizId: string) => void;
  onToggleImportant: (bizId: string) => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  businesses,
  onApprove,
  onReject,
  onToggleImportant,
}: AdminPanelProps) {
  const pendingBusinesses = businesses.filter((b) => !b.approved);
  const approvedBusinesses = businesses.filter((b) => b.approved);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden flex flex-col"
            style={{ boxShadow: "var(--shadow-lg)" }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
          >
            {/* Purple accent bar */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, #8b5cf6, #af52de, #d946ef)" }} />

            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(175, 82, 222, 0.15)" }}>
                  <Shield size={20} style={{ color: "#af52de" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#af52de" }}>Admin Panel</h2>
                  <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                    Approve businesses & manage importance
                  </p>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6" data-lenis-prevent>
              {/* Pending Approval Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    Pending Approval
                  </h3>
                  {pendingBusinesses.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "#ff3b30", color: "#fff" }}>
                      {pendingBusinesses.length}
                    </span>
                  )}
                </div>

                {pendingBusinesses.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl" style={{ background: "var(--color-surface)" }}>
                    <Check size={24} style={{ color: "#34c759", margin: "0 auto 8px" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      All caught up! No pending approvals.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingBusinesses.map((biz) => (
                      <motion.div
                        key={biz.id}
                        className="p-4 rounded-2xl flex items-center gap-4"
                        style={{ background: "var(--color-surface)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: "var(--color-surface-hover)" }}>
                          {biz.imageUrl ? (
                            <img src={biz.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={20} style={{ color: "var(--color-gold)" }} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                            {biz.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {biz.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(200,168,78,0.15)", color: "var(--color-gold)" }}>
                                {biz.category}
                              </span>
                            )}
                            <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                              Created {biz.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => onReject(biz.id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                            style={{ background: "rgba(255, 59, 48, 0.15)" }}
                            whileHover={{ scale: 1.1, background: "#ff3b30" }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <XIcon size={16} style={{ color: "#ff3b30" }} />
                          </motion.button>
                          <motion.button
                            onClick={() => onApprove(biz.id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                            style={{ background: "rgba(52, 199, 89, 0.15)" }}
                            whileHover={{ scale: 1.1, background: "#34c759" }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Check size={16} style={{ color: "#34c759" }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Businesses Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                  Approved Businesses ({approvedBusinesses.length})
                </h3>

                {approvedBusinesses.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl" style={{ background: "var(--color-surface)" }}>
                    <Building2 size={24} style={{ color: "var(--color-text-secondary)", margin: "0 auto 8px" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      No approved businesses yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {approvedBusinesses.map((biz) => (
                      <motion.div
                        key={biz.id}
                        className="p-4 rounded-2xl flex items-center gap-4"
                        style={{ background: "var(--color-surface)" }}
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: "var(--color-surface-hover)" }}>
                          {biz.imageUrl ? (
                            <img src={biz.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={20} style={{ color: "var(--color-gold)" }} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                              {biz.name}
                            </span>
                            {biz.important && (
                              <Sparkles size={14} style={{ color: "#af52de" }} />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {biz.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(200,168,78,0.15)", color: "var(--color-gold)" }}>
                                {biz.category}
                              </span>
                            )}
                            <div className="flex items-center gap-0.5">
                              <Star size={10} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />
                              <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                                {biz.reputation.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Toggle Important */}
                        <motion.button
                          onClick={() => onToggleImportant(biz.id)}
                          className="px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer text-xs font-medium"
                          style={{
                            background: biz.important ? "rgba(175, 82, 222, 0.2)" : "var(--color-surface-hover)",
                            color: biz.important ? "#af52de" : "var(--color-text-secondary)",
                            border: biz.important ? "1px solid rgba(175, 82, 222, 0.3)" : "1px solid transparent",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Sparkles size={14} />
                          {biz.important ? "Important" : "Mark Important"}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
