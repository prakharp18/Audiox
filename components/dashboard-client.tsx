"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { VoicePlayer } from "@/components/voice-player";
import { Preloader } from "@/components/ui/preloader";
import {
  Logout01Icon,
  Copy01Icon,
  RefreshIcon,
  Delete02Icon,
  Message01Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import {
  toggleAcceptMessages,
  getMessages,
  deleteAccount,
  deleteMessage,
  deleteAllMessages,
} from "@/app/actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  url: string;
  duration: number;
  timestamp: string;
}

interface DashboardClientProps {
  initialUsername: string;
  initialAcceptMessages: boolean;
  initialMessages: any[];
  dailyCount: number;
}

export function DashboardClient({
  initialUsername,
  initialAcceptMessages,
  initialMessages,
  dailyCount = 0,
}: DashboardClientProps) {
  const router = useRouter();
  const [username] = useState(initialUsername);
  const [isOnline, setIsOnline] = useState(initialAcceptMessages);
  const [acceptMessages, setAcceptMessages] = useState(initialAcceptMessages);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsOnline(acceptMessages);
  }, [acceptMessages]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const msgs = await getMessages();
      setMessages(msgs);
      router.refresh();
      toast.success("Feed refreshed");
    } catch (error) {
      toast.error("Failed to refresh feed");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date()
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .toLowerCase()
      );
    }, 1000);

    const msgTimer = setInterval(async () => {
      const msgs = await getMessages();
      setMessages(msgs);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, []);

  const handleCopyLink = async () => {
    const link = `https://audiox.vercel.app/message/${username}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAccept = async () => {
    try {
      const newState = !acceptMessages;
      setAcceptMessages(newState);
      await toggleAcceptMessages(newState);
      if (newState) {
        toast.success("You are now ONLINE");
      } else {
        toast("You are now OFFLINE", {
          description: "You won't receive new messages.",
        });
      }
    } catch (error) {
      setAcceptMessages(!acceptMessages);
      toast.error("Failed to update settings");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
        await signOut({ callbackUrl: "/" });
        toast.success("Account deleted");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted");
    try {
      await deleteMessage(id);
    } catch (error) {
      toast.error("Failed to delete message from server");
      refreshData();
    }
  };

  const handleDeleteAll = async () => {
    if (messages.length === 0) return;
    if (
      confirm(
        "Are you sure you want to delete ALL messages? This cannot be undone."
      )
    ) {
      const oldMessages = [...messages];
      setMessages([]);
      toast.success("All messages deleted");
      try {
        await deleteAllMessages();
      } catch (error) {
        toast.error("Failed to delete messages from server");
        setMessages(oldMessages);
      }
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const totalMessages = messages.length;
  // Simple check for "Today" in timestamp matching
  const newMessages = messages.filter(
    (m) => m.timestamp && m.timestamp.includes("Today")
  ).length;

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Preloader />
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3 text-xs text-zinc-500">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Logout01Icon className="w-4 h-4" />
          Sign out to clear session.
        </button>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className={cn(
            "p-2 rounded-lg hover:bg-zinc-900 transition-colors",
            isRefreshing && "animate-spin cursor-not-allowed opacity-50"
          )}
        >
          <RefreshIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="relative z-10 flex min-h-screen">
        <div className="w-80 border-r border-zinc-900 p-6 flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Welcome back,
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{username}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isOnline ? "bg-green-500" : "bg-zinc-600"
                )}
              />
              <span className="text-xs text-zinc-500">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Total
                </p>
                <p className="text-3xl font-bold">{totalMessages}</p>
              </div>
              <div>
                <p className="text-[10px] text-green-500 uppercase tracking-widest">
                  New (24H)
                </p>
                <p className="text-3xl font-bold text-green-500">
                  +{newMessages}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
              Control Panel
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Accept Messages</span>
              <button
                onClick={handleToggleAccept}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  acceptMessages ? "bg-green-500" : "bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    acceptMessages ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Daily Limit
                </p>
                <p className="text-[10px] text-zinc-400">
                  {dailyCount}/3 Used
                </p>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min((dailyCount / 3) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                Your Unique Link
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-400 truncate flex-1">
                  https://audiox.vercel.app/message/{username}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <Copy01Icon className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-500 mt-1">Copied!</p>}
            </div>
            <button
              onClick={handleDeleteAll}
              disabled={messages.length === 0}
              className="w-full py-2 text-xs text-zinc-500 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Feed (Delete All)
            </button>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs">
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500">Security</span>
              <span className="text-green-500">AES-256</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500">System Time</span>
              <span className="text-zinc-400">{currentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Database</span>
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
          </div>
          <div className="mt-auto flex gap-3">
            <button
              onClick={handleSignOut}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <header className="mb-6">
            <h2 className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Incoming Feed
            </h2>
          </header>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <Message01Icon className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold mb-1">No Messages Yet</h3>
              <p className="text-sm text-zinc-500">
                Your feed is waiting for messages.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-4"
            >
              {messages.map((msg) => (
                <VoicePlayer
                  key={msg.id}
                  url={msg.url}
                  duration={msg.duration}
                  timestamp={msg.timestamp}
                  onDelete={() => handleDeleteMessage(msg.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}