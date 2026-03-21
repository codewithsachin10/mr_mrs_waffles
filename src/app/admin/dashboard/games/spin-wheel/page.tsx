"use client";

import GameSettingsEditor from "@/components/admin/GameSettingsEditor";

export default function SpinWheelSettingsPage() {
  return (
    <GameSettingsEditor
      gameSlug="spin-wheel"
      gameName="Spin Wheel"
      extraSettings={
        <div className="space-y-4">
          <p className="text-cream-100/30 text-xs italic">
            Configure the spin wheel animation and behavior.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
                Spin Duration (ms)
              </label>
              <p className="text-cream-100/20 text-[10px] italic mb-2">
                How long the wheel spins. Default: 4000ms (4 seconds)
              </p>
              <input
                type="number"
                defaultValue={4000}
                min={2000}
                max={8000}
                step={500}
                className="w-full bg-chocolate-900/60 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
              />
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
                Pointer Position
              </label>
              <p className="text-cream-100/20 text-[10px] italic mb-2">
                Where the pointer indicator sits. Default: Top
              </p>
              <select
                defaultValue="top"
                className="w-full bg-chocolate-900/60 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
              >
                <option value="top" className="bg-chocolate-950">Top</option>
                <option value="right" className="bg-chocolate-950">Right</option>
              </select>
            </div>
          </div>
        </div>
      }
    />
  );
}
