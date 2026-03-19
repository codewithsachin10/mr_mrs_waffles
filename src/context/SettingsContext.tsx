"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { siteSettings as mockSettings } from "@/lib/mockData";

export interface Settings {
  shopName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
}

const SettingsContext = createContext<Settings>(mockSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(mockSettings);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as Settings);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
