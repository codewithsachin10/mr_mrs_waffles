"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Lock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-chocolate-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-chocolate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-caramel-500 rounded-full flex items-center justify-center text-chocolate-950 shadow-[0_0_30px_rgba(212,163,115,0.3)]">
            <Coffee size={32} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-heading font-black italic text-cream-50 uppercase tracking-tight italic">
              Admin <span className="text-caramel-500">Access</span>
            </h1>
            <p className="text-cream-100/40 text-sm font-medium uppercase tracking-widest mt-2">
              Management Portal
            </p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-strawberry-500/10 border border-strawberry-500/20 rounded-2xl flex items-center gap-3 text-strawberry-500 text-sm font-bold animate-shake"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-black tracking-widest text-cream-100/60 ml-1">
              Store Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-caramel-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@mrmrswaffles.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/20 focus:border-caramel-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-black tracking-widest text-cream-100/60 ml-1">
              Store Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-caramel-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/20 focus:border-caramel-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-chocolate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Secure Login</span>
                <Lock size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
