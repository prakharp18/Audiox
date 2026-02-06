"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic01Icon, StopIcon, Delete02Icon, SentIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

interface WaveformRecorderProps {
  onSend: (blob: Blob) => void;
  isSending: boolean;
}

export const WaveformRecorder = ({ onSend, isSending }: WaveformRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 rounded-3xl bg-zinc-950/50 border border-zinc-900 backdrop-blur-xl shadow-2xl w-full max-w-md">
      <div className="relative flex items-center justify-center">

        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.15 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0.05 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            </>
          )}
        </AnimatePresence>


        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!!audioBlob || isSending}
          className={cn(
            "relative z-10 flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 shadow-xl",
            isRecording ? "bg-red-500 shadow-red-500/20" : "bg-primary shadow-primary/20",
            (audioBlob || isSending) && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {isRecording ? (
            <StopIcon className="w-10 h-10 text-white fill-current" />
          ) : (
            <Mic01Icon className="w-10 h-10 text-white" />
          )}
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={cn(
          "text-4xl font-heading font-bold tracking-tighter tabular-nums",
          isRecording ? "text-white" : "text-zinc-500"
        )}>
          {formatTime(recordingTime)}
        </span>
        <p className="text-zinc-600 text-xs uppercase tracking-widest font-mono">
          {isRecording ? "Recording Live..." : audioBlob ? "Recording Ready" : "Tap to Speak"}
        </p>
      </div>


      <AnimatePresence>
        {audioBlob && !isSending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-4 w-full"
          >
            <button
              onClick={resetRecording}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              <Delete02Icon className="w-5 h-5" />
              <span className="font-medium">Discard</span>
            </button>
            <button
              onClick={() => onSend(audioBlob)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg"
            >
              <SentIcon className="w-5 h-5" />
              <span>Send Anon</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {isSending && (
        <div className="flex items-center gap-3 py-4 text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          <span className="text-sm font-medium ml-2">Uploading to Audio Vault...</span>
        </div>
      )}
    </div>
  );
};
