"use client";

import { useState, useEffect, useRef } from "react";
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
  Edit02Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import {
  toggleAcceptMessages,
  getMessages,
  deleteAccount,
  deleteMessage,
  deleteAllMessages,
} from "@/app/actions/dashboard";
import { updateUsername, checkUsernameAvailability } from "@/app/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";

interface Message {
  id: string;
  url: string;
  duration: number;
  createdAt: string;
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
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isClearFeedModalOpen, setIsClearFeedModalOpen] = useState(false);
  const [isEditUsernameModalOpen, setIsEditUsernameModalOpen] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [usernameStatus, setUsernameStatus] = useState<{ checking: boolean; available: boolean | null; error?: string }>({ checking: false, available: null });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const link = `https://audiox-omega.vercel.app/u/${username}`;
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
    setIsDeleteAccountModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount();
      await signOut({ callbackUrl: "/" });
      toast.success("Account deleted");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleteAccountModalOpen(false);
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
    setIsClearFeedModalOpen(true);
  };

  const confirmDeleteAll = async () => {
    const oldMessages = [...messages];
    setMessages([]);
    toast.success("All messages deleted");
    setIsClearFeedModalOpen(false);
    
    try {
      await deleteAllMessages();
    } catch (error) {
      toast.error("Failed to delete messages from server");
      setMessages(oldMessages);
    }
  };

  const handleUpdateUsername = async (formData: FormData) => {
    setIsUpdatingUsername(true);
    try {
        const newUsername = formData.get("newUsername") as string;
        if (newUsername === username) {
            setIsEditUsernameModalOpen(false);
            return;
        }
        
        const result = await updateUsername(newUsername);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Username updated successfully!");
            setIsEditUsernameModalOpen(false);
            window.location.reload(); 
        }
    } catch (error) {
        toast.error("Failed to update username");
    } finally {
        setIsUpdatingUsername(false);
    }
  };

  const handleUsernameInputChange = (value: string) => {
    setUsernameInput(value);
    setUsernameStatus({ checking: true, available: null });
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (value.length < 3) {
      setUsernameStatus({ checking: false, available: null, error: value.length > 0 ? "Too short" : undefined });
      return;
    }
    
    debounceRef.current = setTimeout(async () => {
      const result = await checkUsernameAvailability(value);
      setUsernameStatus({ 
        checking: false, 
        available: result.available, 
        error: result.error 
      });
    }, 500);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const totalMessages = messages.length;
  const newMessages = messages.filter((m) => {
    if (!m.createdAt) return false;
    const msgDate = new Date(m.createdAt).getTime();
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return msgDate > twentyFourHoursAgo;
  }).length;

  return (
    <>
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
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-zinc-900 p-4 lg:p-6 flex flex-col gap-4 lg:gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Welcome back,
            </p>
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl font-bold tracking-tight truncate max-w-[200px]">{username}</h1>
              <button 
                onClick={() => setIsEditUsernameModalOpen(true)}
                className="p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                title="Edit Username"
              >
                <Edit02Icon className="w-4 h-4" />
              </button>
            </div>
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
                  https://audiox-omega.vercel.app/u/{username}
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
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
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
                  createdAt={msg.createdAt}
                  onDelete={() => handleDeleteMessage(msg.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
    <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Delete Account?"
        description="This action cannot be undone. All your data and messages will be permanently removed."
        footer={
          <>
            <button
              onClick={() => setIsDeleteAccountModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteAccount}
              className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20"
            >
              Delete Account
            </button>
          </>
        }
      />
      <Modal
        isOpen={isClearFeedModalOpen}
        onClose={() => setIsClearFeedModalOpen(false)}
        title="Clear Feed?"
        description="Are you sure you want to delete ALL messages? This cannot be undone."
        footer={
          <>
            <button
              onClick={() => setIsClearFeedModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteAll}
              className="px-4 py-2 text-sm font-medium bg-zinc-100 hover:bg-white text-black rounded-lg transition-colors font-bold"
            >
              Clear Everything
            </button>
          </>
        }
      />
      <Modal
        isOpen={isEditUsernameModalOpen}
        onClose={() => setIsEditUsernameModalOpen(false)}
        title="Change Username"
        description="Choose a unique username for your Audiox profile."
      >
        <form action={handleUpdateUsername} className="space-y-4">
            <div className="space-y-2">
                <div className="relative">
                  <input
                      name="newUsername"
                      value={usernameInput}
                      onChange={(e) => handleUsernameInputChange(e.target.value)}
                      placeholder="Enter new username"
                      className={cn(
                        "w-full bg-zinc-900 border rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all font-mono text-sm pr-10",
                        usernameStatus.available === true && "border-green-500 focus:ring-green-500/20",
                        usernameStatus.available === false && "border-red-500 focus:ring-red-500/20",
                        usernameStatus.available === null && "border-zinc-800 focus:ring-white/20"
                      )}
                      required
                      minLength={3}
                      maxLength={15}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus.checking && (
                      <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {!usernameStatus.checking && usernameStatus.available === true && (
                      <span className="text-green-500 text-sm">✓</span>
                    )}
                    {!usernameStatus.checking && usernameStatus.available === false && (
                      <span className="text-red-500 text-sm">✗</span>
                    )}
                  </div>
                </div>
                {usernameStatus.error && (
                  <p className="text-xs text-red-500">{usernameStatus.error}</p>
                )}
                {usernameStatus.available === true && !usernameStatus.checking && (
                  <p className="text-xs text-green-500">Username is available!</p>
                )}
                <ul className="text-[10px] text-zinc-500 space-y-1 list-disc list-inside">
                    <li>3-15 characters long</li>
                    <li>Letters, numbers, and underscores only</li>
                    <li>No spaces allowed</li>
                </ul>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={() => setIsEditUsernameModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isUpdatingUsername || usernameStatus.available === false || usernameStatus.checking}
                    className="px-4 py-2 text-sm font-bold bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdatingUsername ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
}