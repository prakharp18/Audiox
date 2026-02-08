"use client";

import { useEffect } from "react";
import { AlertCircleIcon, RefreshIcon, Logout01Icon } from "hugeicons-react";
import { signOut } from "next-auth/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black z-0" />
      
      <div className="relative z-10 max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-red-500/20">
            <AlertCircleIcon className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
            System Critical
        </h2>
        
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            A secure connection could not be established or the session has expired.
            <br className="hidden md:block" />
            Please re-authenticate to continue.
        </p>

        <div className="flex flex-col gap-3 w-full">
            <button
                onClick={() => reset()}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
                <RefreshIcon className="w-4 h-4" />
                Retry Connection
            </button>
            
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full py-3 bg-zinc-900 text-zinc-400 font-medium rounded-xl hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center gap-2 border border-zinc-800"
            >
                <Logout01Icon className="w-4 h-4" />
                Re-Login (Recommended)
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900 w-full">
             <p className="text-[10px] text-zinc-600 font-mono tracking-widest break-all">
                ID: {error.digest || "UNKNOWN_ERROR"}
             </p>
        </div>
      </div>
    </div>
  );
}
