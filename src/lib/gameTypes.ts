// ==========================================
// GAME TYPES & INTERFACES
// ==========================================

export interface Game {
  id: string;
  slug: "scratch-card" | "spin-wheel" | "pick-a-box";
  name: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  playLimitType: "session" | "daily" | "device" | "unlimited";
  playsPerDay: number;
  cooldownHours: number;
  claimButtonText: string;
  winMessage: string;
  loseMessage: string;
  termsText: string;
  enableConfetti: boolean;
  config: GameConfig;
  createdAt: any;
  updatedAt: any;
}

export interface GameConfig {
  // Scratch Card specific
  scratchThreshold?: number; // % area needed to reveal
  cardText?: string;

  // Spin Wheel specific
  spinDuration?: number; // ms
  pointerPosition?: "top" | "right";

  // Pick a Box specific
  numberOfBoxes?: number; // 3, 4, or 6
  boxStyle?: "gift" | "mystery" | "dessert";
}

export interface Reward {
  id: string;
  name: string;
  code: string;
  description: string;
  rewardType: "free_item" | "discount" | "addon" | "no_reward";
  rewardValue: string;
  couponPrefix: string;
  probabilityWeight: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  stockLimit: number;
  dailyLimit: number;
  displayColor: string;
  displayIcon: string;
  createdAt: any;
  updatedAt: any;
}

export interface GameReward {
  id: string;
  gameId: string;
  rewardId: string;
  displayOrder: number;
  isActive: boolean;
  // Denormalized for easy access
  reward?: Reward;
}

export interface GamePlay {
  id: string;
  gameId: string;
  gameSlug: string;
  rewardId: string;
  rewardName: string;
  sessionId: string;
  deviceId: string;
  claimed: boolean;
  claimCode: string;
  playedAt: any;
  claimedAt: any;
}

export interface GameSettings {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  globalTerms: string;
  spinButtonText: string;
  scratchInstructions: string;
  pickInstructions: string;
  updatedAt: any;
}

// ==========================================
// REWARD RESULT (used by game components)
// ==========================================

export interface RewardResult {
  reward: Reward | null;
  win: boolean;
  claimCode: string;
  message: string;
}
