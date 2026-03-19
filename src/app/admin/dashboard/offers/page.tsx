"use client";

import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Gift,
  Clock,
  Heart,
  X,
  Upload,
  Loader2,
  Check
} from "lucide-react";
import { menuItems as mockMenuItems, MenuItem } from "@/lib/mockData";
import { formatCurrency, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function WeeklyOffers() {
  const [offers, setOffers] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: "Weekend Offers",
    description: "",
    isAvailable: true,
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // We filter for "Weekend Offers" category
    const q = query(collection(db, "menu_items"), where("category", "==", "Weekend Offers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[];
      setOffers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      price: 0,
      category: "Weekend Offers",
      description: "",
      isAvailable: true,
      image: ""
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (offer: MenuItem) => {
    setFormData(offer);
    setImageFile(null);
    setImagePreview(offer.image || null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await deleteDoc(doc(db, "menu_items", id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const storageRef = ref(storage, `offers/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const finalData = {
        ...formData,
        category: "Weekend Offers", // Enforce category
        image: imageUrl,
        updatedAt: serverTimestamp()
      };

      if (isEditing && formData.id) {
        await updateDoc(doc(db, "menu_items", formData.id), finalData);
      } else {
        await addDoc(collection(db, "menu_items"), {
          ...finalData,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save offer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
              Weekly <span className="text-strawberry-500">Offers</span>
           </h1>
           <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
              Create and manage limited-time deals to attract more dessert lovers.
           </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-8 py-4 bg-strawberry-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-strawberry-600 transition-all active:scale-95 shadow-[0_4px_30px_rgba(255,77,109,0.2)]"
        >
           <Plus size={18} strokeWidth={3} />
           <span>Craft New Offer</span>
        </button>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <AnimatePresence mode="popLayout">
            {offers.map((offer, i) => (
               <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-chocolate-900/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-strawberry-500/20 transition-all duration-300 flex flex-col"
               >
                  <div className="absolute top-10 right-10 flex flex-col gap-2 z-20">
                     <div className="p-3 bg-strawberry-500 text-white rounded-full shadow-lg">
                        <Gift size={20} />
                     </div>
                  </div>

                  {offer.image && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <Image src={offer.image} alt="" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/40 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col gap-8 h-full relative z-10">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-strawberry-500 italic mb-3 block">Limited Offer</span>
                        <h3 className="text-3xl font-heading font-black italic text-cream-50 uppercase tracking-tighter leading-none group-hover:text-caramel-500 transition-colors mb-4">{offer.name}</h3>
                        <p className="text-sm font-medium text-cream-100/30 leading-relaxed italic line-clamp-3">{offer.description}</p>
                     </div>
                     
                     <div className="mt-auto flex flex-col gap-6">
                        <div className="flex items-center justify-between py-6 px-8 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest text-cream-100/20">Special Price</span>
                              <span className="text-3xl font-heading font-black italic text-caramel-500 drop-shadow-glow">₹{offer.price}</span>
                           </div>
                           <div className="h-10 w-[1px] bg-white/10" />
                           <div className="flex flex-col items-end">
                              <span className="text-[9px] font-black uppercase tracking-widest text-cream-100/20">Stock Status</span>
                              <span className={cn(
                                "text-xs font-black italic uppercase tracking-widest",
                                offer.isAvailable ? "text-emerald-400" : "text-rose-400"
                              )}>
                                {offer.isAvailable ? "Available" : "Sold Out"}
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <button 
                             onClick={() => handleOpenEditModal(offer)}
                             className="flex items-center justify-center gap-2 py-4 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cream-100/60 hover:bg-white/10 transition-all active:scale-95 group"
                           >
                              <Edit2 size={14} strokeWidth={3} />
                              <span>Edit Deal</span>
                           </button>
                           <button 
                              onClick={() => handleDelete(offer.id)}
                              className="flex items-center justify-center gap-2 py-4 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cream-100/20 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-95 group"
                           >
                              <Trash2 size={14} strokeWidth={3} />
                              <span>Remove</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </section>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-chocolate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-chocolate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-cream-100/30 hover:text-cream-50 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
                    {isEditing ? "Edit" : "New"} <span className="text-strawberry-500">Offer</span>
                  </h2>
                  <p className="text-cream-100/30 text-xs font-medium uppercase tracking-widest italic">
                    {isEditing ? "Update your limited time deal" : "Craft a tempting new weekend special"}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* Photo Upload Area */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Offer Photo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-48 md:h-64 w-full rounded-3xl bg-white/5 border-2 border-dashed border-strawberry-500/20 hover:border-strawberry-500/50 transition-all cursor-pointer overflow-hidden flex items-center justify-center"
                    >
                      {imagePreview ? (
                        <>
                          <Image src={imagePreview} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-chocolate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-strawberry-500/10 rounded-2xl flex items-center justify-center text-strawberry-500 group-hover:scale-110 transition-transform">
                             <Upload size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Click to upload photo</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Offer Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-strawberry-500/50"
                        placeholder="e.g. Weekend Waffle Box"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Offer Price (₹)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                         className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-strawberry-500/50"
                         placeholder="0"
                       />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-strawberry-500/50 resize-none"
                      placeholder="What's special about this weekend deal?"
                    />
                  </div>
                  
                  <div className="flex items-center gap-8 py-2">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div 
                           onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                           className={cn(
                              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                              formData.isAvailable ? "bg-emerald-500 border-emerald-500" : "bg-transparent border-white/10 group-hover:border-emerald-500/50"
                           )}
                        >
                           {formData.isAvailable && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-cream-50 tracking-wide uppercase">Active & Available</span>
                     </label>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="mt-4 flex items-center justify-center gap-3 py-5 bg-strawberry-500 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-strawberry-600 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Applying Offer...</span>
                      </>
                    ) : (
                      <>
                        <Gift className={cn(isEditing ? "hidden" : "block")} size={20} />
                        <Check className={cn(isEditing ? "block" : "hidden")} size={20} />
                        <span>{isEditing ? "Update Deal" : "Launch Offer"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
