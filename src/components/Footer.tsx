"use client";

import { Instagram, Phone, MapPin, Coffee } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";

export default function Footer() {
  const settings = useSettings();
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 bg-caramel-500 rounded-full flex items-center justify-center text-chocolate-950 group-hover:bg-caramel-600 transition-all duration-500 shadow-xl group-hover:rotate-12">
                <Coffee size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl leading-tight tracking-tight text-cream-50 uppercase italic">
                   Mr. & Mrs.
                </span>
                <span className="font-body text-[10px] tracking-[0.3em] text-caramel-500 uppercase font-black -mt-1">
                   Waffle & Brownie
                </span>
              </div>
            </Link>
            <p className="text-cream-50/30 text-xs font-bold leading-loose italic tracking-wide max-w-sm">
               Experience the finest artisanal waffles and brownies in town. Handcrafted with love and premium ingredients.
               Made fresh with love ❤️
            </p>
            <div className="flex gap-4">
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-cream-50 hover:bg-caramel-500 hover:text-chocolate-950 transition-all duration-500 hover:-translate-y-2 shadow-xl"
              >
                <Instagram size={24} />
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-cream-50 hover:bg-caramel-500 hover:text-chocolate-950 transition-all duration-500 hover:-translate-y-2 shadow-xl"
              >
                <Phone size={24} />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <h4 className="text-xl font-heading font-black text-cream-50 uppercase tracking-[0.2em] italic flex items-center gap-2">
               Quick <span className="text-caramel-500">Links</span>
            </h4>
            <ul className="flex flex-col gap-5 text-cream-50/40 font-black text-[10px] uppercase tracking-[0.3em]">
              <li><Link href="#" className="hover:text-caramel-500 transition-colors">Home</Link></li>
              <li><button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-caramel-500 transition-colors text-left uppercase">Menu</button></li>
              <li><button onClick={() => document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-caramel-500 transition-colors text-left uppercase">Special Offers</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-caramel-500 transition-colors text-left uppercase">Contact Us</button></li>
            </ul>
          </div>
          
          <div id="contact" className="flex flex-col gap-8">
            <h4 className="text-xl font-heading font-black text-cream-50 uppercase tracking-[0.2em] italic flex items-center gap-2">
               Visit <span className="text-caramel-500">Us</span>
            </h4>
            <ul className="flex flex-col gap-8 text-cream-50/40 font-bold">
              <li className="flex items-start gap-4 group">
                <MapPin className="text-caramel-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-xs leading-relaxed tracking-wider italic">{settings.address}</span>
              </li>
              <li className="flex items-start gap-4 group">
                <Phone className="text-caramel-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-xs tracking-widest">{settings.phone}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 text-center">
          <p className="text-cream-50/10 text-[9px] uppercase font-black tracking-[0.5em] italic">
            © 2024 Mr. & Mrs. Waffle & Brownie. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
