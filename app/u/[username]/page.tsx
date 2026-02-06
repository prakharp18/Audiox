"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { WaveformRecorder } from "@/components/voice-recorder";
import { MusicToggle } from "@/components/ui/music-toggle";
import { CanvasCrowd } from "@/components/ui/canvas-crowd";
import { Preloader } from "@/components/ui/preloader";
import { InformationCircleIcon } from "hugeicons-react";

export default function UserPublicPage() {
  const { username } = useParams();
  const [isSending, setIsSending] = useState(false);

  const handleSendVoice = async (blob: Blob) => {
    setIsSending(true);
    console.log("Audio Blob captured:", blob);
    
    setTimeout(() => {
        setIsSending(false);
        alert(`Voice message sent to @${username}! (Simulation)`);
    }, 2000);
  };

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground overflow-hidden selection:bg-primary selection:text-white font-sans">
      <Preloader />
      <CanvasCrowd />
      <MusicToggle />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="w-full max-w-lg flex flex-col items-center"
        >

          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary to-primary border-4 border-zinc-900 shadow-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white uppercase">{username?.[0]}</span>
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-heading font-bold tracking-tight text-white mb-1">
                    @{username}
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Accepting Anons</span>
                </div>
            </div>
          </div>


          <WaveformRecorder onSend={handleSendVoice} isSending={isSending} />


          <div className="mt-12 flex items-center gap-3 px-6 py-3 rounded-2xl bg-zinc-950/30 border border-zinc-900/50 backdrop-blur-sm">
            <InformationCircleIcon className="w-4 h-4 text-zinc-500" />
            <p className="text-[11px] text-zinc-500 leading-tight">
                Your identity is 100% hidden. We don't track your voice info <br />
                or metadata. Share freely.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">
            POWERED BY AUDIOX &bull; 2026
        </p>
      </div>
    </main>
  );
}
