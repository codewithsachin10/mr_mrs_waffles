"use client";

import { motion } from "framer-motion";
import { ChevronRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

export default function Hero() {
  const settings = useSettings();
  const scrollToMenu = () => {
    const element = document.getElementById("favorites");
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden bg-chocolate-gradient">
      {/* Background with texture/soft light */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1592308639342-61b667bd4692?w=1600&auto=format&fit=crop"
          alt="Premium Waffle Background"
          fill
          className="object-cover opacity-30 brightness-[0.5] grayscale-[0.1] scale-105"
          priority
        />
        {/* Soft light effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-caramel-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-waffle-500/5 blur-[180px] rounded-full" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full mb-8 shadow-2xl"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-caramel-500 animate-pulse shadow-[0_0_10px_#FFB347]" />
          <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-cream-50/90 italic">
            Freshly made | Pre-order available
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-heading font-black italic text-cream-50 leading-[0.9] mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] tracking-tighter"
        >
          <span className="block mb-2 text-glow">Mr. & Mrs.</span>
          <span className="text-caramel-500 italic block relative">
            Waffle & Brownie
            <div className="absolute -inset-x-10 top-1/2 h-20 bg-caramel-500/5 blur-[60px] -z-10 rounded-full" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-cream-50/70 max-w-2xl text-balance text-base sm:text-xl mb-14 leading-relaxed font-bold tracking-[0.1em] italic"
        >
          {settings.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6"
        >
          <button
            onClick={scrollToMenu}
            className="btn-primary flex items-center justify-center gap-3 group w-full sm:w-64"
          >
            <span className="relative z-10">View Menu</span>
            <ChevronRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <a
            href={`https://wa.me/91${settings.whatsapp.replace(/\s+/g, '')}?text=Hi, I want to order from your menu.`}
            target="_blank"
            className="btn-secondary flex items-center justify-center gap-3 w-full sm:w-64 group hover:border-caramel-500/30 hover:text-caramel-500"
          >
            <MessageCircle size={22} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Order on WhatsApp</span>
          </a>
        </motion.div>
      </div>
      
      {/* Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20"
      >
        <span className="text-[10px] sm:text-xs uppercase font-black tracking-[0.5em] font-heading">Scroll Explore</span>
        <div className="w-[1.5px] h-16 bg-gradient-to-b from-caramel-500 via-caramel-500/50 to-transparent rounded-full shadow-[0_0_10px_#FFB347]" />
      </motion.div>
    </section>
  );
}
