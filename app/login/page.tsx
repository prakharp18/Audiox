"use client";

import { GoogleIcon } from "hugeicons-react";
import Link from "next/link";
import { Preloader } from "@/components/ui/preloader";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black text-white font-sans relative overflow-hidden">
      <Preloader />
      
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
      
      <section className="relative z-10 flex flex-col items-center justify-center p-8 md:p-12">
        <Link href="/" className="flex items-center gap-3 group mb-16">
          <span className="text-2xl font-bold tracking-tight">Audiox</span>
        </Link>
        
        <div className="w-full max-w-sm text-center">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
              Welcome
            </h1>
            <p className="text-sm text-zinc-400">
              Sign in to receive anonymous voice messages.
            </p>
          </header>
          
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white text-black font-bold text-base transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-xs text-zinc-500 mt-6">
            You can set your unique @username after signing in.
          </p>
          
          <div className="mt-16 text-[10px] text-zinc-600 uppercase tracking-widest">
            Secured by Audiox
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
        }
        .stars {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 160px 120px, white, transparent);
          background-size: 200px 200px;
          animation: twinkle 4s ease-in-out infinite;
        }
        .stars2 {
          background-image: 
            radial-gradient(1px 1px at 75px 45px, white, transparent),
            radial-gradient(1px 1px at 100px 100px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 125px 25px, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 50px 175px, white, transparent),
            radial-gradient(1px 1px at 175px 150px, rgba(255,255,255,0.8), transparent);
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .stars3 {
          background-image: 
            radial-gradient(1px 1px at 25px 75px, white, transparent),
            radial-gradient(1px 1px at 150px 50px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 80px 140px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 180px 90px, white, transparent);
          background-size: 200px 200px;
          animation: twinkle 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}