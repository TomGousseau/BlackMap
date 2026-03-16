"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
import { useState } from "react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setUsername("");
        setPassword("");
        onSuccess();
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed left-1/2 top-1/2 z-[80] w-full max-w-sm px-4"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ scale: 0.9, opacity: 0, y: "-45%" }}
            animate={{ scale: 1, opacity: 1, y: "-50%" }}
            exit={{ scale: 0.9, opacity: 0, y: "-45%" }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
          >
            <div className="glass-strong rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
              {/* Purple top bar */}
              <div className="h-1.5" style={{ background: "linear-gradient(90deg, #8b5cf6, #af52de, #d946ef)" }} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(175, 82, 222, 0.15)" }}>
                      <Shield size={20} style={{ color: "#af52de" }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: "#af52de" }}>Admin Login</h2>
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

                <div className="space-y-3">
                  {/* Username */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-text-secondary)" }}>
                      Password
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      type="password"
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-center" style={{ color: "#ff3b30" }}>{error}</p>
                  )}

                  {/* Login button */}
                  <motion.button
                    onClick={handleLogin}
                    disabled={!username.trim() || !password.trim() || loading}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40 mt-1"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6, #af52de)",
                      boxShadow: "0 4px 15px rgba(175, 82, 222, 0.3)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
