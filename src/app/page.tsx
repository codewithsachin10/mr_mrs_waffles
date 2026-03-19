"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import SearchBar from "@/components/SearchBar";
import MenuItemCard from "@/components/MenuItemCard";
import AddOns from "@/components/AddOns";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { menuItems as mockMenuItems, categories as mockCategories } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flame, Zap, Sparkles, Heart } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { MenuItem, Category } from "@/lib/mockData";
import { useSettings } from "@/context/SettingsContext";

export default function Home() {
  const settings = useSettings();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from Firebase
  useEffect(() => {
    async function fetchData() {
      try {
        const catSnapshot = await getDocs(collection(db, "categories"));
        const catData = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        if (catData.length > 0) setCategories(catData);

        const itemsSnapshot = await getDocs(collection(db, "menu_items"));
        const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[];
        if (itemsData.length > 0) setMenuItems(itemsData);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery, menuItems]);

  // Handle active category highlighting based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      const categorySections = [
        { id: "favorites", offsetTop: document.getElementById("favorites")?.offsetTop || 0 },
        ...categories.map(cat => ({
          id: cat.id,
          offsetTop: document.getElementById(cat.id)?.offsetTop || 0
        }))
      ];

      const current = categorySections.reverse().find(section => scrollPosition >= section.offsetTop);
      
      if (current) {
        setActiveCategory(current.id);
      } else {
        setActiveCategory("");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background selection:bg-caramel-500 selection:text-chocolate-950 flex flex-col items-center">
      <Navbar />
      <Hero />
      
      <div id="menu" className="relative z-10 -mt-16 sm:-mt-24 w-full">
        <CategoryTabs activeCategory={activeCategory} />
        <SearchBar onSearch={setSearchQuery} />

        <AnimatePresence mode="popLayout">
          {searchQuery ? (
            <motion.section 
              key="search-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="container mx-auto px-4 py-24"
            >
              <div className="flex flex-col gap-4 mb-20 border-b border-white/5 pb-10 text-center">
                 <motion.span 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] sm:text-xs font-black text-caramel-500 uppercase tracking-[0.5em] leading-none mb-3 italic"
                  >
                    Found {filteredItems.length} delicacies for you
                 </motion.span>
                 <h2 className="text-4xl md:text-7xl font-heading font-black italic text-cream-50 uppercase tracking-tighter leading-none pr-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                    Search Results <span className="text-caramel-500 italic text-glow">for "{searchQuery}"</span>
                 </h2>
              </div>
              
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {filteredItems.map((item) => (
                    <MenuItemCard key={`search-${item.id}`} item={item} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center gap-10">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-caramel-500/5 flex items-center justify-center text-caramel-500 shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-caramel-500/10 scale-110 relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:rotate-12 transition-transform duration-500"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <div className="absolute inset-0 bg-caramel-500/10 rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity" />
                   </div>
                   <div className="flex flex-col gap-4">
                      <h3 className="text-3xl font-heading font-black italic text-cream-50 uppercase tracking-[0.3em] leading-tight drop-shadow-lg">
                        Treat not detected
                      </h3>
                      <p className="text-cream-50/20 text-base font-bold tracking-[0.2em] italic max-w-sm mx-auto">
                        Try different flavors or browse our categories.
                      </p>
                   </div>
                </div>
              )}
            </motion.section>
          ) : (
            <motion.div
              key="main-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* CUSTOMER FAVORITES / 🔥 MOST LOVED */}
              <section id="favorites" className="container mx-auto px-4 py-32 scroll-mt-60">
                 <div className="flex flex-col gap-6 mb-20 text-center items-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2.5 bg-strawberry-500/10 border border-strawberry-500/30 px-6 py-2.5 rounded-full mb-4 shadow-[0_10px_30px_rgba(255,77,109,0.1)] group hover:-translate-y-1 transition-transform"
                    >
                       <Flame size={18} className="text-strawberry-500 animate-pulse fill-strawberry-500" />
                       <span className="text-[10px] sm:text-xs font-black text-strawberry-500 uppercase tracking-[0.5em] leading-none translate-y-[1px]">
                          🔥 Most Loved
                       </span>
                    </motion.div>
                    <h2 className="text-5xl md:text-8xl font-heading font-black italic text-cream-50 uppercase tracking-tighter leading-[0.9] pr-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                       Customer <span className="text-caramel-500 underline decoration-caramel-500/20 underline-offset-[12px] text-glow">Favorites</span>
                    </h2>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {menuItems.filter(i => i.isFeatured && i.category !== "Weekend Offers").map((item) => (
                       <MenuItemCard key={`fav-${item.id}`} item={item} />
                    ))}
                 </div>
              </section>

              {/* WEEKEND OFFERS SECTION (Banner Cards) */}
              <section id="weekend-offers" className="container mx-auto px-4 py-32 scroll-mt-60 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-strawberry-500/5 blur-[180px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-caramel-500/5 blur-[180px] rounded-full -z-10" />
                
                <div className="flex flex-col gap-5 mb-20 text-center items-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2.5 bg-caramel-500/10 border border-caramel-500/30 px-6 py-2.5 rounded-full mb-4 shadow-[0_10px_30px_rgba(255,179,71,0.1)] group hover:-translate-y-1 transition-transform"
                    >
                       <Zap size={18} className="text-caramel-500 fill-caramel-500 animate-bounce" />
                       <span className="text-[10px] sm:text-xs font-black text-caramel-500 uppercase tracking-[0.5em] leading-none translate-y-[1px]">
                          Exclusive Deals
                       </span>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black italic text-cream-50 uppercase tracking-tight leading-none drop-shadow-2xl">
                       Weekend <span className="text-strawberry-500 underline decoration-strawberry-500/20 underline-offset-[10px] text-glow">Offers</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {menuItems.filter(i => i.category === "Weekend Offers").map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-chocolate-900 via-chocolate-900 to-chocolate-950 border border-strawberry-500/20 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl h-full flex flex-col justify-between"
                    >
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-strawberry-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex flex-col gap-8 relative z-10">
                          <span className="inline-flex items-center gap-2 bg-strawberry-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full w-fit shadow-xl shadow-strawberry-500/20 translate-y-[-2px] hover:-translate-y-1 transition-transform">
                             Weekend Special
                          </span>
                          <div>
                            <h3 className="text-3xl md:text-4xl font-heading font-black italic text-cream-50 uppercase tracking-tighter leading-none mb-3 pr-2 group-hover:text-caramel-500 transition-colors">
                               {item.name}
                            </h3>
                            <p className="text-cream-50/40 font-bold max-w-md italic text-sm md:text-base leading-relaxed tracking-wide">
                               {item.description}
                            </p>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-center gap-10 mt-12 bg-white/5 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md relative z-10 group-hover:border-strawberry-500/20 transition-colors">
                          <div className="w-40 h-40 rounded-full border-2 border-dashed border-strawberry-500/40 flex flex-col items-center justify-center p-6 rotate-12 group-hover:rotate-0 transition-all duration-1000 bg-black/40 shadow-inner">
                             <span className="text-4xl md:text-5xl font-heading font-black text-caramel-500 italic drop-shadow-[0_10px_20px_rgba(255,179,71,0.3)]">₹{item.price}</span>
                             <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-cream-50/20 mt-2">Limited</span>
                          </div>
                          <a 
                            href={`https://wa.me/91${settings.whatsapp.replace(/\s+/g, '')}?text=I want to claim the ${item.name} offer!`}
                            target="_blank"
                            className="btn-primary w-full py-5 text-sm font-black uppercase tracking-widest shadow-[0_15px_40px_rgba(255,179,71,0.1)] hover:shadow-[0_20px_50px_rgba(255,179,71,0.3)]"
                          >
                             Claim Offer
                          </a>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* MENU SECTIONS (Grid 3 Columns Desktop) */}
              <div className="container mx-auto px-4 pb-32 space-y-32 pt-32">
                {categories.map((category) => {
                  const items = menuItems.filter(item => item.category === category.name);
                  if (items.length === 0 || category.id === "weekend-offers" || category.id === "add-ons") return null;
                  
                  return (
                    <section key={category.id} id={category.id} className="scroll-mt-60 w-full group/section">
                       <div className="flex flex-col gap-6 mb-16 text-center md:text-left">
                          <div className="flex items-center gap-6">
                            <h2 className="text-4xl md:text-6xl font-heading font-black italic text-cream-50 uppercase tracking-tighter leading-none pr-6 group-hover/section:text-glow transition-all duration-700">
                               {category.name}
                            </h2>
                            <div className="h-[2px] grow bg-gradient-to-r from-caramel-500/40 via-caramel-500/10 to-transparent rounded-full shadow-[0_0_15px_rgba(255,179,71,0.2)]" />
                          </div>
                          <p className="text-cream-50/20 text-xs font-black uppercase tracking-[0.6em] italic italic ml-1">
                             Premium Selections
                          </p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                          {items.map((item) => (
                             <MenuItemCard key={item.id} item={item} />
                          ))}
                       </div>
                    </section>
                  );
                })}
              </div>

              <AddOns />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
