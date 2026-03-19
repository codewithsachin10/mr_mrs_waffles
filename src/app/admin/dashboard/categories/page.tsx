"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Search, MoreVertical, GripVertical, CheckCircle2, XCircle } from "lucide-react";
import { categories as mockCategories, Category } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default function CategoryManagement() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      if (data.length > 0) setCategoriesList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const filteredCategories = categoriesList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
              Manage <span className="text-caramel-500">Categories</span>
           </h1>
           <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
              Organize your menu by creating and sorting dessert categories.
           </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-caramel-500 text-chocolate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-[0_4px_30px_rgba(212,163,115,0.2)]">
           <Plus size={18} strokeWidth={3} />
           <span>Create Category</span>
        </button>
      </section>

      {/* Tools */}
      <section className="bg-chocolate-900/40 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4">
         <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/30" />
            <input 
              type="text" 
              placeholder="Filter categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
            />
         </div>
         <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
         <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Total:</span>
               <span className="text-sm font-black italic text-caramel-500">{categoriesList.length}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Active:</span>
               <span className="text-sm font-black italic text-emerald-400">{categoriesList.length}</span>
            </div>
         </div>
      </section>

      {/* List */}
      <section className="flex flex-col gap-3">
         <div className="grid grid-cols-12 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-cream-100/20 mb-2">
            <div className="col-span-1">Order</div>
            <div className="col-span-5 md:col-span-6">Category Name</div>
            <div className="col-span-3 md:col-span-2 text-center">Status</div>
            <div className="col-span-3 text-right">Actions</div>
         </div>
         
         <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
               {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-12 items-center p-4 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] group hover:bg-white/[0.06] hover:border-caramel-500/20 transition-all duration-300"
                  >
                     <div className="col-span-1 flex items-center gap-2">
                        <GripVertical size={16} className="text-cream-100/10 group-hover:text-caramel-500/40 cursor-grab active:cursor-grabbing transition-colors" />
                        <span className="text-xs font-black italic text-cream-100/40">{index + 1}</span>
                     </div>
                     <div className="col-span-5 md:col-span-6 flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-cream-50 uppercase group-hover:text-caramel-500 transition-colors">{category.name}</span>
                        <span className="text-[10px] lowercase font-medium text-cream-100/20 tracking-wider italic">/{(category as any).slug || category.id}</span>
                     </div>
                     <div className="col-span-3 md:col-span-2 flex justify-center">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/10">
                           <CheckCircle2 size={12} className="text-emerald-400" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live</span>
                        </div>
                     </div>
                     <div className="col-span-3 flex items-center justify-end gap-2">
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-caramel-500 hover:text-chocolate-950 text-cream-100/40 transition-all active:scale-90">
                           <Edit2 size={16} />
                        </button>
                        <button 
                           onClick={() => handleDelete(category.id)}
                           className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-cream-100/40 hover:text-rose-400 transition-all active:scale-90"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </section>
    </div>
  );
}
