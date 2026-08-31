import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface PufferMessageProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export function PufferMessage({ message, duration = 4200, onDismiss }: PufferMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss, message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={onDismiss}
      role="status"
      aria-live="polite"
      className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 z-50 cursor-pointer pointer-events-auto select-none max-w-[260px] sm:max-w-[280px] w-max"
    >
      <div className="relative rounded-2xl bg-foreground/95 px-3.5 py-2 text-xs font-medium text-background shadow-2xl backdrop-blur-md border border-white/20 leading-snug min-w-[44px] flex items-center justify-center text-center">
        <span>{message}</span>
        {/* Speech Bubble Tail pointing down directly to Puffer in center */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-foreground/95 border-b border-r border-white/20" />
      </div>
    </motion.div>
  );
}
