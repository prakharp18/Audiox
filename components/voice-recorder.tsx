"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic01Icon, StopIcon, Delete02Icon, SentIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sendMessage } from "@/app/actions/public";

interface VoiceRecorderProps {
  recipientId: string;
  onSent: () => void;
}

export const VoiceRecorder = ({ recipientId, onSent }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSending, setIsSending] = useState(false);
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
      toast.error("Could not access microphone");
    }
  };

  const MAX_DURATION = 45;

  useEffect(() => {
    if (isRecording && recordingTime >= MAX_DURATION) {
      stopRecording();
      toast.info(`Time limit reached (${MAX_DURATION}s)`);
    }
  }, [recordingTime, isRecording]);

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

  const handleSend = async () => {
    if (!audioBlob) return;
    setIsSending(true);

    try {
        const formData = new FormData();
        formData.append("recipientId", recipientId);
        formData.append("duration", recordingTime.toString());
        formData.append("audio", audioBlob, "message.webm");

        const result = await sendMessage(formData);

        if (!result.success) {
          if (result.error === "LIMIT_REACHED") {
            toast.error("Daily limit reached", {
                description: "This user cannot receive more messages today."
            });
          } else {
            throw new Error(result.error);
          }
          setIsSending(false);
          return;
        }

        onSent();
        // Reset internal state
        setAudioBlob(null);
        setRecordingTime(0);
        audioChunksRef.current = [];
        setIsSending(false);
    } catch (error) {
        toast.error("Failed to send message");
        setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative flex items-center justify-center py-4">
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-red-500"
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
            "relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 border-2",
            isRecording 
                ? "bg-red-500 text-white border-red-400 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]" 
                : "bg-zinc-900 text-zinc-100 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800",
            (audioBlob || isSending) && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {isRecording ? (
            <StopIcon className="w-8 h-8 fill-current" />
          ) : (
            <Mic01Icon className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={cn(
          "text-4xl font-mono font-bold tracking-tighter tabular-nums",
          isRecording ? "text-red-500" : "text-zinc-500"
        )}>
          {formatTime(recordingTime)}
        </span>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
          {isRecording ? "Recording Live" : audioBlob ? "Ready to Send" : "Tap to Record"}
        </p>
      </div>

      <AnimatePresence>
        {audioBlob && !isSending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 w-full"
          >
            <button
              onClick={resetRecording}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all active:scale-[0.98] text-xs font-bold uppercase tracking-wide"
            >
              <Delete02Icon className="w-4 h-4" />
              <span>Discard</span>
            </button>
            <button
              onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] text-xs uppercase tracking-wide"
            >
              <SentIcon className="w-4 h-4" />
              <span>Send</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isSending && (
        <div className="flex items-center gap-2 py-4 text-zinc-500">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest">Encrypting & Uploading...</span>
        </div>
      )}
    </div>
  );
};