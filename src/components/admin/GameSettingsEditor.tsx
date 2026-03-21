"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Game, Reward, GameReward } from "@/lib/gameTypes";
import Link from "next/link";
import { ChevronLeft, Save, ToggleLeft, ToggleRight, Eye, Sparkles, PartyPopper, AlertCircle, Check } from "lucide-react";

interface GameSettingsEditorProps {
  gameSlug: string;
  gameName: string;
  extraSettings?: React.ReactNode;
}

export default function GameSettingsEditor({ gameSlug, gameName, extraSettings }: GameSettingsEditorProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [gameRewards, setGameRewards] = useState<GameReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const gameDoc = await getDoc(doc(db, "games", gameSlug));
        if (gameDoc.exists()) {
          setGame({ id: gameDoc.id, ...gameDoc.data() } as Game);
        }

        const rewardsSnap = await getDocs(collection(db, "rewards"));
        setRewards(rewardsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Reward)));

        const grSnap = await getDocs(collection(db, "game_rewards"));
        const all = grSnap.docs.map(d => ({ id: d.id, ...d.data() } as GameReward));
        setGameRewards(all.filter(gr => gr.gameId === gameSlug));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gameSlug]);

  const handleSave = async () => {
    if (!game) return;
    setSaving(true);
    try {
      const { id, createdAt, ...data } = game as any;
      await updateDoc(doc(db, "games", gameSlug), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setGame((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const updateConfig = (field: string, value: any) => {
    setGame((prev) => prev ? { ...prev, config: { ...prev.config, [field]: value } } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-caramel-500/20 border-t-caramel-500 rounded-full" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-rose-400 mx-auto mb-4" />
        <p className="text-cream-100/40 italic font-bold">Game not found. Run the seed script first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin/dashboard/games" className="text-caramel-500 text-xs font-bold flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft size={12} /> Back to Games
          </Link>
          <h1 className="text-2xl font-heading font-black italic text-cream-50">{gameName} Settings</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/play" target="_blank" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-cream-100/60 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
            <Eye size={14} /> Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-caramel-500 text-chocolate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-colors disabled:opacity-50 shadow-lg"
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? "Saving..." : "Save Changes"}</>}
          </button>
        </div>
      </div>

      {/* Enable/Disable */}
      <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-black italic text-cream-50">Game Status</h2>
            <p className="text-cream-100/30 text-xs mt-1 italic">Enable or disable this game on the customer website</p>
          </div>
          <button
            onClick={() => updateField("isEnabled", !game.isEnabled)}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
              game.isEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-cream-100/30"
            }`}
          >
            {game.isEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            <span className="text-xs font-black uppercase tracking-widest">
              {game.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </button>
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
        <h2 className="text-lg font-heading font-black italic text-cream-50">Content & Text</h2>
        
        <div className="grid gap-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Game Title</label>
            <input
              value={game.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Subtitle / Instructions</label>
            <input
              value={game.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Win Message</label>
              <input
                value={game.winMessage}
                onChange={(e) => updateField("winMessage", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Lose Message</label>
              <input
                value={game.loseMessage}
                onChange={(e) => updateField("loseMessage", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Claim Button Text</label>
            <input
              value={game.claimButtonText}
              onChange={(e) => updateField("claimButtonText", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Terms & Conditions</label>
            <textarea
              value={game.termsText}
              onChange={(e) => updateField("termsText", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Play Rules */}
      <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
        <h2 className="text-lg font-heading font-black italic text-cream-50">Play Rules & Limits</h2>
        
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Play Limit Type</label>
            <select
              value={game.playLimitType}
              onChange={(e) => updateField("playLimitType", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
            >
              <option value="unlimited" className="bg-chocolate-950">Unlimited</option>
              <option value="session" className="bg-chocolate-950">One per Session</option>
              <option value="daily" className="bg-chocolate-950">One per Day</option>
              <option value="device" className="bg-chocolate-950">One per Device</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Cooldown Hours</label>
            <input
              type="number"
              value={game.cooldownHours}
              onChange={(e) => updateField("cooldownHours", parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none transition-colors"
              min={0}
            />
          </div>
        </div>

        {/* Confetti Toggle */}
        <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <PartyPopper size={16} className="text-caramel-500" />
            <div>
              <span className="text-sm text-cream-50 font-bold">Confetti on Win</span>
              <p className="text-[10px] text-cream-100/20 mt-0.5">Show confetti animation when user wins</p>
            </div>
          </div>
          <button
            onClick={() => updateField("enableConfetti", !game.enableConfetti)}
            className={`transition-colors ${game.enableConfetti ? "text-emerald-400" : "text-cream-100/20"}`}
          >
            {game.enableConfetti ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      {/* Game-Specific Settings */}
      {extraSettings && (
        <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
          <h2 className="text-lg font-heading font-black italic text-cream-50">Game-Specific Settings</h2>
          {typeof extraSettings === "function"
            ? (extraSettings as any)({ game, updateConfig })
            : extraSettings}
        </div>
      )}

      {/* Linked Rewards */}
      <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-heading font-black italic text-cream-50">Linked Rewards</h2>
          <Link href="/admin/dashboard/rewards" className="text-caramel-500 text-xs font-bold hover:underline">
            Manage Rewards →
          </Link>
        </div>
        
        <div className="grid gap-3">
          {rewards.filter(r => r.isActive).map((reward) => (
            <div key={reward.id} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{reward.displayIcon}</span>
                <div>
                  <span className="text-sm text-cream-50 font-bold">{reward.name}</span>
                  <p className="text-[10px] text-cream-100/20">{reward.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-cream-100/20 font-bold">Weight: {reward.probabilityWeight}</span>
                <span className={`w-2 h-2 rounded-full ${reward.isActive ? "bg-emerald-400" : "bg-white/10"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
