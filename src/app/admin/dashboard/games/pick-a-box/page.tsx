"use client";

import GameSettingsEditor from "@/components/admin/GameSettingsEditor";

export default function PickABoxSettingsPage() {
  return (
    <GameSettingsEditor
      gameSlug="pick-a-box"
      gameName="Pick a Box"
      extraSettings={
        <div className="space-y-4">
          <p className="text-cream-100/30 text-xs italic">
            Configure the mystery box game style and number of boxes.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
                Number of Boxes
              </label>
              <p className="text-cream-100/20 text-[10px] italic mb-2">
                How many mystery boxes to show. Default: 4
              </p>
              <select
                defaultValue={4}
                className="w-full bg-chocolate-900/60 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
              >
                <option value={3} className="bg-chocolate-950">3 Boxes</option>
                <option value={4} className="bg-chocolate-950">4 Boxes</option>
                <option value={6} className="bg-chocolate-950">6 Boxes</option>
              </select>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
                Box Style
              </label>
              <p className="text-cream-100/20 text-[10px] italic mb-2">
                Visual style for the mystery boxes
              </p>
              <select
                defaultValue="gift"
                className="w-full bg-chocolate-900/60 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
              >
                <option value="gift" className="bg-chocolate-950">🎁 Gift Boxes</option>
                <option value="mystery" className="bg-chocolate-950">❓ Mystery Boxes</option>
                <option value="dessert" className="bg-chocolate-950">🧁 Dessert Boxes</option>
              </select>
            </div>
          </div>
        </div>
      }
    />
  );
}
