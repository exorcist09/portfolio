"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show intro animation once per session so navigating back does not reload/replay it
    const hasSeenIntro = sessionStorage.getItem("portfolio_intro_seen");
    if (hasSeenIntro) {
      onComplete?.();
      return;
    }

    setShow(true);

    // Fill completes at ~1.7s, exit at 2.1s
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("portfolio_intro_seen", "true");
      onComplete?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black select-none"
        >
          {/* Cursive Name - Big text with left-to-right fill inside text only */}
          <div className="relative inline-block select-none px-6 py-4">
            {/* Dim outline shape of text */}
            <span
              className="font-handwriting text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] text-white/15 select-none block leading-tight tracking-wide"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Adarsh
            </span>

            {/* Pure white text fill animating strictly within glyphs from left to right */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.7, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0 px-6 py-4 select-none"
            >
              <span
                className="font-handwriting text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] text-white select-none block leading-tight tracking-wide"
                style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
              >
                Adarsh
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
