"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight01Icon, ZapIcon, Analytics01Icon, Shield01Icon } from "hugeicons-react";
import { Skiper39 } from "@/components/ui/skiper-ui/skiper39";
import { Preloader } from "@/components/ui/preloader";
import { useState } from "react";

export default function Home() {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[#f9f7f2] text-zinc-900 overflow-hidden selection:bg-primary selection:text-white">
      <Preloader />
      <Skiper39 />


      <div 
        className="absolute top-6 right-6 z-50 flex flex-col items-end"
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
        <Link href="http://vox-omega.vercel.app/" target="_blank">
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 border border-zinc-200 backdrop-blur-md cursor-pointer hover:bg-white hover:border-zinc-300 transition-all duration-300 shadow-sm">
              <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
              <span className="text-xl font-heading font-black tracking-tighter text-zinc-900">VOX</span>
              <div className="flex flex-col items-start leading-none ml-1">
                  <span className="text-[8px] font-mono font-bold text-emerald-600 uppercase tracking-widest px-1 bg-emerald-100 rounded">LIVE</span>
              </div>
          </div>
        </Link>

        {/* Animated Dropdown (Maximizing Window Effect) */}
        <AnimatePresence>
            {isLogoHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(10px)" }}
                    transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
                    className="mt-3 w-80 p-0 rounded-3xl bg-white/95 border border-zinc-200 backdrop-blur-xl shadow-2xl origin-top-right overflow-hidden group"
                >
                    {/* Header Image Section */}
                    <div className="relative h-32 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                        <img 
                            src="/images/vox-preview.png" 
                            alt="VOX Preview" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-3 left-4 z-20">
                            <h3 className="text-white font-heading font-bold text-lg leading-none">Vox</h3>
                            <p className="text-zinc-200 text-[10px] uppercase tracking-wider">Secure & Anonymous</p>
                        </div>
                    </div>

                    {/* Summary Content */}
                    <div className="p-5 pt-2 flex flex-col gap-4">
                        <p className="text-xs text-zinc-600 leading-relaxed">
                            <span className="text-zinc-900 font-bold">VOX</span> is the sound of anonymity. Vox is a privacy-focused, real-time anonymous messaging application.
                        </p>

                        <div className="pt-2 border-t border-zinc-100">
                             <div className="flex items-center justify-between text-[10px]">
                                 <span className="text-zinc-500 uppercase tracking-widest">System Status</span>
                                 <span className="text-emerald-600 font-bold uppercase tracking-wider">Operational</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 pt-32 text-center md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 max-w-2xl px-4"
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              V 2.0 &bull; SYSTEM ONLINE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-zinc-900 leading-[0.9]">
            Share what you <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400">
              can't say freely.
            </span>
          </h1>

          <p className="text-zinc-600 text-sm md:text-base max-w-md leading-relaxed font-medium">
            The anonymous voice messaging platform. Encrypted, untraceable, and designed for radical honesty.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl">
                    <span>Create Your Board</span>
                    <ArrowRight01Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
            
            <Link href="/search" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-full font-medium transition-all hover:bg-zinc-50 shadow-sm hover:shadow-md">
                    <span>Find a User</span>
                </button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
            VOX &copy; 2026 &bull; POWERED BY AUDIOX
        </p>
      </div>
    </main>
  );
}
