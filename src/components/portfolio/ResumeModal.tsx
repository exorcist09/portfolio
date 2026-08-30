import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pl-4 pr-16 sm:p-8 sm:pr-20 md:p-12 md:pr-24 overflow-hidden">
          {/* Transparent / Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container + Attached Right-Side Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="glass relative z-10 w-full max-w-5xl h-[88vh] rounded-3xl border border-white/20 bg-background/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-2xl flex flex-col p-1.5 sm:p-2"
          >
            {/* Action Buttons Stack (Transparent Glass Effect, Right side of modal) */}
            <div className="absolute top-0 -right-12 sm:-right-14 z-30 flex flex-col gap-2.5 sm:gap-3 pointer-events-auto">
              {/* 1. Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                title="Close"
                className="glass grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-background/60 text-foreground border border-white/25 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:bg-background/90 hover:border-primary/60 hover:text-primary hover:scale-110 active:scale-95 cursor-pointer group"
              >
                <X className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:rotate-90" />
              </button>

              {/* 2. Open in New Tab Button */}
              <a
                href="/AdarshVermaResume.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label="Open in new tab"
                title="Open in new tab"
                className="glass grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-background/60 text-foreground border border-white/25 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:bg-background/90 hover:border-primary/60 hover:text-primary hover:scale-110 active:scale-95 cursor-pointer group"
              >
                <ExternalLink className="h-4 w-4 stroke-[2] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              {/* 3. Download Button */}
              <a
                href="/AdarshVermaResume.pdf"
                download="AdarshVermaResume.pdf"
                aria-label="Download resume"
                title="Download Resume"
                className="glass grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-background/60 text-foreground border border-white/25 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:bg-background/90 hover:border-primary/60 hover:text-primary hover:scale-110 active:scale-95 cursor-pointer group"
              >
                <Download className="h-4 w-4 stroke-[2] transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* Embedded Resume View with Glass Inner Frame */}
            <div className="w-full h-full relative rounded-2xl overflow-hidden bg-neutral-950/80 border border-white/10 shadow-inner">
              <iframe
                src="/AdarshVermaResume.pdf#toolbar=0"
                className="w-full h-full border-0 rounded-2xl bg-neutral-900/90"
                title="Adarsh Verma Resume"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
