"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search02Icon as SearchXIcon, Home01Icon } from "hugeicons-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, type: "spring" }}
           className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]"
        >
            <SearchXIcon className="w-12 h-12 text-red-500" />
        </motion.div>

        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                404
            </h1>
            <p className="text-xl font-mono text-red-500 tracking-widest uppercase animate-pulse">
                SIGNAL LOST
            </p>
        </div>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            The user entity you are looking for does not exist in the Audiox grid. They may have been deleted or never existed.
        </p>

        <Link href="/">
            <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 mx-auto">
                <Home01Icon className="w-5 h-5" />
                Return to Base
            </button>
        </Link>
      </div>

       <div className="absolute bottom-8 text-[10px] text-zinc-600 font-mono tracking-widest">
            ERROR_CODE: USER_NOT_FOUND // SYSTEM_HALT
       </div>
    </div>
  );
}
