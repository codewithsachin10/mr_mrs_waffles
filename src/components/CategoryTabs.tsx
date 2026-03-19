"use client";

import { categories } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryTabsProps {
  activeCategory: string;
}

export default function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 140; // Adjusted for sticky search + tabs
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="sticky top-[64px] z-40 bg-background/70 backdrop-blur-2xl border-b border-white/5 py-5 w-full shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-4 items-center min-w-max pb-3 relative">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 relative group",
                activeCategory === category.id
                  ? "text-chocolate-950"
                  : "text-cream-50/40 hover:text-caramel-500"
              )}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-caramel-500 rounded-full shadow-[0_10px_20px_rgba(255,179,71,0.4)] -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.8 }}
                />
              )}
              <span className="relative z-10 transition-colors duration-500 group-hover:scale-105 inline-block">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
