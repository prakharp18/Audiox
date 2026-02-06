"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VoicePlayer } from "@/components/voice-player";
import { Preloader } from "@/components/ui/preloader";
import { 
  UserCircleIcon, 
  Settings02Icon, 
  Logout01Icon, 
  VoiceIcon,
  Search01Icon
} from "hugeicons-react";

export default function DashboardPage() {
  const [username] = useState("Prakhar");

  const messages = [
    { url: "#", duration: 12, timestamp: "Today, 10:45 AM" },
    { url: "#", duration: 45, timestamp: "Yesterday, 3:20 PM" },
    { url: "#", duration: 8, timestamp: "Oct 24, 9:01 PM" },
  ];

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground overflow-hidden selection:bg-primary font-sans">
      <Preloader />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          

          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-900 backdrop-blur-xl">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                        {username[0]}
                    </div>
                    <div>
                        <h2 className="text-lg font-heading font-bold tracking-tight text-white leading-none capitalize">
                            {username}
                        </h2>
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Verified Pilot</span>
                    </div>
                 </div>

                 <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-all">
                        <VoiceIcon className="w-5 h-5" />
                        <span className="text-sm font-bold">Audio Inbox</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                        <UserCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-bold">Public Profile</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                        <Settings02Icon className="w-5 h-5" />
                        <span className="text-sm font-bold">Settings</span>
                    </button>
                 </nav>

                 <div className="mt-8 pt-8 border-t border-zinc-900">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all w-full text-left">
                        <Logout01Icon className="w-5 h-5" />
                        <span className="text-sm font-bold">Sign Out</span>
                    </button>
                 </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary border border-primary/20 shadow-[0_0_30px_-10px_var(--color-primary)]">
                <h3 className="text-white font-heading font-bold tracking-tight text-lg mb-2">Share your board</h3>
                <p className="text-white/70 text-xs mb-4">Let people send you anonymous voice messages freely.</p>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/20 border border-white/10 overflow-hidden">
                    <span className="text-[10px] text-white/80 font-mono truncate flex-1">audiox.app/u/{username}</span>
                    <button className="px-3 py-1 rounded-lg bg-white text-black text-[10px] font-bold uppercase hover:bg-zinc-200">Copy</button>
                </div>
            </div>
          </div>


          <div className="lg:col-span-9 flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-white">Audio Vault</h1>
                    <p className="text-zinc-500 text-sm">You have {messages.length} unheard voice anons.</p>
                </div>
                <div className="relative group max-w-xs w-full">
                    <Search01Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search anons..."
                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
            </header>

           <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5, delay: 2.5 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {messages.map((msg, idx) => (
                    <VoicePlayer 
                        key={idx}
                        url={msg.url}
                        duration={msg.duration}
                        timestamp={msg.timestamp}
                    />
                ))}
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
