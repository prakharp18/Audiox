"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MusicNote01Icon } from "hugeicons-react";

export const MusicToggle = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleMusic = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <button 
            onClick={toggleMusic}
            className="group absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md hover:bg-zinc-800 transition-colors"
        >
            <div className="relative flex items-center justify-center w-5 h-5">
                {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3">
                         <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-primary rounded-full" />
                         <motion.div animate={{ height: [8, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-primary rounded-full" />
                         <motion.div animate={{ height: [12, 6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-primary rounded-full" />
                    </div>
                ) : (
                    <MusicNote01Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                )}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                {isPlaying ? "ON" : "OFF"}
            </span>
        </button>
    );
};
