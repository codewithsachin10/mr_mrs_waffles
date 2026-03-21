const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "waffle-shop-9677" });
}

const db = admin.firestore();

const REWARDS = [
  {
    name: "Free Brownie Laddu",
    code: "FREE_LADDU",
    description: "Get a free brownie laddu with your order",
    rewardType: "free_item",
    rewardValue: "Brownie Laddu",
    couponPrefix: "LADDU",
    probabilityWeight: 15,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 10,
    displayColor: "#D4A373",
    displayIcon: "🍫",
  },
  {
    name: "Free Oreo Add-on",
    code: "FREE_OREO",
    description: "Get free Oreo topping on any waffle",
    rewardType: "addon",
    rewardValue: "Oreo Add-on",
    couponPrefix: "OREO",
    probabilityWeight: 20,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 15,
    displayColor: "#3D2B1F",
    displayIcon: "🍪",
  },
  {
    name: "Free Choco Chips",
    code: "FREE_CHOCO",
    description: "Get free choco chips on any item",
    rewardType: "addon",
    rewardValue: "Choco Chips",
    couponPrefix: "CHOC",
    probabilityWeight: 25,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 20,
    displayColor: "#2D1B0E",
    displayIcon: "🍫",
  },
  {
    name: "₹10 Off",
    code: "DISC_10",
    description: "Get ₹10 off on your next order",
    rewardType: "discount",
    rewardValue: "10",
    couponPrefix: "SAVE",
    probabilityWeight: 15,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 10,
    displayColor: "#FFB347",
    displayIcon: "💰",
  },
  {
    name: "Free Cupcake",
    code: "FREE_CUPCAKE",
    description: "Get a free cupcake of your choice",
    rewardType: "free_item",
    rewardValue: "Cupcake",
    couponPrefix: "CAKE",
    probabilityWeight: 8,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 5,
    displayColor: "#FF4D6D",
    displayIcon: "🧁",
  },
  {
    name: "Better Luck Next Time",
    code: "NO_REWARD",
    description: "Try again tomorrow!",
    rewardType: "no_reward",
    rewardValue: "",
    couponPrefix: "",
    probabilityWeight: 40,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: -1,
    displayColor: "#666",
    displayIcon: "🍀",
  },
  {
    name: "Free Nutella Add-on",
    code: "FREE_NUTELLA",
    description: "Get free Nutella topping!",
    rewardType: "addon",
    rewardValue: "Nutella",
    couponPrefix: "NUTL",
    probabilityWeight: 10,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 8,
    displayColor: "#8B4513",
    displayIcon: "🥜",
  },
  {
    name: "₹20 Off",
    code: "DISC_20",
    description: "Get ₹20 off on orders above ₹150",
    rewardType: "discount",
    rewardValue: "20",
    couponPrefix: "BIG",
    probabilityWeight: 5,
    isActive: true,
    validFrom: "",
    validTo: "",
    stockLimit: -1,
    dailyLimit: 3,
    displayColor: "#E07A5F",
    displayIcon: "🎁",
  },
];

const GAMES = [
  {
    slug: "scratch-card",
    name: "Scratch Card",
    title: "Scratch & Win",
    subtitle: "Scratch the card to reveal your sweet surprise!",
    description: "Use your finger or mouse to scratch and uncover a hidden dessert reward.",
    icon: "✨",
    isEnabled: true,
    playLimitType: "daily",
    playsPerDay: 1,
    cooldownHours: 0,
    claimButtonText: "Show at Counter",
    winMessage: "Sweet! You won a treat! 🎉",
    loseMessage: "Better luck next time! 🍫",
    termsText: "One reward per bill. One play per customer per day. Rewards valid only at store. Cannot be combined with other offers. Shop decision is final.",
    enableConfetti: true,
    config: {
      scratchThreshold: 50,
      cardText: "Scratch to reveal your surprise",
    },
  },
  {
    slug: "spin-wheel",
    name: "Spin Wheel",
    title: "Spin & Win",
    subtitle: "Give the wheel a spin and win a dessert reward!",
    description: "Tap the spin button, watch the wheel go, and claim your prize!",
    icon: "🎡",
    isEnabled: true,
    playLimitType: "daily",
    playsPerDay: 1,
    cooldownHours: 0,
    claimButtonText: "Show at Counter",
    winMessage: "Congratulations! 🎊",
    loseMessage: "Almost there! Try again tomorrow 🌈",
    termsText: "One reward per bill. One play per customer per day. Rewards valid only at store. Cannot be combined with other offers. Shop decision is final.",
    enableConfetti: true,
    config: {
      spinDuration: 4000,
      pointerPosition: "top",
    },
  },
  {
    slug: "pick-a-box",
    name: "Pick a Box",
    title: "Pick & Win",
    subtitle: "Choose a mystery box and unlock your surprise!",
    description: "Pick one of the mystery boxes to reveal a hidden reward.",
    icon: "🎁",
    isEnabled: true,
    playLimitType: "daily",
    playsPerDay: 1,
    cooldownHours: 0,
    claimButtonText: "Show at Counter",
    winMessage: "You found a treat! 🎁",
    loseMessage: "Maybe next time! Keep trying 💪",
    termsText: "One reward per bill. One play per customer per day. Rewards valid only at store. Cannot be combined with other offers. Shop decision is final.",
    enableConfetti: true,
    config: {
      numberOfBoxes: 4,
      boxStyle: "gift",
    },
  },
];

async function seedGames() {
  console.log("🎮 Seeding Games & Rewards...\n");

  // 1. Seed rewards
  const rewardIds = [];
  for (const reward of REWARDS) {
    const ref = await db.collection("rewards").add({
      ...reward,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    rewardIds.push({ id: ref.id, code: reward.code, name: reward.name });
    console.log(`  ✅ Reward: ${reward.name} (${ref.id})`);
  }

  // 2. Seed games
  for (const game of GAMES) {
    const ref = await db.collection("games").doc(game.slug).set({
      ...game,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Game: ${game.name}`);

    // 3. Create game_rewards mappings (all rewards for all games)
    for (let i = 0; i < rewardIds.length; i++) {
      await db.collection("game_rewards").add({
        gameId: game.slug,
        rewardId: rewardIds[i].id,
        displayOrder: i,
        isActive: true,
      });
    }
    console.log(`     → ${rewardIds.length} rewards linked`);
  }

  // 4. Seed game settings
  await db.collection("game_settings").doc("global").set({
    sectionTitle: "Play & Win a Sweet Surprise",
    sectionSubtitle: "Try your luck and unlock a dessert reward",
    globalTerms: "One reward per bill. One play per customer per day. Rewards valid only at store. Cannot be combined with other offers. Shop decision is final.",
    spinButtonText: "Spin Now!",
    scratchInstructions: "Use your finger or mouse to scratch",
    pickInstructions: "Tap a box to reveal your surprise",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("  ✅ Global game settings\n");

  console.log("✨ Games & Rewards seeded successfully!");
}

seedGames().catch(console.error);
