"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Utensils, 
  Search, 
  Star, 
  PlusCircle, 
  ChevronRight,
  Zap,
  Flame,
  Sparkles
} from "lucide-react";
import { addOns as mockAddOns, AddOn } from "@/lib/mockData";
import { formatCurrency, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";

export default function AddonManagement() {
  const [items, setItems] = useState<AddOn[]>(mockAddOns);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "add_ons"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AddOn[];
      if (data.length > 0) setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this add-on?")) {
      try {
        await deleteDoc(doc(db, "add_ons", id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
              Extra <span className="text-caramel-500">Add-ons</span>
           </h1>
           <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
              Manage extra toppings and customizations for your desserts.
           </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-caramel-500 text-chocolate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-[0_4px_30px_rgba(212,163,115,0.2)]">
           <Plus size={18} strokeWidth={3} />
           <span>Add New Topping</span>
        </button>
      </section>

      {/* Tools */}
      <section className="bg-chocolate-900/40 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4">
         <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/30" />
            <input 
              type="text" 
              placeholder="Search add-ons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
            />
         </div>
         <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
         <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Total:</span>
               <span className="text-sm font-black italic text-caramel-500">{items.length}</span>
            </div>
         </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
               <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-6 group hover:bg-white/[0.06] hover:border-caramel-500/20 transition-all duration-300 flex flex-col gap-4"
               >
                  <div className="flex items-center justify-between">
                     <div className="w-12 h-12 bg-caramel-500/10 rounded-2xl flex items-center justify-center text-caramel-500 group-hover:scale-110 transition-transform">
                        <Sparkles size={24} />
                     </div>
                     <span className="text-lg font-black italic text-caramel-500">{formatCurrency(item.price)}</span>
                  </div>
                  
                  <div>
                     <h3 className="text-sm font-bold text-cream-50 uppercase tracking-wider group-hover:text-caramel-500 transition-colors">{item.name}</h3>
                     <p className="text-[10px] font-medium text-cream-100/20 mt-1 uppercase tracking-widest italic leading-none">Standard Topping</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-cream-100/40 hover:bg-caramel-500 hover:text-chocolate-950 transition-all active:scale-95">
                        <Edit2 size={12} strokeWidth={3} />
                        <span>Edit</span>
                     </button>
                     <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center justify-center gap-2 py-2.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-cream-100/20 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-95"
                     >
                        <Trash2 size={12} strokeWidth={3} />
                        <span>Delete</span>
                     </button>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </section>
    </div>
  );
}
