"use client";

import React, { useState } from "react";
import { Link01Icon as LinkIcon, AlertCircleIcon as AlertCircle } from "hugeicons-react";
import { 
  Loader2, 
  Send, 
  Sparkles, 
  Linkedin, 
  ArrowUpRight,
  Mic,
  Info
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { PublicFAQ } from "@/components/public-faq";
import { VoiceRecorder } from "@/components/voice-recorder";
import { cn } from "@/lib/utils";
import { checkSystemStatus } from "@/app/actions/public";

const Button = ({ className, variant = "default", size = "default", ...props }: any) => {
  const variants = {
    default: "bg-white text-black hover:bg-zinc-200",
    outline: "border border-zinc-800 bg-black/50 hover:bg-zinc-900 text-zinc-300 hover:text-white",
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-white"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10 flex items-center justify-center p-0"
  };
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      {...props}
    />
  );
};

export function PublicProfileClient({ 
  username, 
  userId, 
  isAcceptingMessages,
  limitReached
}: { 
  username: string; 
  userId: string; 
  isAcceptingMessages: boolean;
  limitReached: boolean;
}) {
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [isCheckingSystem, setIsCheckingSystem] = useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const { status } = await checkSystemStatus();
        setIsSystemOnline(status === "online");
      } catch (e) {
        setIsSystemOnline(false);
      } finally {
        setIsCheckingSystem(false);
      }
    };
    
    checkStatus();
    
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden font-sans">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black pointer-events-none" />

      {/* Top bar - responsive positioning and layout */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-4">
        <Link href="https://audiox-omega.vercel.app/">
          <Button variant="outline" size="sm" className="rounded-full backdrop-blur-md text-[11px] sm:text-xs px-3 sm:px-4">
            Join Audiox
          </Button>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/50 border border-zinc-800 px-2.5 sm:px-3 h-8 rounded-full backdrop-blur-md">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            isCheckingSystem ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : isSystemOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          )} />
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
            {isCheckingSystem ? "CHECKING..." : isSystemOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Main Grid - responsive layout */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 h-auto mt-16 sm:mt-20 md:mt-0 mb-24 sm:mb-20 md:mb-0">
        
        {/* Left Column - Main Content */}
        <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 h-full">
          
          {/* Header Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2 sm:gap-3">
              AUDIOX <span className="text-zinc-600 font-mono text-base sm:text-lg font-normal">/ PUBLIC</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mt-2">
              <p className="text-zinc-400 text-sm md:text-base">
                Sending to <span className="text-white font-semibold">@{username}</span>
              </p>
              {isAcceptingMessages ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wide w-fit">
                  Accepting Messages
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wide w-fit">
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Voice Recorder Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-8 flex-1 shadow-2xl flex flex-col relative overflow-hidden min-h-[350px] sm:min-h-[450px]">
             
             {(!isAcceptingMessages || limitReached) && (
                <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 text-center">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl max-w-sm w-full shadow-2xl">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            {limitReached ? "Daily Limit Reached" : "Unavailable"}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6">
                            {limitReached 
                                ? `To prevent spam, @${username} cannot receive more messages today.`
                                : `@${username} is currently not accepting new messages.`
                            }
                        </p>
                        <a href="https://audiox-omega.vercel.app/">
                            <Button className="w-full font-bold">
                                Create Your Own Board
                            </Button>
                        </a>
                    </div>
                </div>
             )}

             <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <Mic className="w-4 h-4 text-indigo-500" />
                <span className="text-zinc-300 text-xs font-mono uppercase tracking-widest">
                    Record Message
                </span>
             </div>

             <div className="flex-1 flex flex-col justify-center items-center">
                <VoiceRecorder 
                    recipientId={userId}
                    onSent={() => toast.success("Message sent successfully!")}
                />
             </div>
          </div>
        </div>

        {/* Right Column - FAQ */}
        <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex-1 flex flex-col overflow-hidden min-h-[250px] sm:min-h-[300px]">
            <h3 className="text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              FAQ
            </h3>
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 min-h-0">
                <PublicFAQ />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - matching Vox responsive pattern */}
      <footer className="absolute bottom-4 z-50 flex items-center justify-center w-full pointer-events-none md:fixed md:bottom-8 px-4">
        <div className="pointer-events-auto flex items-center justify-start md:justify-center bg-zinc-950 border border-zinc-800 rounded-full pl-3 sm:pl-4 pr-4 sm:pr-6 h-12 md:h-10 gap-3 sm:gap-4 md:gap-3 max-w-full md:w-auto shadow-2xl overflow-x-auto no-scrollbar md:overflow-visible">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] sm:text-[10px] font-black tracking-tighter text-zinc-400">
            A
          </div>

          <div className="shrink-0 flex items-center gap-3 sm:gap-5 md:gap-3">
            {/* Developer Link */}
            <a
              href="https://www.linkedin.com/in/pporwal25/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start justify-center group shrink-0"
            >
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium leading-none mb-0.5 group-hover:text-zinc-400 transition-colors">
                Developer
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-200 font-bold leading-none flex items-center gap-1 sm:gap-1.5 group-hover:text-white transition-colors">
                <Linkedin className="w-3 h-3 text-[#0a66c2]" />
                Prakhar Porwal
              </span>
            </a>

            <div className="w-px h-5 sm:h-6 bg-zinc-800 shrink-0" />

            {/* Vox Link */}
            <a
              href="https://vox-omega.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start justify-center group shrink-0"
            >
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium leading-none mb-0.5 group-hover:text-zinc-400 transition-colors">
                Vox
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-200 font-bold leading-none flex items-center gap-1 sm:gap-1.5 group-hover:text-white transition-colors">
                Vox
                <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
              </span>
            </a>

            <div className="w-px h-5 sm:h-6 bg-zinc-800 shrink-0" />

            {/* Status */}
            <div className="flex flex-col items-start justify-center shrink-0">
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium leading-none mb-0.5">
                Status
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-400 font-bold leading-none flex items-center gap-1 sm:gap-1.5">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                </span>
                Available for work
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}