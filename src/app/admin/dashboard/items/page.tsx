"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Utensils, 
  Search, 
  Star, 
  Filter, 
  Eye, 
  Heart,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  X,
  Upload,
  Loader2,
  Check
} from "lucide-react";
import { menuItems as mockMenuItems, categories as mockCategories } from "@/lib/mockData";
import { formatCurrency, cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db, storage } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MenuItem, Category } from "@/lib/mockData";

export default function MenuItemManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: "",
    description: "",
    badge: "",
    isAvailable: true,
    isFeatured: false,
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Real-time listener
    const unsubscribeItems = onSnapshot(collection(db, "menu_items"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[];
      // Deduplicate by id (keep last occurrence)
      const uniqueMap = new Map(data.map(item => [item.id, item]));
      setItems(Array.from(uniqueMap.values()));
      setLoading(false);
    });

    const unsubscribeCats = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      setCategoriesList(data);
    });

    return () => {
      unsubscribeItems();
      unsubscribeCats();
    };
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      price: 0,
      category: categoriesList[0]?.name || "",
      description: "",
      badge: "",
      isAvailable: true,
      isFeatured: false,
      image: ""
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setFormData(item);
    setImageFile(null);
    setImagePreview(item.image || null);
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
    if (confirm("Are you sure you want to delete this item?")) {
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

      // 1. Upload image if a new one is selected
      if (imageFile) {
        const storageRef = ref(storage, `menu-items/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const finalData = {
        ...formData,
        image: imageUrl,
        updatedAt: serverTimestamp()
      };

      // Strip 'id' from the data before writing to Firestore
      const { id: _id, ...dataWithoutId } = finalData as any;

      if (isEditing && formData.id) {
        await setDoc(doc(db, "menu_items", formData.id), dataWithoutId, { merge: true });
      } else {
        await addDoc(collection(db, "menu_items"), {
          ...finalData,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || i.category === selectedCategory || (i as any).category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl md:text-5xl font-heading font-black italic text-cream-50 uppercase tracking-tight">
              Menu <span className="text-caramel-500">Items</span>
           </h1>
           <p className="text-cream-100/40 text-sm font-medium leading-relaxed max-w-lg italic">
              Configure your waffle, brownie, and dessert collection.
           </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-8 py-4 bg-caramel-500 text-chocolate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-[0_4px_30px_rgba(212,163,115,0.2)]"
        >
           <Plus size={18} strokeWidth={3} />
           <span>Add New Item</span>
        </button>
      </section>

      {/* Tools */}
      <section className="bg-chocolate-900/40 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4">
         <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/30" />
            <input 
              type="text" 
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
            />
         </div>
         <div className="relative w-full md:w-auto">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-caramel-500" />
            <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-cream-50 outline-none focus:border-caramel-500/50 appearance-none cursor-pointer"
            >
               <option value="all" className="bg-chocolate-900">All Categories</option>
               {categoriesList.map((c: Category) => (
                  <option key={c.id} value={c.name} className="bg-chocolate-900">{c.name}</option>
               ))}
            </select>
         </div>
         <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
         <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Total:</span>
               <span className="text-sm font-black italic text-caramel-500">{items.length}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Featured:</span>
               <span className="text-sm font-black italic text-rose-400">{items.filter((i: MenuItem) => i.isFeatured).length}</span>
            </div>
         </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
               <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-5 group hover:bg-white/[0.06] hover:border-caramel-500/20 transition-all duration-300 flex flex-col gap-4 relative"
               >
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-2">
                     {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                           <Utensils size={32} className="text-cream-100/10" />
                        </div>
                     )}
                     <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {item.isFeatured && (
                           <div className="p-2 bg-rose-500 text-white rounded-full shadow-lg">
                              <Heart size={14} fill="currentColor" />
                           </div>
                        )}
                        {item.badge && (
                           <div className="p-2 bg-caramel-500 text-chocolate-950 rounded-full shadow-lg">
                              <Sparkles size={14} strokeWidth={3} />
                           </div>
                        )}
                     </div>
                     <div className="absolute bottom-3 left-3 px-3 py-1 bg-chocolate-950/80 backdrop-blur-md rounded-xl">
                        <span className="text-sm font-black italic text-caramel-500 tracking-tight">{formatCurrency(item.price)}</span>
                     </div>
                  </div>

                  <div className="px-1">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] items-center gap-1.5 font-black uppercase tracking-[0.2em] text-cream-100/20 truncate">
                           {categoriesList.find((c: Category) => c.id === item.category || c.name === item.category)?.name || item.category}
                        </span>
                        <div className={cn(
                           "w-2 h-2 rounded-full",
                           item.isAvailable ? "bg-emerald-400" : "bg-rose-400"
                        )} />
                     </div>
                     <h3 className="text-lg font-bold text-cream-50 leading-none group-hover:text-caramel-500 transition-colors uppercase truncate mb-2">{item.name}</h3>
                     <p className="text-[11px] font-medium text-cream-100/30 line-clamp-2 leading-relaxed italic">{item.description}</p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.05]">
                     <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cream-100/60 hover:bg-caramel-500 hover:text-chocolate-950 transition-all active:scale-95 group"
                     >
                        <Edit2 size={14} strokeWidth={3} />
                        <span>Edit</span>
                     </button>
                     <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cream-100/20 hover:bg-rose-500/10 hover:text-rose-400 transition-all active:scale-95 group"
                     >
                        <Trash2 size={14} strokeWidth={3} />
                        <span>Delete</span>
                     </button>
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
                    {isEditing ? "Edit" : "Add New"} <span className="text-caramel-500">Item</span>
                  </h2>
                  <p className="text-cream-100/30 text-xs font-medium uppercase tracking-widest italic">
                    {isEditing ? "Update existing treat details" : "Add a fresh new delight to the menu"}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* Photo Upload Area */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Item Photo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-48 md:h-64 w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-caramel-500/50 transition-all cursor-pointer overflow-hidden flex items-center justify-center"
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
                          <div className="w-16 h-16 bg-caramel-500/10 rounded-2xl flex items-center justify-center text-caramel-500 group-hover:scale-110 transition-transform">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                        placeholder="e.g. Triple Choco Waffle"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Price (₹)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                         className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50"
                         placeholder="0"
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Category</label>
                       <select
                         required
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 appearance-none cursor-pointer"
                       >
                         {categoriesList.map((c) => (
                           <option key={c.id} value={c.name} className="bg-chocolate-900">{c.name}</option>
                         ))}
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Badge (Optional)</label>
                       <select
                         value={formData.badge}
                         onChange={(e) => setFormData({...formData, badge: e.target.value})}
                         className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 appearance-none cursor-pointer"
                       >
                         <option value="" className="bg-chocolate-900">No Badge</option>
                         <option value="Popular" className="bg-chocolate-900">Popular</option>
                         <option value="Hot" className="bg-chocolate-900">Hot</option>
                         <option value="New" className="bg-chocolate-900">New</option>
                         <option value="Signature" className="bg-chocolate-900">Signature</option>
                       </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 ml-1">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-cream-50 outline-none focus:border-caramel-500/50 resize-none"
                      placeholder="Tell more about this treat..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-8 py-2">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div 
                           onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                           className={cn(
                              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                              formData.isFeatured ? "bg-caramel-500 border-caramel-500" : "bg-transparent border-white/10 group-hover:border-caramel-500/50"
                           )}
                        >
                           {formData.isFeatured && <Heart size={12} fill="white" className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-cream-50 tracking-wide uppercase">Featured</span>
                     </label>
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
                        <span className="text-xs font-bold text-cream-50 tracking-wide uppercase">Available</span>
                     </label>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="mt-4 flex items-center justify-center gap-3 py-5 bg-caramel-500 text-chocolate-950 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-caramel-600 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className={cn(isEditing ? "hidden" : "block")} size={20} />
                        <Check className={cn(isEditing ? "block" : "hidden")} size={20} />
                        <span>{isEditing ? "Update Item" : "Create Item"}</span>
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

// Placeholder for missing Lucide icon
function PlusCircle({ className, size }: { className?: string, size?: number }) {
  return <Plus className={className} size={size} />
}
