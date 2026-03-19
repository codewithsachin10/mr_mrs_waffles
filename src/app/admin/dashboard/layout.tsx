"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  Tag, 
  Gift, 
  PlusCircle, 
  LogOut, 
  Coffee,
  Menu,
  X,
  Instagram,
  ChevronRight,
  QrCode
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Categories", icon: Tag, href: "/admin/dashboard/categories" },
  { label: "Menu Items", icon: Utensils, href: "/admin/dashboard/items" },
  { label: "Weekly Offers", icon: Gift, href: "/admin/dashboard/offers" },
  { label: "Extra Add-ons", icon: PlusCircle, href: "/admin/dashboard/addons" },
  { label: "QR Studio", icon: QrCode, href: "/admin/dashboard/qr" },
  { label: "Shop Settings", icon: Settings, href: "/admin/dashboard/settings" },
];

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    });

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-chocolate-950">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin shadow-2xl" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-caramel-500 animate-pulse">Authenticating Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#060404] text-cream-50 overflow-hidden">
      {/* Mob Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-caramel-500 text-chocolate-950 p-4 rounded-full shadow-2xl transition-transform active:scale-90"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-50 w-72 h-full bg-chocolate-950 border-r border-white/5 flex flex-col p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-10 px-2 lg:px-0">
               <div className="w-10 h-10 bg-caramel-500 rounded-xl flex items-center justify-center text-chocolate-950 rotate-3">
                  <Coffee size={24} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="font-heading font-black text-xl leading-none uppercase italic tracking-tighter">
                     Admin <span className="text-caramel-500">Panel</span>
                  </span>
                  <span className="text-[10px] font-bold text-cream-100/40 uppercase tracking-widest mt-1">
                     Mr. & Mrs. Waffles
                  </span>
               </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto no-scrollbar pr-2">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                       "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                       isActive 
                        ? "bg-caramel-500 text-chocolate-950 font-bold shadow-[0_4px_20px_rgba(212,163,115,0.2)]" 
                        : "text-cream-50/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive ? "text-chocolate-950" : "text-caramel-500/80")} />
                      <span className="text-sm tracking-wide uppercase font-bold">{link.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="opacity-40" strokeWidth={3} />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-6">
               <button
                 onClick={handleLogout}
                 className="flex items-center gap-4 px-4 py-3.5 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-black uppercase tracking-widest text-xs"
               >
                 <LogOut size={20} strokeWidth={3} />
                 <span>Log out Store</span>
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-chocolate-950 via-chocolate-950 to-chocolate-900/40 p-6 lg:p-10 no-scrollbar">
        <div className="max-w-6xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
