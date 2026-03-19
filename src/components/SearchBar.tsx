"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const debounceSearch = useCallback((value: string) => {
    onSearch(value);
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debounceSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, debounceSearch]);

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="sticky top-[145px] z-30 w-full bg-background/50 backdrop-blur-lg py-4 border-b border-white/5 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-caramel-500/20 to-strawberry-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-chocolate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center px-6 py-4 transition-all duration-500 hover:border-caramel-500/40 shadow-2xl overflow-hidden">
            <Search size={24} className="text-caramel-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for waffles, brownies, pancakes..."
              className="w-full bg-transparent border-none outline-none text-cream-50 placeholder:text-cream-50/20 px-4 py-1.5 font-bold text-lg lg:text-2xl italic tracking-tight"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="text-cream-50/20 hover:text-strawberry-500 transition-all p-2 hover:scale-110 active:scale-90"
              >
                <X size={24} />
              </button>
            )}
            
            {/* Inner glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-caramel-500/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
