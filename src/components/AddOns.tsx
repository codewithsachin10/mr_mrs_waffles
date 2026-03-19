"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addOns as mockAddOns } from "@/lib/mockData";
import { Plus, Sparkles, Heart, Zap, Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

export default function AddOns() {
  const [items, setItems] = useState<AddOn[]>(mockAddOns);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "add_ons"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AddOn[];
      if (data.length > 0) setItems(data);
    });
    return () => unsubscribe();
  }, []);

  const getAddOnIcon = (name: string) => {
    if (name.includes("Choco")) return <Zap size={14} className="fill-current" />;
    if (name.includes("Oreo") || name.includes("Kitkat")) return <Star size={14} className="fill-current" />;
    if (name.includes("Nutella")) return <Heart size={14} className="fill-current" />;
    return <Sparkles size={14} />;
  };

  return (
    <section id="add-ons" className="container mx-auto px-4 py-24 scroll-mt-40 bg-chocolate-950/20 rounded-[3rem] mb-20 border border-white/5">
      <div className="flex flex-col items-center gap-5 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 bg-caramel-500/10 border border-caramel-500/30 px-6 py-2.5 rounded-full mb-4 shadow-[0_10px_30px_rgba(255,179,71,0.1)]"
        >
           <Sparkles size={18} className="text-caramel-500 fill-caramel-500 animate-pulse" />
           <span className="text-[10px] sm:text-xs font-black text-caramel-500 uppercase tracking-[0.5em] leading-none translate-y-[1px]">
              Customizations
           </span>
        </motion.div>
        <h2 className="text-4xl md:text-7xl font-heading font-black italic text-cream-50 uppercase tracking-widest leading-none drop-shadow-2xl">
           Extra <span className="text-caramel-500 text-glow">Add-ons</span>
        </h2>
        <div className="flex flex-col items-center gap-4 mt-8">
           <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-caramel-500 to-transparent" />
           <p className="text-cream-50/30 text-[10px] font-black uppercase tracking-[0.5em] italic bg-white/5 border border-white/5 px-8 py-3 rounded-full backdrop-blur-md shadow-2xl">
              All Add-ons at ₹10 each
           </p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {items.map((addon, index) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex items-center gap-4 bg-chocolate-900/60 backdrop-blur-3xl border border-white/10 pl-3 pr-8 py-3 rounded-full hover:border-caramel-500/50 hover:bg-caramel-500/10 transition-all duration-500 group cursor-default shadow-2xl border-white/5"
          >
            <div className="w-10 h-10 bg-caramel-500 rounded-full flex items-center justify-center text-chocolate-950 shadow-[0_5px_15px_rgba(255,179,71,0.3)] group-hover:bg-white group-hover:rotate-90 transition-all duration-500">
               {getAddOnIcon(addon.name)}
            </div>
            <div className="flex flex-col">
              <span className="text-cream-50 font-black tracking-tight text-xs uppercase group-hover:text-caramel-500 transition-colors duration-500 leading-none">
                {addon.name}
              </span>
              <span className="text-caramel-500 text-[10px] font-black tracking-widest italic opacity-60 group-hover:opacity-100 mt-1">
                 +₹{addon.price}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
