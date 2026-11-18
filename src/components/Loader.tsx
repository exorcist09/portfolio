"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Module-level state: resets to false on full page load/reload,
// but stays true during client-side router navigation (returning from /work, /skills, /work-together)
let hasLoadedInSession = false;

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  // Start with true on initial load/reload so the black backdrop renders immediately (no FOUC/flash)
  const [show, setShow] = useState(!hasLoadedInSession);
  const [fontReady, setFontReady] = useState(false);

  // Mark document during loading so fixed overlays like orb are strictly hidden
  useEffect(() => {
    if (show) {
      document.documentElement.setAttribute("data-site-loading", "true");
    } else {
      document.documentElement.removeAttribute("data-site-loading");
    }
    return () => {
      document.documentElement.removeAttribute("data-site-loading");
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      onComplete?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("portfolio:loader-complete"));
      }
      return;
    }

    // Wait for the cursive font (Caveat) to load so the text doesn't pop or shift layout
    let mounted = true;
    const fontFallbackTimer = setTimeout(() => {
      if (mounted) setFontReady(true);
    }, 250);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (mounted) setFontReady(true);
      });
    } else {
      setFontReady(true);
    }

    return () => {
      mounted = false;
      clearTimeout(fontFallbackTimer);
    };
  }, [show, onComplete]);

  useEffect(() => {
    if (!show || !fontReady) return;

    // Fill animation runs for 1.7s, total delay before fade-out is 2.1s
    const timer = setTimeout(() => {
      setShow(false);
      hasLoadedInSession = true;
      onComplete?.();
      if (typeof window !== "undefined") {
        (window as unknown as { __portfolio_loaded?: boolean }).__portfolio_loaded = true;
        window.dispatchEvent(new CustomEvent("portfolio:loader-complete"));
      }
    }, 2100);

    return () => clearTimeout(timer);
  }, [show, fontReady, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none pointer-events-auto"
        >
          {/* Cursive Name - Big text with left-to-right fill inside text only */}
          <div className="relative inline-block select-none px-6 py-4">
            {/* Dim outline shape of cursive text */}
            <span
              className="font-handwriting text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] text-white/15 select-none block leading-tight tracking-wide"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Adarsh
            </span>

            {/* Pure white text fill animating strictly within glyphs from left to right */}
            {fontReady && (
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-0 px-6 py-4 select-none"
              >
                <span
                  className="font-handwriting text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] text-white select-none block leading-tight tracking-wide"
                  style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
                >
                  Adarsh
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
