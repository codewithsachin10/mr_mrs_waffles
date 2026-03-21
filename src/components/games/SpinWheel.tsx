"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Reward, Game, GameReward, RewardResult } from "@/lib/gameTypes";
import { selectWeightedReward, getWheelColor, playSound, triggerHaptic } from "@/lib/gameUtils";

interface SpinWheelProps {
  game: Game;
  gameRewards: GameReward[];
  onResult: (gameResult: RewardResult) => void;
  disabled?: boolean;
}

export default function SpinWheel({
  game,
  gameRewards,
  onResult,
  disabled = false,
}: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeRewards = gameRewards.filter((gr) => gr.isActive);
  const spinDuration = game.config?.spinDuration || 4000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const segmentAngle = 360 / activeRewards.length;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    activeRewards.forEach((gr, i) => {
      const startAngle = ((i * segmentAngle - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = getWheelColor(i);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + (endAngle - startAngle) / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(gr.reward?.displayIcon || "🎁", radius - 30, 5);
      ctx.restore();
    });

    // Outer Ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#D4A373";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner Circle
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#0F0A0A";
    ctx.fill();
    ctx.strokeStyle = "#D4A373";
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [activeRewards]);

  const spin = () => {
    if (spinning || done || disabled || activeRewards.length === 0) return;

    setSpinning(true);
    playSound("spin");
    triggerHaptic("medium");

    const selectedReward = selectWeightedReward(activeRewards);
    const winIndex = activeRewards.findIndex((gr) => gr.rewardId === selectedReward.reward?.id);
    const segmentAngle = 360 / activeRewards.length;

    // Calculate rotation to land on the winner (center of segment)
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2);
    const extraSpins = 5;
    const totalRotation = rotation + extraSpins * 360 + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setDone(true);
      playSound(selectedReward.reward?.rewardType !== "no_reward" ? "win" : "lose");
      onResult({
        reward: selectedReward.reward,
        win: selectedReward.reward?.rewardType !== "no_reward",
        claimCode: `SPIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        message: selectedReward.reward?.rewardType !== "no_reward" ? game.winMessage : game.loseMessage,
      });
    }, spinDuration + 100);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-caramel-500 drop-shadow-[0_0_15px_rgba(212,163,115,0.5)]">
          <div className="w-8 h-8 bg-caramel-500 rounded-lg rotate-45 flex items-center justify-center">
             <div className="w-1 h-8 bg-chocolate-950 -rotate-45" />
          </div>
        </div>

        {/* Wheel container */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: spinDuration / 1000,
            ease: [0.32, 0.64, 0.45, 1],
          }}
          className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-full border-8 border-chocolate-900"
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full"
          />
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={spinning || done || disabled}
        className={`px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all shadow-xl ${
          spinning || done || disabled
            ? "bg-white/5 text-cream-100/20 cursor-not-allowed"
            : "bg-caramel-500 text-chocolate-950 hover:bg-caramel-400 hover:scale-110 active:scale-95 shadow-caramel-500/20"
        }`}
      >
        {spinning ? "Spinning..." : done ? "Result Revealed" : "Give it a Spin"}
      </button>
    </div>
  );
}
