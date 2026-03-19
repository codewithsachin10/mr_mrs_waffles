"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Zap, Star, Heart, Flame } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

const getBadgeIcon = (badge?: string) => {
  switch (badge) {
    case "Popular":
      return <Star size={12} className="fill-current" />;
    case "Hot":
      return <Flame size={12} className="fill-current" />;
    case "Signature":
      return <Sparkles size={12} className="fill-current" />;
    case "Sweet":
      return <Heart size={12} className="fill-current" />;
    case "Special":
      return <Zap size={12} className="fill-current" />;
    case "Value":
      return <Zap size={12} className="fill-current" />;
    default:
      return null;
  }
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="card-premium group relative bg-chocolate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-caramel-500/40 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,179,71,0.15)] flex flex-col h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-caramel-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative h-56 w-full overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-115 transition-transform duration-1000 brightness-95 group-hover:brightness-100"
          />
        ) : (
          <div className="w-full h-full bg-chocolate-800/40 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-caramel-500/5 to-transparent animate-pulse" />
            <span className="text-white/10 font-black italic text-2xl uppercase tracking-[0.2em] relative z-10 drop-shadow-lg">Delicious</span>
          </div>
        )}
        
        {/* Badge styling */}
        {item.badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 bg-caramel-500 text-chocolate-950 text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] border border-white/10">
              {getBadgeIcon(item.badge)}
              {item.badge}
            </span>
          </div>
        )}
        
        {/* Availability indicator Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white/60 font-black uppercase tracking-[0.5em] text-xs border border-white/20 px-4 py-2 rounded-full">Sold Out</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-chocolate-950/80 to-transparent" />
      </div>

      <div className="p-7 flex flex-col flex-grow relative group-hover:bg-caramel-500/5 transition-colors duration-700">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl md:text-2xl font-heading font-black italic text-cream-50 group-hover:text-caramel-500 transition-colors duration-500 leading-tight">
            {item.name}
          </h3>
          <div className="bg-caramel-500/10 border border-caramel-500/30 px-3.5 py-1.5 rounded-xl shrink-0 group-hover:bg-caramel-500 group-hover:border-caramel-500 transition-all duration-500 shadow-lg">
             <span className="text-lg font-black text-caramel-500 group-hover:text-chocolate-950 transition-colors duration-500">
                ₹{item.price}
             </span>
          </div>
        </div>

        {item.description && (
          <p className="text-cream-50/40 text-sm line-clamp-2 min-h-[40px] font-bold italic tracking-wide leading-relaxed mb-6">
            {item.description}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5 group-hover:border-caramel-500/20 transition-colors duration-700">
           {item.isAvailable ? (
             <span className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                Available 
             </span>
           ) : (
             <span className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Waitlist
             </span>
           )}
           
           <button className="text-[10px] uppercase font-black tracking-[0.2em] text-caramel-500 border-2 border-caramel-500/20 px-5 py-2.5 rounded-full hover:bg-caramel-500 hover:text-chocolate-950 hover:border-caramel-500 transition-all duration-500 active:scale-95 shadow-xl">
              Customize
           </button>
        </div>
      </div>
      
      {/* Decorative gradient inside */}
      <div className="absolute top-0 right-0 w-[50%] h-[1px] bg-gradient-to-l from-caramel-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[1px] bg-gradient-to-r from-caramel-500/20 to-transparent" />
    </motion.div>
  );
}
