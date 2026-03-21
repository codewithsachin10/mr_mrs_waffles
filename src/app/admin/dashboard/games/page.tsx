"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, doc, updateDoc, serverTimestamp, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Game, Reward, GamePlay } from "@/lib/gameTypes";
import Link from "next/link";
import { Sparkles, RotateCw, Package, Eye, Settings, ToggleLeft, ToggleRight, Gamepad2, Gift, BarChart3, Clock, Database, Check, Loader2 } from "lucide-react";

const INITIAL_REWARDS = [
  { name: "Free Brownie Laddu", code: "FREE_LADDU", description: "Get a free brownie laddu with your order", rewardType: "free_item", rewardValue: "Brownie Laddu", couponPrefix: "LADDU", probabilityWeight: 15, isActive: true, displayColor: "#D4A373", displayIcon: "🍫" },
  { name: "Free Oreo Add-on", code: "FREE_OREO", description: "Get free Oreo topping on any waffle", rewardType: "addon", rewardValue: "Oreo Add-on", couponPrefix: "OREO", probabilityWeight: 20, isActive: true, displayColor: "#3D2B1F", displayIcon: "🍪" },
  { name: "₹10 Off", code: "DISC_10", description: "Get ₹10 off on your next order", rewardType: "discount", rewardValue: "10", couponPrefix: "SAVE", probabilityWeight: 25, isActive: true, displayColor: "#FFB347", displayIcon: "💰" },
  { name: "Better Luck Next Time", code: "NO_REWARD", description: "Try again tomorrow!", rewardType: "no_reward", rewardValue: "", couponPrefix: "", probabilityWeight: 40, isActive: true, displayColor: "#666", displayIcon: "🍀" },
];

const INITIAL_GAMES = [
  { slug: "scratch-card", name: "Scratch Card", title: "Scratch & Win", subtitle: "Scratch the card to reveal your surprise!", description: "Use your finger or mouse to scratch and uncover a reward.", icon: "✨", isEnabled: true, playLimitType: "daily", playsPerDay: 1, cooldownHours: 0, claimButtonText: "Show at Counter", winMessage: "Sweet! You won! 🎉", loseMessage: "Better luck next time! 🍫", termsText: "One play per customer per day.", enableConfetti: true, config: { scratchThreshold: 50, cardText: "Scratch Here" } },
  { slug: "spin-wheel", name: "Spin Wheel", title: "Spin & Win", subtitle: "Give the wheel a spin!", description: "Tap the spin button and claim your prize!", icon: "🎡", isEnabled: true, playLimitType: "daily", playsPerDay: 1, cooldownHours: 0, claimButtonText: "Show at Counter", winMessage: "Congratulations! 🎊", loseMessage: "Try again tomorrow 🌈", termsText: "One play per customer per day.", enableConfetti: true, config: { spinDuration: 4000, pointerPosition: "top" } },
  { slug: "pick-a-box", name: "Pick a Box", title: "Pick & Win", subtitle: "Choose a mystery box!", description: "Pick one of the mystery boxes to reveal a hidden reward.", icon: "🎁", isEnabled: true, playLimitType: "daily", playsPerDay: 1, cooldownHours: 0, claimButtonText: "Show at Counter", winMessage: "You found a treat! 🎁", loseMessage: "Maybe next time!", termsText: "One play per customer per day.", enableConfetti: true, config: { numberOfBoxes: 4, boxStyle: "gift" } },
];

const GAME_ICONS: Record<string, React.ReactNode> = {
  "scratch-card": <Sparkles size={32} className="text-caramel-500" />,
  "spin-wheel": <RotateCw size={32} className="text-caramel-500" />,
  "pick-a-box": <Package size={32} className="text-caramel-500" />,
};

const GAME_SETTINGS_LINKS: Record<string, string> = {
  "scratch-card": "/admin/dashboard/games/scratch-card",
  "spin-wheel": "/admin/dashboard/games/spin-wheel",
  "pick-a-box": "/admin/dashboard/games/pick-a-box",
};

export default function GamesOverviewPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [plays, setPlays] = useState<GamePlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [gSnap, rSnap, pSnap] = await Promise.all([
        getDocs(collection(db, "games")),
        getDocs(collection(db, "rewards")),
        getDocs(collection(db, "game_plays")),
      ]);

      setGames(gSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Game)));
      setRewards(rSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Reward)));
      setPlays(pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as GamePlay)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const seedData = async () => {
    setSeeding(true);
    try {
      // 1. Seed Rewards
      const rewardIds: string[] = [];
      for (const r of INITIAL_REWARDS) {
        const ref = await addDoc(collection(db, "rewards"), {
          ...r,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        rewardIds.push(ref.id);
      }

      // 2. Seed Games
      for (const g of INITIAL_GAMES) {
        await setDoc(doc(db, "games", g.slug), {
          ...g,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 3. Link Rewards
        for (let i = 0; i < rewardIds.length; i++) {
          await addDoc(collection(db, "game_rewards"), {
            gameId: g.slug,
            rewardId: rewardIds[i],
            displayOrder: i,
            isActive: true,
          });
        }
      }

      await fetchData();
    } catch (err) {
      console.error("Seeding failed:", err);
    } finally {
      setSeeding(false);
    }
  };

  const toggleGame = async (game: Game) => {
    try {
      await updateDoc(doc(db, "games", game.slug), {
        isEnabled: !game.isEnabled,
        updatedAt: serverTimestamp(),
      });
      setGames((prev) =>
        prev.map((g) =>
          g.slug === game.slug ? { ...g, isEnabled: !g.isEnabled } : g
        )
      );
    } catch (err) {
      console.error("Error toggling game:", err);
    }
  };

  const activeGames = games.filter((g) => g.isEnabled).length;
  const totalRewards = rewards.filter((r) => r.isActive).length;
  const todayPlays = plays.filter((p) => {
    const playDate = p.playedAt?.toDate?.() || new Date(p.playedAt);
    const today = new Date();
    return playDate.toDateString() === today.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-caramel-500/20 border-t-caramel-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black italic text-cream-50 flex items-center gap-3">
            <Gamepad2 className="text-caramel-500" /> Games
          </h1>
          <p className="text-cream-100/30 text-sm mt-1 italic">Manage your Play & Win games</p>
        </div>
        <div className="flex gap-3">
          {games.length === 0 && (
            <button
              onClick={seedData}
              disabled={seeding}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
              {seeding ? "Initializing..." : "Initialize Games"}
            </button>
          )}
          <Link
            href="/play"
            target="_blank"
            className="inline-flex items-center gap-2 bg-caramel-500/10 border border-caramel-500/20 text-caramel-500 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-caramel-500/20 transition-colors"
          >
            <Eye size={14} /> Preview Games
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Games", value: games.length, icon: Gamepad2, color: "text-caramel-500" },
          { label: "Active Games", value: activeGames, icon: ToggleRight, color: "text-emerald-500" },
          { label: "Active Rewards", value: totalRewards, icon: Gift, color: "text-rose-400" },
          { label: "Today's Plays", value: todayPlays, icon: BarChart3, color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-chocolate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col gap-3">
            <stat.icon size={20} className={stat.color} />
            <div>
              <span className="text-2xl font-black text-cream-50">{stat.value}</span>
              <p className="text-[10px] text-cream-100/30 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Game Cards */}
      <div className="grid gap-6">
        {games.map((game, i) => {
          const gamePlays = plays.filter((p) => p.gameSlug === game.slug);
          const gameRewardCount = rewards.filter((r) => r.isActive).length; // Simplified

          return (
            <motion.div
              key={game.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-chocolate-900/40 border rounded-3xl p-6 ${
                game.isEnabled ? "border-caramel-500/20" : "border-white/5 opacity-60"
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                {/* Icon */}
                <div className="w-16 h-16 bg-caramel-500/10 border border-caramel-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  {GAME_ICONS[game.slug]}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-heading font-black italic text-cream-50">{game.name}</h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      game.isEnabled
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/5 text-cream-100/30 border border-white/10"
                    }`}>
                      {game.isEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-cream-100/30 text-xs mt-1 italic">{game.subtitle}</p>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <span className="text-[10px] text-cream-100/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Gift size={11} /> {gameRewardCount} rewards
                    </span>
                    <span className="text-[10px] text-cream-100/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <BarChart3 size={11} /> {gamePlays.length} total plays
                    </span>
                    <span className="text-[10px] text-cream-100/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={11} /> {game.playLimitType}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleGame(game)}
                    className={`p-3 rounded-xl transition-all ${
                      game.isEnabled
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-white/5 text-cream-100/30 hover:bg-white/10"
                    }`}
                    title={game.isEnabled ? "Disable game" : "Enable game"}
                  >
                    {game.isEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <Link
                    href={GAME_SETTINGS_LINKS[game.slug]}
                    className="p-3 rounded-xl bg-caramel-500/10 text-caramel-500 hover:bg-caramel-500/20 transition-all"
                    title="Edit settings"
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {games.length === 0 && (
        <div className="text-center py-16">
          <Gamepad2 size={48} className="text-cream-100/10 mx-auto mb-4" />
          <p className="text-cream-100/30 italic font-bold">No games found. Run the seed script to set up initial data.</p>
          <code className="text-[11px] text-caramel-500/60 mt-2 block">node scripts/seedGames.js</code>
        </div>
      )}
    </div>
  );
}
