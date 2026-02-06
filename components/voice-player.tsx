"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayIcon, PauseIcon, Download02Icon, Share01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

interface VoicePlayerProps {
  url: string;
  duration: number;
  timestamp: string;
}

export const VoicePlayer = ({ url, duration, timestamp }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="group relative p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-primary/30 transition-all duration-500 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
                >
                    {isPlaying ? (
                        <PauseIcon className="w-5 h-5 fill-current" />
                    ) : (
                        <PlayIcon className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </button>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-tight">Voice Anon</span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{timestamp}</span>
                </div>
           </div>
           
           <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                    <Download02Icon className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                    <Share01Icon className="w-4 h-4" />
                </button>
           </div>
        </div>


        <div className="flex items-end gap-[3px] h-10 w-full px-1">
            {[...Array(30)].map((_, i) => {
                const height = 20 + Math.random() * 60;
                const progress = (currentTime / duration) * 30;
                const isActive = i <= progress;

                return (
                    <div 
                        key={i} 
                        className={cn(
                            "flex-1 rounded-full transition-all duration-300",
                            isActive ? "bg-primary" : "bg-zinc-800"
                        )}
                        style={{ height: `${height}%` }}
                    />
                );
            })}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="hidden"
      />
    </div>
  );
};
