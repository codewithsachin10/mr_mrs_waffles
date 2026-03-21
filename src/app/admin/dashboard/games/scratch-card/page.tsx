"use client";

import GameSettingsEditor from "@/components/admin/GameSettingsEditor";

export default function ScratchCardSettingsPage() {
  return (
    <GameSettingsEditor
      gameSlug="scratch-card"
      gameName="Scratch Card"
      extraSettings={
        <div className="space-y-4">
          <p className="text-cream-100/30 text-xs italic">
            Configure the scratch card behavior. The scratch threshold controls how much the user needs to scratch before the reward is revealed.
          </p>
          <div className="bg-white/5 rounded-xl p-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
              Scratch Threshold (% area to reveal)
            </label>
            <p className="text-cream-100/20 text-[10px] italic mb-2">
              How much of the card surface must be scratched to trigger the reveal. Default: 50%
            </p>
            <input
              type="range"
              min={20}
              max={80}
              defaultValue={50}
              className="w-full accent-caramel-500"
            />
            <div className="flex justify-between text-[9px] text-cream-100/20 font-bold mt-1">
              <span>20%</span>
              <span>50%</span>
              <span>80%</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
