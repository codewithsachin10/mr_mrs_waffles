import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAblAznMXEZkWsEWl4AdWjFz4O9FND2P2o",
  authDomain: "waffle-shop-9677.firebaseapp.com",
  projectId: "waffle-shop-9677",
  storageBucket: "waffle-shop-9677.firebasestorage.app",
  messagingSenderId: "489986174503",
  appId: "1:489986174503:web:25efe05602bae470762802"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
