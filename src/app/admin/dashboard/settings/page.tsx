"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Settings, 
  MapPin, 
  Phone, 
  Instagram, 
  Coffee, 
  Megaphone, 
  Tag, 
  ChevronRight,
  MessageCircle,
  Truck
} from "lucide-react";
import { siteSettings as mockSettings } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ShopSettings() {
  const [formData, setFormData] = useState<any>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const docRef = doc(db, "settings", "global");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "global"), formData);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
              Shop <span className="text-caramel-500">Settings</span>
           </h1>
           <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
              Configure branding, contact info, and store announcements.
           </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-4 bg-caramel-500 text-chocolate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-[0_4px_30px_rgba(212,163,115,0.2)] disabled:opacity-50"
        >
           {isSaving ? (
              <span className="w-4 h-4 border-2 border-chocolate-950 border-t-transparent rounded-full animate-spin" />
           ) : (
              <Save size={18} strokeWidth={3} />
           )}
           <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </section>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Basic Brand */}
        <motion.section 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-chocolate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-2xl"
        >
           <div className="flex items-center gap-4 text-caramel-500">
              <div className="p-3 bg-caramel-500/10 rounded-2xl">
                 <Coffee size={24} />
              </div>
              <h3 className="text-xl font-heading font-black italic text-cream-50 uppercase tracking-widest leading-none">
                 Branding <span className="text-caramel-500">& Hero</span>
              </h3>
           </div>
           
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Shop Display Name</label>
                 <input 
                    type="text" 
                    value={formData.shopName || ""}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Hero Tagline</label>
                 <textarea 
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    rows={2}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 resize-none"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Hero Badge Text</label>
                 <input 
                    type="text" 
                    value={formData.heroText || ""}
                    onChange={(e) => setFormData({...formData, heroText: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
           </div>
        </motion.section>

        {/* Announcements */}
        <motion.section 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="bg-chocolate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-2xl"
        >
           <div className="flex items-center gap-4 text-caramel-500">
              <div className="p-3 bg-caramel-500/10 rounded-2xl">
                 <Megaphone size={24} />
              </div>
              <h3 className="text-xl font-heading font-black italic text-cream-50 uppercase tracking-widest leading-none">
                 Announcements <span className="text-caramel-500">& Offers</span>
              </h3>
           </div>
           
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Main Announcement Text</label>
                 <textarea 
                    value={formData.announcementText || ""}
                    onChange={(e) => setFormData({...formData, announcementText: e.target.value})}
                    rows={3}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 resize-none font-medium italic"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Pre-order Status Text</label>
                 <input 
                    type="text" 
                    value={formData.preOrderText || ""}
                    onChange={(e) => setFormData({...formData, preOrderText: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
           </div>
        </motion.section>

        {/* Contact info */}
        <motion.section 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-chocolate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-2xl lg:col-span-2"
        >
           <div className="flex items-center gap-4 text-caramel-500">
              <div className="p-3 bg-caramel-500/10 rounded-2xl">
                 <Instagram size={24} />
              </div>
              <h3 className="text-xl font-heading font-black italic text-cream-50 uppercase tracking-widest leading-none">
                 Contact <span className="text-caramel-500">& Social</span>
              </h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1 flex items-center gap-2 underline decoration-caramel-500/50 underline-offset-4">
                    <Phone size={12} /> Phone Number
                 </label>
                 <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1 flex items-center gap-2 underline decoration-emerald-500/50 underline-offset-4">
                    <MessageCircle size={12} /> WhatsApp Number
                 </label>
                 <input 
                    type="text" 
                    value={formData.whatsapp || ""}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1 flex items-center gap-2 underline decoration-[#E1306C]/50 underline-offset-4">
                    <Instagram size={12} /> Instagram Profile
                 </label>
                 <input 
                    type="text" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                 />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1 flex items-center gap-2 underline decoration-caramel-500/50 underline-offset-4">
                    <MapPin size={12} /> Store Full Address
                 </label>
                 <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 resize-none"
                 />
              </div>
           </div>
        </motion.section>
      </form>
    </div>
  );
}
