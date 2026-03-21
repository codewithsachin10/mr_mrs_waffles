import { Reward, RewardResult, GameReward } from "./gameTypes";

// ==========================================
// WEIGHTED RANDOM SELECTION
// ==========================================

export function selectWeightedReward(gameRewards: GameReward[]): RewardResult {
  const activeRewards = gameRewards.filter(
    (gr) => gr.isActive && gr.reward && gr.reward.isActive
  );

  if (activeRewards.length === 0) {
    return {
      win: false,
      reward: null,
      claimCode: "",
      message: "No rewards available right now. Try again later!",
    };
  }

  const totalWeight = activeRewards.reduce(
    (sum, gr) => sum + (gr.reward?.probabilityWeight || 0),
    0
  );

  let random = Math.random() * totalWeight;

  for (const gr of activeRewards) {
    const weight = gr.reward?.probabilityWeight || 0;
    random -= weight;
    if (random <= 0 && gr.reward) {
      const isNoReward = gr.reward.rewardType === "no_reward";
      return {
        win: !isNoReward,
        reward: gr.reward,
        claimCode: isNoReward ? "" : generateClaimCode(gr.reward.couponPrefix),
        message: isNoReward
          ? "Better luck next time! 🍫"
          : `You won: ${gr.reward.name}! 🎉`,
      };
    }
  }

  // Fallback
  const lastReward = activeRewards[activeRewards.length - 1].reward!;
  return {
    win: lastReward.rewardType !== "no_reward",
    reward: lastReward,
    claimCode: generateClaimCode(lastReward.couponPrefix),
    message: `You won: ${lastReward.name}! 🎉`,
  };
}

// ==========================================
// COUPON CODE GENERATION
// ==========================================

export function generateClaimCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

// ==========================================
// SESSION / DEVICE ID
// ==========================================

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let deviceId = localStorage.getItem("wfl_device_id");
  if (!deviceId) {
    deviceId = "dev_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("wfl_device_id", deviceId);
  }
  return deviceId;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sessionId = sessionStorage.getItem("wfl_session_id");
  if (!sessionId) {
    sessionId = "ses_" + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("wfl_session_id", sessionId);
  }
  return sessionId;
}

// ==========================================
// PLAY LIMIT CHECK
// ==========================================

export function canPlay(
  limitType: string,
  plays: Array<{ playedAt: any; sessionId: string; deviceId: string }>,
  cooldownHours: number
): { allowed: boolean; message: string } {
  const deviceId = getDeviceId();
  const sessionId = getSessionId();
  const now = Date.now();

  if (limitType === "unlimited") return { allowed: true, message: "" };

  if (limitType === "session") {
    const sessionPlayed = plays.some((p) => p.sessionId === sessionId);
    if (sessionPlayed)
      return {
        allowed: false,
        message: "You've already played this session! Come back later 🍪",
      };
  }

  if (limitType === "device") {
    const devicePlayed = plays.some((p) => p.deviceId === deviceId);
    if (devicePlayed)
      return {
        allowed: false,
        message: "You've already played on this device! 🍫",
      };
  }

  if (limitType === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const playedToday = plays.some((p) => {
      const playTime =
        p.playedAt?.toDate?.()?.getTime?.() || p.playedAt || 0;
      return playTime >= todayMs && p.deviceId === deviceId;
    });
    if (playedToday)
      return {
        allowed: false,
        message: "You've already played today! Come back tomorrow 🌅",
      };
  }

  // Cooldown check
  if (cooldownHours > 0) {
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const recentPlay = plays.find((p) => {
      const playTime =
        p.playedAt?.toDate?.()?.getTime?.() || p.playedAt || 0;
      return p.deviceId === deviceId && now - playTime < cooldownMs;
    });
    if (recentPlay)
      return {
        allowed: false,
        message: `Come back in a few hours to play again! ⏰`,
      };
  }

  return { allowed: true, message: "" };
}

// ==========================================
// COLOR HELPERS
// ==========================================

export const WHEEL_COLORS = [
  "#D4A373", // caramel
  "#FF4D6D", // strawberry
  "#2D1B0E", // chocolate dark
  "#FFB347", // gold  
  "#E07A5F", // coral
  "#3D2B1F", // dark brown
  "#F4A261", // amber
  "#E76F51", // burnt orange
];

export function getWheelColor(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length];
}

// --- Senses (Sound & Haptics) ---

const SOUNDS = {
  win: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  lose: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  spin: "https://assets.mixkit.co/active_storage/sfx/131/131-preview.mp3",
  scratch: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
};

export const playSound = (type: keyof typeof SOUNDS) => {
  if (typeof window === "undefined") return;
  const audio = new Audio(SOUNDS[type]);
  audio.volume = type === 'spin' ? 0.2 : 0.5;
  audio.play().catch(() => {}); // Ignore Safari/Chrome blocks
};

export const triggerHaptic = (style: "light" | "medium" | "heavy" = "light") => {
  if (typeof window === "undefined" || !navigator.vibrate) return;
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [50],
  };
  navigator.vibrate(patterns[style]);
};

