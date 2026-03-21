"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reward, RewardResult, GameReward, Game } from "@/lib/gameTypes";
import { selectWeightedReward, playSound, triggerHaptic } from "@/lib/gameUtils";
import { Sparkles, MousePointer2 } from "lucide-react";

interface ScratchCardProps {
  game: Game;
  gameRewards: GameReward[];
  onResult: (gameResult: RewardResult) => void;
  disabled?: boolean;
}

export default function ScratchCard({
  game,
  gameRewards,
  onResult,
  disabled = false,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<RewardResult | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);

  // Initialize reward
  useEffect(() => {
    if (!result && gameRewards.length > 0) {
      const selected = selectWeightedReward(gameRewards);
      setResult({
        reward: selected.reward,
        win: selected.reward?.rewardType !== "no_reward",
        claimCode: `WIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        message: selected.reward?.rewardType !== "no_reward" ? game.winMessage : game.loseMessage,
      });
    }
  }, [gameRewards, result, game]);

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add metallic texture overlay
      ctx.fillStyle = "rgba(40, 20, 10, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text on the scratch surface
      ctx.fillStyle = "#D4A373";
      ctx.font = "bold 24px italic sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 + 10);
    };
  }, []);

  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparentPixels++;
    }

    const progress = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > (game.config?.scratchThreshold || 50) && !revealed) {
      setRevealed(true);
      if (result) {
         playSound(result.win ? "win" : "lose");
         triggerHaptic("heavy");
         onResult(result);
      }
    }
  }, [revealed, result, onResult, game]);

  const scratch = (e: any) => {
    if (disabled || revealed || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use sound and haptics sparingly for texture feel
    if (Math.random() > 0.95) {
      playSound("scratch");
      triggerHaptic("light");
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative group perspective">
        {/* The Actual Reward (Revealed underneath) */}
        <div className="absolute inset-0 bg-gradient-to-br from-chocolate-900 to-chocolate-950 rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
          <AnimatePresence>
            {result?.reward && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-6xl drop-shadow-[0_0_20px_rgba(212,163,115,0.4)]">
                  {result.reward.displayIcon}
                </div>
                <h3 className="text-2xl font-heading font-black italic text-cream-50 leading-tight">
                  {result.reward.name}
                </h3>
                <p className="text-caramel-500 text-xs font-black uppercase tracking-widest">
                  {result.reward.description}
                </p>
              </motion.div>
            )}
            {!result?.reward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 opacity-30"
              >
                <div className="text-5xl">🍩</div>
                <p className="text-cream-100 font-bold italic">Better Luck Next Time!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scratch Surface Canvas */}
        <motion.canvas
          ref={canvasRef}
          width={320}
          height={200}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{ duration: 0.8 }}
          onMouseDown={() => { setIsDrawing(true); playSound('click'); }}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={scratch}
          className={`relative z-10 w-[300px] h-[180px] md:w-[400px] md:h-[240px] cursor-crosshair rounded-3xl shadow-2xl transition-all duration-300 ${
            revealed ? "pointer-events-none" : "hover:scale-[1.02]"
          }`}
        />

        {/* Guide Tooltip */}
        {!revealed && !isDrawing && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-cream-100/40 font-black uppercase tracking-[0.2em]"
           >
             <MousePointer2 size={12} className="text-caramel-500 animate-bounce" />
             Hold and Scratch
           </motion.div>
        )}

        {/* Scratch Sparkles */}
        <AnimatePresence>
          {isDrawing && (
            <motion.div
              key="sparkle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none z-20 inset-0"
            >
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-caramel-500/30 animate-pulse" size={60} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      {!revealed && (
        <div className="w-full max-w-[200px]">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scratchProgress}%` }}
              className="h-full bg-caramel-500 shadow-[0_0_10px_rgba(212,163,115,0.5)]"
            />
          </div>
          <p className="text-[9px] text-cream-100/20 font-black uppercase text-center mt-2 tracking-widest">
            {Math.round(scratchProgress)}% Cleared
          </p>
        </div>
      )}
    </div>
  );
}
