"use client";

import { MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const settings = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/91${settings.whatsapp.replace(/\s+/g, '')}?text=Hi, I want to order from your menu.`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
           animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
           exit={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
           className="fixed bottom-10 right-10 z-[100]"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            className="group flex items-center gap-4 bg-[#25D366] text-white p-2.5 pr-8 rounded-full shadow-[0_20px_60px_rgba(37,211,102,0.4)] hover:shadow-[0_25px_80px_rgba(37,211,102,0.6)] hover:-translate-y-2 active:scale-95 transition-all duration-500 hover:rotate-2 relative sm:animate-pulse-glow"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white shadow-inner group-hover:rotate-[360deg] transition-transform duration-1000 relative">
               <MessageCircle size={32} fill="currentColor" strokeWidth={0} />
               <div className="absolute inset-0 bg-white shadow-[0_0_20px_#fff] blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-80 leading-none mb-1.5 font-heading">Online Store</span>
              <span className="text-xl font-black tracking-tight leading-none uppercase italic flex items-center gap-2">
                Order <span className="text-white/70">Now</span>
              </span>
            </div>
            
            {/* Ripple effect */}
            <div className="absolute -inset-2 bg-[#25D366] rounded-full animate-ping opacity-10 -z-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
