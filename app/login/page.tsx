"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleIcon, Loading03Icon } from "hugeicons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Preloader } from "@/components/ui/preloader";
import { continueWithGoogle, checkUsername } from "@/app/actions/auth";
import { profileSchema } from "@/schemas/authSchema";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      setErrorMessage("");
      return;
    }

    // Client-side Zod validation for instant feedback
    const result = profileSchema.pick({ username: true }).safeParse({ username });
    if (!result.success) {
      setIsAvailable(false);
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    setIsChecking(true);
    setErrorMessage("");
    
    const timer = setTimeout(async () => {
      try {
        const { available, error } = await checkUsername(username);
        setIsAvailable(available);
        if (error) setErrorMessage(error);
      } catch (err) {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [username]);

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#EFDFBB] font-sans selection:bg-[#722F37] selection:text-[#EFDFBB]">
      <Preloader />
      <section className="flex-1 relative flex flex-col items-center justify-center p-8 md:p-12 bg-[#EFDFBB] text-[#722F37]">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-full bg-[#722F37] flex items-center justify-center text-[#EFDFBB] group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">A</span>
             </div>
        </Link>
        <div className="w-full max-w-sm">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter mb-2 italic">
              Create Your Board
            </h1>
            <p className="text-sm font-medium opacity-80">Claim your voice handle and start receiving anons.</p>
          </header>
          <div className="flex flex-col gap-6">
            <div className="relative">
              <label htmlFor="username" className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60">
                Choose a Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold opacity-30">@</span>
                <input 
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full bg-white/50 border-2 border-[#722F37]/10 focus:border-[#722F37] rounded-2xl pl-10 pr-12 py-4 text-lg font-bold placeholder:opacity-20 outline-none transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <AnimatePresence mode="wait">
                     {isChecking ? (
                       <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <Loading03Icon className="w-5 h-5 animate-spin" />
                       </motion.div>
                     ) : null}
                   </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {isAvailable === true && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider"
                    >
                        Username is available
                    </motion.p>
                )}
                {isAvailable === false && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider"
                    >
                        {errorMessage || "Username is not available"}
                    </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button 
              disabled={!isAvailable || isChecking}
              onClick={() => continueWithGoogle(username)}
              className={cn(
                "group relative w-full flex items-center justify-center gap-3 py-5 rounded-2xl transition-all duration-300 shadow-xl active:scale-[0.98]",
                isAvailable && !isChecking 
                  ? "bg-[#722F37] text-[#EFDFBB] hover:shadow-2xl hover:-translate-y-1" 
                  : "bg-[#722F37]/10 text-[#722F37]/40 cursor-not-allowed shadow-none"
              )}
            >
              <span className="text-lg font-bold italic">Continue with Google</span>
              <GoogleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
      <section className="flex-1 relative flex flex-col items-center justify-center p-8 md:p-12 bg-[#722F37] text-[#EFDFBB]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full border-[100px] border-[#EFDFBB] blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full border-[100px] border-[#EFDFBB] blur-[100px]" />
        </div>
        <div className="w-full max-w-sm relative z-10 text-center">
            <header className="mb-10">
                <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter mb-2 italic">
                    Already a Pilot?
                </h2>
                <p className="text-sm font-medium opacity-60">Log back into your cockpit.</p>
            </header>
            <button 
                onClick={() => continueWithGoogle()}
                className="group w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#EFDFBB] text-[#722F37] font-bold text-lg italic transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
            >
                <span>Sign in with Google</span>
                <GoogleIcon className="w-6 h-6" />
            </button>
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                <span>Secured by Audiox Vault</span>
            </div>
        </div>
      </section>
    </main>
  );
}