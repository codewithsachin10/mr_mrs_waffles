"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reward, Game, GameReward, RewardResult } from "@/lib/gameTypes";
import { selectWeightedReward, playSound, triggerHaptic } from "@/lib/gameUtils";
import { MoveRight, PackageCheck, Sparkles } from "lucide-react";

interface PickABoxProps {
  game: Game;
  gameRewards: GameReward[];
  onResult: (gameResult: RewardResult) => void;
  disabled?: boolean;
}

export default function PickABox({
  game,
  gameRewards,
  onResult,
  disabled = false,
}: PickABoxProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<RewardResult | null>(null);

  const numberOfBoxes = game.config?.numberOfBoxes || 4;

  const handlePick = (index: number) => {
    if (selectedIdx !== null || revealed || disabled) return;

    setSelectedIdx(index);
    playSound("click");
    triggerHaptic("medium");

    // Select reward
    const selected = selectWeightedReward(gameRewards);
    const winResult: RewardResult = {
      reward: selected.reward,
      win: selected.reward?.rewardType !== "no_reward",
      claimCode: `BOX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      message: selected.reward?.rewardType !== "no_reward" ? game.winMessage : game.loseMessage,
    };
    setResult(winResult);

    // Wait for animation
    setTimeout(() => {
      setRevealed(true);
      if (winResult) {
         playSound(winResult.win ? "win" : "lose");
         triggerHaptic("heavy");
         onResult(winResult);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(3, numberOfBoxes)} gap-6 perspective-1000`}>
        {[...Array(numberOfBoxes)].map((_, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={!revealed && selectedIdx === null ? { 
              scale: 1.05, 
              rotateY: 10,
              y: -5,
              transition: { duration: 0.2 } 
            } : {}}
            whileTap={!revealed && selectedIdx === null ? { scale: 0.95 } : {}}
            onClick={() => handlePick(i)}
            disabled={disabled || (selectedIdx !== null && selectedIdx !== i) || revealed}
            className={`group relative w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-center p-6 ${
              selectedIdx === i
                ? "bg-caramel-500/20 border-caramel-500 shadow-[0_20px_60px_rgba(212,163,115,0.3)] z-20 scale-110"
                : revealed 
                ? "bg-white/5 border-white/5 opacity-20 scale-90"
                : "bg-chocolate-900/40 border-white/10 hover:border-caramel-500/30"
            }`}
          >
            {/* Spotlight Effect for selected box */}
            {selectedIdx === i && (
              <motion.div
                layoutId="spotlight"
                className="absolute -inset-8 bg-caramel-500/20 rounded-full blur-[40px] z-[-1]"
              />
            )}

            <AnimatePresence mode="wait">
              {revealed && selectedIdx === i ? (
                <motion.div
                  initial={{ rotateY: 180, scale: 0 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                     {result?.reward?.displayIcon || "🍀"}
                  </div>
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 flex items-center justify-center text-caramel-500/30"
                  >
                     <Sparkles size={60} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`text-4xl transition-transform duration-500 ${selectedIdx === i ? "animate-bounce" : ""}`}>
                     🎁
                  </div>
                  <div className="h-1.5 w-8 bg-chocolate-950/40 rounded-full blur-[2px] mt-1" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection highlight border */}
            <motion.div
              animate={{ 
                opacity: selectedIdx === i && !revealed ? [0.2, 0.5, 0.2] : 0,
                borderWidth: selectedIdx === i ? [2, 4, 2] : 2
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-2 border-2 border-caramel-500/50 rounded-[2rem] pointer-events-none"
            />
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 text-[10px] text-cream-100/30 font-black uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-full border border-white/10"
      >
        <PackageCheck size={14} className="text-caramel-500" />
        {selectedIdx === null ? "Choose your destiny" : revealed ? "Destiny revealed" : "Opening the box..."}
      </motion.div>
    </div>
  );
}
