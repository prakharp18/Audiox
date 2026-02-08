"use client";

import { useEffect } from "react";
import { AlertCircleIcon } from "hugeicons-react";

export default function GlobalError({
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
    <html>
      <body className="bg-black text-white font-sans flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-3xl text-center">
            <AlertCircleIcon className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">Fatal System Error</h2>
            <p className="text-zinc-400 text-sm mb-6">
                A critical error occurred in the layout kernel.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200"
            >
                Reboot System
            </button>
        </div>
      </body>
    </html>
  );
}
