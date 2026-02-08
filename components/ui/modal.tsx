"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "w-full bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden",
                widthClasses[width]
              )}
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white leading-none tracking-tight">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-xs text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {children}
              </div>

              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 bg-zinc-900/30 border-t border-zinc-800/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
