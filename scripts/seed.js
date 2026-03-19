const admin = require('firebase-admin');

// Initialize with project ID
admin.initializeApp({
  projectId: "waffle-shop-9677"
});

const db = admin.firestore();

async function seed() {
  console.log("🌱 Seeding Firestore...");

  // 1. Settings
  await db.collection('settings').doc('global').set({
    shopName: "Mr. & Mrs. Waffle & Brownie",
    tagline: "Sweets that make you smile",
    phone: "+91 99999 99999",
    whatsapp: "+91 99999 99999",
    instagram: "@mr_and_mrs_waffles",
    address: "Chocolate Lane, Sweet City"
  });
  console.log("✅ Settings seeded");

  // 2. Categories
  const categories = [
    { name: "Homemade Waffle", icon: "Waffle" },
    { name: "Homemade Brownie", icon: "IceCream" },
    { name: "Ice Cream", icon: "Milk" }
  ];

  for (const cat of categories) {
    await db.collection('categories').add(cat);
  }
  console.log("✅ Categories seeded");

  console.log("✨ Seed complete!");
}

seed().catch(console.error);
