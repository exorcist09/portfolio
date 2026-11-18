"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
}

export default function ResumeModal({
  isOpen,
  onClose,
  resumeUrl = "/AdarshVermaResume.pdf",
}: ResumeModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8 sm:pr-16 md:pr-20 select-none">
          {/* Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            aria-label="Close resume preview"
          />

          {/* Modal Container: border removed on mobile screen (border-0 sm:border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-4xl h-[90vh] sm:h-[86vh] rounded-2xl sm:rounded-3xl border-0 sm:border border-white/20 bg-[#0E0E10] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] p-2 sm:p-3 flex flex-col"
          >
            {/* Action Buttons: Cross on extreme right on mobile (order-3 sm:order-1) */}
            <div className="sm:absolute sm:top-0 sm:-right-13 md:-right-14 z-30 flex sm:flex-col items-center justify-end gap-2.5 mb-2 sm:mb-0">
              {/* 1. Close Button (Cross) - Extreme right on mobile (order-3), top on desktop (sm:order-1) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                title="Close (Esc)"
                className="order-3 sm:order-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18181B]/95 hover:bg-[#27272A] border border-white/20 text-[#EDEDEA] hover:text-white backdrop-blur-xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <X className="w-4 h-4 stroke-[2.2] group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* 2. Open in New Tab Button */}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in new tab"
                title="Open in new tab"
                className="order-2 sm:order-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18181B]/95 hover:bg-[#27272A] border border-white/20 text-[#EDEDEA] hover:text-white backdrop-blur-xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <ExternalLink className="w-4 h-4 stroke-[2] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* 3. Download Button - On the left on mobile (order-1), bottom on desktop (sm:order-3) */}
              <a
                href={resumeUrl}
                download="AdarshVermaResume.pdf"
                aria-label="Download resume"
                title="Download PDF"
                className="order-1 sm:order-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18181B]/95 hover:bg-[#27272A] border border-white/20 text-[#EDEDEA] hover:text-white backdrop-blur-xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <Download className="w-4 h-4 stroke-[2] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Embedded Resume Container */}
            <div className="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-inner border-0 sm:border border-black/20">
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0 rounded-xl sm:rounded-2xl bg-white"
                title="Adarsh Verma Resume"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
