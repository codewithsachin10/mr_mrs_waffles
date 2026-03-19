const admin = require('firebase-admin');
const { menuItems, categories, siteSettings } = require('../src/lib/mockData');

// Initialize Firebase Admin
// We use environmental credentials for simplest local run if gcloud is authed
admin.initializeApp({
  projectId: "waffle-shop-9677"
});

const db = admin.firestore();

async function migrate() {
  console.log("🚀 Starting migration...");

  // 1. Migrate Categories
  console.log("📦 Migrating Categories...");
  for (const cat of categories) {
    const { id, ...data } = cat;
    await db.collection('categories').doc(id).set(data);
    console.log(`✅ Category: ${data.name}`);
  }

  // 2. Migrate Menu Items
  console.log("🍕 Migrating Menu Items...");
  for (const item of menuItems) {
    const { id, ...data } = item;
    await db.collection('menu_items').doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Item: ${data.name}`);
  }

  // 3. Migrate Settings
  console.log("⚙️ Migrating Settings...");
  await db.collection('settings').doc('global').set(siteSettings);
  console.log(`✅ Global Settings`);

  console.log("✨ Migration Complete!");
}

migrate().catch(console.error);
