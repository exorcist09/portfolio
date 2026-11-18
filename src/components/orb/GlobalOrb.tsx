"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OrbCanvas from "./OrbCanvas";
import OrbAssistant from "./OrbAssistant";

const VALID_PAGES = ["/", "/work", "/skills", "/work-together"];

export default function GlobalOrb() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(0);

  // Site loaded state: strictly false initially on "/" until loader completes
  const [isSiteLoaded, setIsSiteLoaded] = useState(() => {
    if (typeof window === "undefined") return false;
    if (pathname !== "/") return true;
    return !!(window as unknown as { __portfolio_loaded?: boolean }).__portfolio_loaded;
  });

  // Strict listener for loader completion - orb is NEVER visible during the loader screen
  useEffect(() => {
    if (pathname !== "/") {
      setIsSiteLoaded(true);
      return;
    }

    if (typeof window !== "undefined" && (window as unknown as { __portfolio_loaded?: boolean }).__portfolio_loaded) {
      setIsSiteLoaded(true);
      return;
    }

    const handleLoaded = () => {
      setIsSiteLoaded(true);
      if (typeof window !== "undefined") {
        (window as unknown as { __portfolio_loaded?: boolean }).__portfolio_loaded = true;
      }
    };

    window.addEventListener("portfolio:loader-complete", handleLoaded);

    return () => {
      window.removeEventListener("portfolio:loader-complete", handleLoaded);
    };
  }, [pathname]);

  // Double click instantly toggles the chatbox
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAssistantOpen((prev) => !prev);
  };

  // Single click: subtle spin / pulse boost only, NO text bubble
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPulseTrigger((prev) => prev + 1);
  };

  // Only render on valid website screens, once loader is complete
  const isValidPage = VALID_PAGES.includes(pathname);
  if (!isValidPage || !isSiteLoaded) {
    return null;
  }

  return (
    <>
      {/* AI Assistant Modal Window (Opens upwards directly above the Orb) */}
      <OrbAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Main Orb Container:
          1. hidden on small screens (< sm), desktop only (sm:block) as requested
          2. Fixed at bottom right with rock-solid coordinates so hover never moves the orb
          3. data-orb-container attribute for CSS loader suppression
      */}
      <div
        data-orb-container
        className="hidden sm:block fixed z-[120] bottom-8 right-6 sm:bottom-9 sm:right-7 select-none"
        aria-label="Interactive Three.js Plasma Orb"
      >
        <div className="relative">
          {/* Interactive Orb Canvas Button: Fixed 76x76 geometry, never shifts */}
          <button
            type="button"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative pointer-events-auto cursor-pointer p-0 bg-transparent border-0 rounded-full focus:outline-none block active:scale-95 transition-transform duration-150"
            aria-label={isAssistantOpen ? "Close Assistant" : "Interact with Orb"}
            title="Click to spin, double-click to chat"
          >
            {/* Three.js + Custom GLSL Raymarched Plasma Orb (100% pure code, zero images) */}
            <OrbCanvas
              size={76}
              isHovered={isHovered}
              pulseTrigger={pulseTrigger}
            />
          </button>

          {/* Cursive Handwriting Label: Absolutely positioned directly below the orb
              so the orb maintains its exact fixed position without jumping upward on hover */}
          <AnimatePresence>
            {isHovered && !isAssistantOpen && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 font-handwriting text-base sm:text-lg text-[#8A8A85] tracking-wide select-none whitespace-nowrap pointer-events-none"
              >
                double click to talk
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
