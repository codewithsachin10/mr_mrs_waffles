"use client";

import Link from "next/link";
import { Coffee, Instagram, Phone, MapPin } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const settings = useSettings();
  return (
    <nav className="fixed top-0 left-0 right-0 z-[110] glass-nav transition-all duration-500 hover:bg-background/95">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative overflow-hidden">
        {/* Glowing background line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-caramel-500/30 to-transparent" />
        
        <Link href="/" className="flex items-center gap-3 group relative">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-12 h-12 bg-caramel-500 rounded-full flex items-center justify-center text-chocolate-950 shadow-[0_5px_15px_rgba(255,179,71,0.3)] border border-white/10"
          >
            <Coffee size={26} strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-2xl leading-tight tracking-tight text-cream-50 uppercase italic drop-shadow-lg">
              Mr. & Mrs.
            </span>
            <span className="font-body text-[10px] tracking-[0.4em] text-caramel-500 uppercase font-black -mt-1 drop-shadow-glow">
              Waffle & Brownie
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <a
            href={`https://instagram.com/${settings.instagram}`}
            target="_blank"
            className="w-10 h-10 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-cream-50 hover:bg-caramel-500 hover:text-chocolate-950 transition-all duration-500 shadow-xl group hover:-translate-y-1"
          >
            <Instagram size={20} className="group-hover:rotate-12 transition-transform" />
          </a>
          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-3 bg-caramel-500 text-chocolate-950 px-6 py-2.5 rounded-full hover:bg-caramel-600 transition-all duration-500 active:scale-95 shadow-[0_5px_15px_rgba(255,179,71,0.3)] font-black uppercase tracking-widest text-[10px]"
          >
            <Phone size={16} fill="currentColor" />
            <span>Call Now</span>
          </a>
          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="sm:hidden w-10 h-10 bg-caramel-500 text-chocolate-950 rounded-2xl flex items-center justify-center shadow-lg active:scale-90"
          >
            <Phone size={20} fill="currentColor" strokeWidth={0} />
          </a>
        </div>
      </div>
    </nav>
  );
}
