"use client";

import { useState, useRef, useEffect } from "react";
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Palette, 
  Maximize, 
  Layout, 
  Smartphone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function QRStudio() {
  const [baseUrl, setBaseUrl] = useState("");
  const [fgColor, setFgColor] = useState("#FFB347"); // Caramel Gold
  const [bgColor, setBgColor] = useState("#0F0F0F"); // Deep Chocolate
  const [includeMargin, setIncludeMargin] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     // Get base URL for the project
     if (typeof window !== "undefined") {
        setBaseUrl(window.location.origin);
     }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "mrmrs_waffles_qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col gap-2">
         <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
            QR <span className="text-caramel-500">Studio</span>
         </h1>
         <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
            Design and generate your shop's portal. Print these out for your tables to let customers browse the menu instantly.
         </p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         {/* Customizer */}
         <section className="flex flex-col gap-8">
            <div className="bg-chocolate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col gap-10">
               {/* URL Preview */}
               <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cream-100/30">Menu URL</span>
                  <div className="flex items-center gap-4 p-4 bg-chocolate-950/60 border border-white/5 rounded-2xl group">
                     <Smartphone className="text-caramel-500" size={20} />
                     <span className="text-sm font-bold text-cream-50 flex-1 truncate">{baseUrl || "Loading..."}</span>
                     <button 
                       onClick={handleCopy}
                       className="p-2 hover:bg-white/5 rounded-xl transition-colors text-cream-100/40 hover:text-caramel-500"
                     >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                     </button>
                  </div>
               </div>

               {/* Design Options */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] items-center gap-2 flex font-black uppercase tracking-[0.3em] text-cream-100/30">
                        <Palette size={14} className="text-caramel-500" /> Foreground
                     </span>
                     <div className="flex items-center gap-4">
                        <input 
                           type="color" 
                           value={fgColor}
                           onChange={(e) => setFgColor(e.target.value)}
                           className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border-none"
                        />
                        <span className="text-xs font-black uppercase tracking-widest text-cream-50">{fgColor}</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] items-center gap-2 flex font-black uppercase tracking-[0.3em] text-cream-100/30">
                        <Layout size={14} className="text-caramel-500" /> Background
                     </span>
                     <div className="flex items-center gap-4">
                        <input 
                           type="color" 
                           value={bgColor}
                           onChange={(e) => setBgColor(e.target.value)}
                           className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border-none"
                        />
                        <span className="text-xs font-black uppercase tracking-widest text-cream-50">{bgColor}</span>
                     </div>
                  </div>
               </div>

               {/* Presets */}
               <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cream-100/30">Quick Presets</span>
                  <div className="flex flex-wrap gap-4">
                     {[
                        { name: "Caramel", fg: "#FFB347", bg: "#0F0F0F" },
                        { name: "Monochrome", fg: "#FFFFFF", bg: "#000000" },
                        { name: "Strawberry", fg: "#FF4D6D", bg: "#0F0F0F" },
                        { name: "Classic Gold", fg: "#D4A373", bg: "#F5F5DC" },
                     ].map((p) => (
                        <button 
                           key={p.name}
                           onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                           className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cream-100/60 hover:border-caramel-500/40 hover:text-caramel-500 transition-all"
                        >
                           {p.name}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
               <button 
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-caramel-500 text-chocolate-950 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-caramel-600 transition-all active:scale-95 shadow-xl group"
               >
                  <Download size={20} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" />
                  <span>Download PNG</span>
               </button>
               <button 
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] text-cream-50 hover:bg-white/10 transition-all active:scale-95"
               >
                  <Printer size={20} strokeWidth={3} />
                  <span>Print Flyers</span>
               </button>
            </div>
         </section>

         {/* Preview */}
         <section className="flex flex-col gap-8 sticky top-10">
            <div className="relative group perspective-1000">
               <motion.div 
                  className="bg-chocolate-900/40 border border-white/10 rounded-[4rem] p-16 flex flex-col items-center justify-center relative overflow-hidden shadow-3xl"
                  whileHover={{ rotateY: 2, rotateX: -2 }}
               >
                  {/* Decorative Elements */}
                  <div className="absolute top-10 left-10 text-[10px] font-black uppercase tracking-[0.5em] text-cream-100/10 rotate-90 origin-left">Scan to induldge</div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-caramel-500/10 blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />

                  <div 
                     ref={qrRef}
                     className="relative z-10 p-10 bg-white shadow-2xl rounded-[3rem] transform transition-transform group-hover:scale-105 duration-700"
                     style={{ backgroundColor: bgColor }}
                  >
                     <QRCodeSVG 
                        value={baseUrl || "https://mrmrswaffles.com"} 
                        size={240}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level="H"
                        includeMargin={includeMargin}
                     />
                     <div className="absolute inset-0 border-[1.5rem] border-transparent rounded-[3rem] pointer-events-none group-hover:border-caramel-500/10 transition-all duration-700" />
                  </div>

                  <div className="mt-12 flex flex-col items-center gap-3 text-center">
                     <div className="flex items-center gap-2 px-4 py-2 bg-caramel-500/10 rounded-full border border-caramel-500/20">
                        <Sparkles size={14} className="text-caramel-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-caramel-500">Live Preview</span>
                     </div>
                     <h2 className="text-2xl font-heading font-black italic text-cream-50 uppercase mt-2">Mr. & Mrs. <span className="text-caramel-500">Waffles</span></h2>
                     <p className="text-[11px] font-bold text-cream-100/20 uppercase tracking-[0.3em]">Scan for digital menu</p>
                  </div>
               </motion.div>
            </div>

            {/* Instruction Card */}
            <div className="bg-caramel-500 p-10 rounded-[3rem] relative overflow-hidden group">
               <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="text-2xl font-heading font-black italic text-chocolate-950 uppercase leading-none">Pro Tip</h3>
                  <p className="text-sm font-bold text-chocolate-950/60 leading-relaxed italic">
                     Place these QR codes on individual table signs or at the entrance. Your customers will love the speed of scanning and browsing!
                  </p>
                  <div className="flex items-center gap-2 mt-2 group-hover:translate-x-2 transition-transform duration-500 cursor-pointer">
                     <span className="text-[10px] font-black uppercase tracking-widest text-chocolate-950">View Gallery</span>
                     <ArrowRight size={14} className="text-chocolate-950" />
                  </div>
               </div>
               <Maximize className="absolute top-10 right-10 text-chocolate-950/10" size={120} />
            </div>
         </section>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
