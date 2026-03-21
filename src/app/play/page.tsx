"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { collection, getDocs, addDoc, serverTimestamp, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Game, GameReward, GameSettings, Reward, RewardResult, GamePlay } from "@/lib/gameTypes";
import { getDeviceId, getSessionId, canPlay, playSound, triggerHaptic } from "@/lib/gameUtils";
import ScratchCard from "@/components/games/ScratchCard";
import SpinWheel from "@/components/games/SpinWheel";
import PickABox from "@/components/games/PickABox";
import RewardPopup from "@/components/games/RewardPopup";
import { Sparkles, ChevronLeft, Gamepad2, Gift, RotateCw, Package, Trophy, Users, Volume2, VolumeX } from "lucide-react";

const GAME_ICONS: Record<string, React.ReactNode> = {
  "scratch-card": <Sparkles size={28} />,
  "spin-wheel": <RotateCw size={28} />,
  "pick-a-box": <Package size={28} />,
};

export default function PlayPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [gameRewardsMap, setGameRewardsMap] = useState<Record<string, GameReward[]>>({});
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [result, setResult] = useState<RewardResult | null>(null);
  const [playBlock, setPlayBlock] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [recentPlays, setRecentPlays] = useState<GamePlay[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse trail effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesSnap, rewardsSnap, grSnap, settingsSnap, playsSnap] = await Promise.all([
          getDocs(collection(db, "games")),
          getDocs(collection(db, "rewards")),
          getDocs(collection(db, "game_rewards")),
          getDocs(collection(db, "game_settings")),
          getDocs(query(collection(db, "game_plays"), orderBy("playedAt", "desc"), limit(5)))
        ]);

        const gamesData = gamesSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Game))
          .filter((g) => g.isEnabled);
        setGames(gamesData);

        const rewardsData = rewardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
        setRewards(rewardsData);

        const rewardMap = new Map(rewardsData.map((r) => [r.id, r]));
        const grMap: Record<string, GameReward[]> = {};
        grSnap.docs.forEach(doc => {
          const gr = { id: doc.id, ...doc.data() } as GameReward;
          gr.reward = rewardMap.get(gr.rewardId);
          if (!grMap[gr.gameId]) grMap[gr.gameId] = [];
          grMap[gr.gameId].push(gr);
        });
        setGameRewardsMap(grMap);

        if (!settingsSnap.empty) setSettings(settingsSnap.docs[0].data() as GameSettings);
        setRecentPlays(playsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GamePlay)));

        const deviceId = getDeviceId();
        const allPlaysSnap = await getDocs(collection(db, "game_plays"));
        const allPlays = allPlaysSnap.docs.map(d => d.data() as GamePlay);

        const blocks: Record<string, string> = {};
        gamesData.forEach(game => {
          const gamePlays = allPlays.filter(p => p.gameSlug === game.slug && p.deviceId === deviceId);
          const check = canPlay(game.playLimitType, gamePlays, game.cooldownHours);
          if (!check.allowed) blocks[game.slug] = check.message;
        });
        setPlayBlock(blocks);

        if (gamesData.length === 1) setSelectedGame(gamesData[0].slug);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleResult = async (gameResult: RewardResult) => {
    if (!isMuted) playSound(gameResult.win ? "win" : "lose");
    triggerHaptic(gameResult.win ? "heavy" : "medium");
    setResult(gameResult);

    const game = games.find((g) => g.slug === selectedGame);
    if (game) {
      const playData = {
        gameId: game.id,
        gameSlug: game.slug,
        rewardId: gameResult.reward?.id || "",
        rewardName: gameResult.reward?.name || "No Reward",
        sessionId: getSessionId(),
        deviceId: getDeviceId(),
        claimed: false,
        claimCode: gameResult.claimCode,
        playedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "game_plays"), playData);
      setRecentPlays(prev => [playData as any, ...prev].slice(0, 5));
      setPlayBlock(prev => ({ ...prev, [game.slug]: "Played! See you soon 🍫" }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0505] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-caramel-500/10 border-t-caramel-500 rounded-full" />
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0505] relative overflow-hidden font-sans selection:bg-caramel-500/30">
      {/* Immersive Cursor Glow */}
      <motion.div
        animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 150, mass: 0.5 }}
        className="fixed inset-0 pointer-events-none z-0 opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(212,163,115,0.15) 0%, rgba(212,163,115,0) 70%)"
        }}
      />

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110%", x: Math.random() * 100 + "%" }}
            animate={{
              y: "-10%",
              rotate: 360,
              x: (Math.random() * 100) + (Math.sin(i) * 10) + "%"
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
            className="absolute text-4xl"
          >
            {["🍫", "🧁", "🧇", "🍓"][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Audio Control */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-8 right-8 z-50 p-3 bg-white/5 border border-white/10 rounded-full text-cream-100/40 hover:text-caramel-500 hover:bg-white/10 transition-all"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <header className="relative z-10 pt-12 pb-6 px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.a
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          href="/"
          className="group inline-flex items-center gap-2 text-cream-100/30 hover:text-caramel-500 transition-colors text-xs font-black uppercase tracking-widest mb-10"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          The Main Menu
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center relative"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-gradient-to-r from-caramel-500 to-amber-600 text-chocolate-950 text-[9px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full shadow-[0_10px_30px_rgba(212,163,115,0.3)]">
            <Trophy size={10} /> Limited Edition
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black italic text-cream-50 leading-tight tracking-tighter mt-4 drop-shadow-2xl">
            {settings?.sectionTitle || "Sweet Luck Rewards"}
          </h1>
          <p className="text-cream-100/30 text-base md:text-lg mt-4 italic font-bold max-w-xl mx-auto leading-relaxed">
            {settings?.sectionSubtitle || "One spin could change your dessert game forever."}
          </p>
        </motion.div>

        {/* Recent Winners Ticker */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-8 flex flex-wrap justify-center gap-3 px-4"
        >
          {recentPlays.map((p, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] text-cream-100/40 italic font-bold">
              <Users size={12} className="text-caramel-500/50" />
              Somebody just won {p.rewardName}! 🍫
            </div>
          ))}
        </motion.div>
      </header>

      <main className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedGame || games.length > 1 ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="grid gap-5 mt-10"
            >
              {!selectedGame && games.map((game, i) => {
                const blocked = playBlock[game.slug];
                return (
                  <motion.button
                    key={game.slug}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={!blocked ? { scale: 1.02, x: 10 } : {}}
                    onClick={() => {
                      if (!blocked) {
                        if(!isMuted) playSound('click');
                        setSelectedGame(game.slug);
                      }
                    }}
                    className={`w-full group bg-gradient-to-r from-chocolate-900/40 to-transparent backdrop-blur-3xl border border-white/5 rounded-full p-6 flex items-center gap-6 text-left transition-all duration-500 overflow-hidden relative ${
                      blocked ? "opacity-30 cursor-not-allowed" : "hover:border-caramel-500/50 hover:from-caramel-500/10"
                    }`}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-caramel-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 bg-caramel-500/10 border border-caramel-500/20 rounded-full flex items-center justify-center text-caramel-500 shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                      {GAME_ICONS[game.slug] || <Gift size={32} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-heading font-black italic text-cream-50 group-hover:text-caramel-500 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-cream-100/30 text-xs mt-1 italic font-bold tracking-tight">
                        {blocked ? "Limit reached for now" : game.description}
                      </p>
                    </div>
                    {!blocked && (
                      <div className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-caramel-500 bg-caramel-500/10 border border-caramel-500/20 px-6 py-3 rounded-full shrink-0 group-hover:bg-caramel-500 group-hover:text-chocolate-950 transition-all">
                        Let's Go
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : null}

          {selectedGame && (
            <motion.div
              key={selectedGame}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6"
            >
              {games.length > 1 && (
                <button
                  onClick={() => {
                    if(!isMuted) playSound('click');
                    setSelectedGame(null);
                    setResult(null);
                  }}
                  className="text-caramel-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-10 mx-auto bg-caramel-500/5 px-6 py-3 border border-caramel-500/20 rounded-full hover:bg-caramel-500/20 transition-all"
                >
                  <ChevronLeft size={14} /> Back to Selection
                </button>
              )}

              <div className="relative">
                <div className="absolute -inset-10 bg-caramel-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative bg-[#0F0A0A]/60 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-10 md:p-14 shadow-2xl">
                  {playBlock[selectedGame] ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="text-6xl animate-bounce">🍦</div>
                      <h3 className="text-2xl font-heading font-black italic text-cream-50">Sweetest Things Take Time</h3>
                      <p className="text-cream-100/30 italic font-bold max-w-xs mx-auto text-sm leading-relaxed">
                        {playBlock[selectedGame]}
                      </p>
                    </div>
                  ) : (
                    <>
                      {selectedGame === "scratch-card" && (
                        <ScratchCard
                          game={games.find(g => g.slug === "scratch-card")!}
                          gameRewards={gameRewardsMap["scratch-card"] || []}
                          onResult={handleResult}
                          disabled={!!playBlock[selectedGame]}
                        />
                      )}
                      {selectedGame === "spin-wheel" && (
                        <SpinWheel
                          game={games.find(g => g.slug === "spin-wheel")!}
                          gameRewards={gameRewardsMap["spin-wheel"] || []}
                          onResult={handleResult}
                          disabled={!!playBlock[selectedGame]}
                        />
                      )}
                      {selectedGame === "pick-a-box" && (
                        <PickABox
                          game={games.find(g => g.slug === "pick-a-box")!}
                          gameRewards={gameRewardsMap["pick-a-box"] || []}
                          onResult={handleResult}
                          disabled={!!playBlock[selectedGame]}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="mt-10 text-[11px] text-cream-100/15 leading-relaxed italic text-center max-w-sm mx-auto uppercase tracking-tighter"
              >
                * {games.find(g => g.slug === selectedGame)?.termsText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {result && (
        <RewardPopup
          result={result}
          onClose={() => setResult(null)}
          claimButtonText={games.find(g => g.slug === selectedGame)?.claimButtonText || "Claim Now"}
          enableConfetti={true}
        />
      )}
    </div>
  );
}
