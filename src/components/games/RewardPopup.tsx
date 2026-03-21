"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy, Check, PartyPopper } from "lucide-react";
import { RewardResult } from "@/lib/gameTypes";
import { useState, useEffect } from "react";

interface RewardPopupProps {
  result: RewardResult | null;
  onClose: () => void;
  claimButtonText: string;
  enableConfetti: boolean;
}

export default function RewardPopup({ result, onClose, claimButtonText, enableConfetti }: RewardPopupProps) {
  const [copied, setCopied] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (result?.win && enableConfetti) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ["#D4A373", "#FF4D6D", "#FFB347", "#E07A5F", "#F4A261", "#fff"][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
      }));
      setConfettiPieces(pieces);
    }
  }, [result, enableConfetti]);

  const copyCode = () => {
    if (result?.claimCode) {
      navigator.clipboard.writeText(result.claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-chocolate-950/90 backdrop-blur-md" onClick={onClose} />

        {/* Confetti */}
        {result.win && enableConfetti && confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
            animate={{ y: "100vh", opacity: 0, rotate: 720 }}
            transition={{ duration: 2.5 + Math.random(), delay: piece.delay, ease: "easeIn" }}
            className="fixed top-0 z-[201] pointer-events-none"
            style={{ left: `${piece.x}%`, width: piece.size, height: piece.size, backgroundColor: piece.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative z-[202] w-full max-w-md bg-gradient-to-b from-chocolate-900 to-chocolate-950 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Decorative glow */}
          <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full blur-[120px] ${result.win ? "bg-caramel-500/20" : "bg-white/5"}`} />

          <button onClick={onClose} className="absolute top-6 right-6 text-cream-100/30 hover:text-cream-50 transition-colors z-10">
            <X size={24} />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl ${
                result.win
                  ? "bg-caramel-500/20 border-2 border-caramel-500/30 shadow-[0_0_40px_rgba(212,163,115,0.2)]"
                  : "bg-white/5 border-2 border-white/10"
              }`}
            >
              {result.win ? (result.reward?.displayIcon || "🎉") : "🍀"}
            </motion.div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl font-heading font-black italic uppercase tracking-tight ${
                  result.win ? "text-caramel-500" : "text-cream-50/60"
                }`}
              >
                {result.win ? "You Won!" : "Next Time!"}
              </motion.h3>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-cream-100/40 text-sm font-bold italic"
              >
                {result.message}
              </motion.p>
            </div>

            {/* Reward Details */}
            {result.win && result.reward && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-caramel-500">Your Reward</span>
                  <h4 className="text-xl font-heading font-black italic text-cream-50">{result.reward.name}</h4>
                  <p className="text-cream-100/30 text-xs italic">{result.reward.description}</p>
                </div>

                {/* Coupon Code */}
                {result.claimCode && (
                  <div className="flex items-center justify-between bg-caramel-500/10 border border-caramel-500/20 rounded-xl px-5 py-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-caramel-500/60">Coupon Code</span>
                      <span className="text-lg font-black tracking-[0.15em] text-caramel-500">{result.claimCode}</span>
                    </div>
                    <button onClick={copyCode} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-caramel-500/60" />}
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-cream-100/20 italic">Valid today only. Show this code at the counter.</p>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 ${
                result.win
                  ? "bg-caramel-500 text-chocolate-950 hover:bg-caramel-600 shadow-[0_10px_30px_rgba(212,163,115,0.3)]"
                  : "bg-white/5 text-cream-100/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              {result.win ? claimButtonText : "Try Again Tomorrow"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>

  );
}
