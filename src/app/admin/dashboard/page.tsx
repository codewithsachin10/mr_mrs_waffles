"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Tag, 
  Utensils, 
  Gift, 
  AlertCircle,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
  TrendingDown,
  ShoppingBag,
  Heart,
  Instagram
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { MenuItem, Category } from "@/lib/mockData";

export default function AdminDashboardHome() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, "menu_items"), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[]);
    });
    const unsubCats = onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategoriesList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
      setLoading(false);
    });
    return () => {
      unsubItems();
      unsubCats();
    };
  }, []);

  const stats = [
    { label: "Total Categories", value: categoriesList.length, icon: Tag, color: "text-caramel-500", bg: "bg-caramel-500/10" },
    { label: "Active Items", value: items.filter(i => i.isAvailable !== false).length, icon: Utensils, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Featured Waffles", value: items.filter(i => i.isFeatured).length, icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "Sold Out", value: items.filter(i => i.isAvailable === false).length, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-caramel-500/10 px-3 py-1 rounded-full w-fit mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-caramel-500">Store Live & Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
             Good Afternoon, <span className="text-caramel-500">Manager!</span>
          </h1>
          <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
             Ready to sweeten the day? Here's what's happening in your shop today.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-cream-50 hover:bg-white/10 transition-all active:scale-95">
              Refill Inventory
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-caramel-500 text-chocolate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-xl">
              <Plus size={16} strokeWidth={3} />
              <span>Add New Treat</span>
           </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 bg-chocolate-900/60 border border-white/5 rounded-3xl flex flex-col gap-4 hover:border-caramel-500/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
               <stat.icon size={100} strokeWidth={1} />
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center p-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-cream-100/40">{stat.label}</span>
              <span className="text-3xl font-heading font-black italic text-cream-50">{stat.value}</span>
              <div className="flex items-center gap-1 mt-2">
                 <TrendingUp size={12} className="text-emerald-400" />
                 <span className="text-[10px] font-bold text-emerald-400 uppercase">+12% from yesterday</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Popular Items */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-heading font-black italic text-cream-50 uppercase tracking-widest flex items-center gap-3">
               🔥 Trending <span className="text-caramel-500">Treats</span>
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-caramel-500 hover:text-white transition-colors">See Performance</button>
          </div>
          <div className="flex flex-col gap-3">
             {items.slice(0, 4).map((item, i) => (
               <div key={item.id} className="group p-4 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] flex items-center justify-between hover:bg-white/[0.05] hover:border-caramel-500/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                     <span className="w-8 h-8 rounded-lg bg-white/5 text-caramel-500 flex items-center justify-center text-xs font-black italic">0{i+1}</span>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-cream-50 leading-none group-hover:text-caramel-500 transition-colors uppercase">{item.name}</span>
                        <span className="text-[10px] uppercase font-bold text-cream-100/20 mt-1 tracking-widest">In Classic Waffles</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-sm font-black italic text-cream-50">{formatCurrency(item.price)}</span>
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-tight">840 units sold <TrendingUp size={8} /></span>
                     </div>
                     <button className="p-2.5 rounded-xl bg-white/5 text-cream-100/40 hover:text-caramel-500 transition-colors">
                        <ArrowUpRight size={18} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-heading font-black italic text-cream-50 uppercase tracking-widest flex items-center gap-3">
                ⚡ Quick <span className="text-caramel-500">Fixes</span>
             </h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/20">Operational status</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button className="p-6 bg-amber-500/10 border border-amber-500/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-amber-500/40 transition-all">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Clock size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Update Store Hours</span>
             </button>
             <button className="p-6 bg-strawberry-500/10 border border-strawberry-500/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-strawberry-500/40 transition-all">
                <div className="w-12 h-12 bg-strawberry-500/20 text-strawberry-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Gift size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-strawberry-500">Manage Weekly Offer</span>
             </button>
             <button className="p-6 bg-emerald-500/10 border border-emerald-500/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ShoppingBag size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Inventory Sync</span>
             </button>
             <button className="p-6 bg-caramel-500/10 border border-caramel-500/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-caramel-500/40 transition-all">
                <div className="w-12 h-12 bg-caramel-500/20 text-caramel-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Instagram size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-caramel-500">Instagram Feed</span>
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
