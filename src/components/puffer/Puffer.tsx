import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../portfolio/ThemeContext";
import { PufferScene } from "./PufferScene";
import type { BubbleTrigger } from "./PufferBubbles";
import type { FishAnimationState } from "./PufferFish";

/* =========================================================================
   SPEECH BUBBLE COMPONENT (Theme Loyalist Personality)
   ========================================================================= */
function SpeechBubble({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={onDismiss}
      className="absolute -top-16 right-2 sm:right-6 z-50 cursor-pointer pointer-events-auto select-none"
    >
      <div className="relative rounded-2xl bg-foreground/90 px-3.5 py-2 text-xs font-medium text-background shadow-xl backdrop-blur-md border border-white/20 whitespace-nowrap">
        <span>{message}</span>
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-foreground/90" />
      </div>
    </motion.div>
  );
}

/* =========================================================================
   PUFFER FISH COMPANION (TOP-LEVEL WRAPPER)
   ========================================================================= */
export interface PufferProps {
  loading?: boolean;
  progress?: number;
  onClick?: () => void;
  onAssistantOpen?: () => void;
}

export function PufferCompanion({
  loading = false,
  progress = 0,
  onClick,
  onAssistantOpen,
}: PufferProps) {
  const { pufferEnabled, accent } = useTheme();
  const [speech, setSpeech] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [settledInCorner, setSettledInCorner] = useState(!loading && progress >= 100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bubbleTriggerRef = useRef<BubbleTrigger | null>(null);
  const prevAccent = useRef(accent);
  const isFirstMount = useRef(true);
  const hasTriggered60Swim = useRef(false);

  // Check prefers-reduced-motion & mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaMotion.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaMotion.addEventListener("change", handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      mediaMotion.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Theme change personality reaction
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevAccent.current = accent;
      return;
    }

    if (prevAccent.current !== accent && pufferEnabled) {
      prevAccent.current = accent;
      setSpeech("See? I don't change colors. I'm loyal.");
      bubbleTriggerRef.current?.(0, 0, 0.8, 4, 0.2, 0.9);
    }
  }, [accent, pufferEnabled]);

  // Loading 60% threshold: start smooth swim to bottom-right corner
  useEffect(() => {
    if (progress >= 60 && !hasTriggered60Swim.current) {
      hasTriggered60Swim.current = true;
      setIsTransitioning(true);

      // Swimming bubble trail burst
      bubbleTriggerRef.current?.(0, 0, 0.8, 14, 0.45, 1.4);

      // 1.3s smooth transit to corner
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 1300);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Handle final completion if progress didn't tick through 60%
  useEffect(() => {
    if (!loading && !settledInCorner) {
      setIsTransitioning(true);
      bubbleTriggerRef.current?.(0, 0, 0.8, 10, 0.35, 1.3);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [loading, settledInCorner]);

  // Click / tap handler
  const handleFishClick = useCallback(() => {
    onClick?.();
    onAssistantOpen?.();
  }, [onClick, onAssistantOpen]);

  // Don't render or run Three.js loops if disabled in settings
  if (!pufferEnabled) {
    return null;
  }

  // Centered while loading and before 60% progress
  const isCentered = loading && progress < 60 && !hasTriggered60Swim.current;

  const animState: FishAnimationState = {
    isHovered,
    isSwimmingDown: isCentered,
    isTransitioningToCorner: isTransitioning,
    reducedMotion,
    isMobile,
  };

  return (
    <div
      aria-label="Puffer fish mascot companion"
      role="region"
      className="pointer-events-none select-none"
    >
      <motion.div
        initial={{
          top: "46vh",
          left: "50vw",
          x: "-50%",
          y: "-50%",
          width: isMobile ? 300 : 380,
          height: isMobile ? 300 : 380,
          zIndex: 150,
        }}
        animate={
          isCentered
            ? {
                top: "46vh",
                left: "50vw",
                x: "-50%",
                y: "-50%",
                width: isMobile ? 300 : 380,
                height: isMobile ? 300 : 380,
                zIndex: 150,
              }
            : {
                top: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 145px)",
                left: isMobile ? "calc(100vw - 120px)" : "calc(100vw - 150px)",
                x: "-50%",
                y: "-50%",
                width: isMobile ? 180 : 240,
                height: isMobile ? 180 : 240,
                zIndex: 150,
              }
        }
        transition={{
          type: "spring",
          stiffness: 38,
          damping: 14,
          mass: 1.15,
        }}
        className="fixed pointer-events-none overflow-visible"
      >
        {/* Personality Speech Bubble */}
        <AnimatePresence>
          {speech && (
            <SpeechBubble message={speech} onDismiss={() => setSpeech(null)} />
          )}
        </AnimatePresence>

        {/* Interactive 3D Canvas Scene with ample bounds */}
        <div
          onPointerEnter={() => {
            if (!isMobile) {
              setIsHovered(true);
              bubbleTriggerRef.current?.(0, 0, 0.8, 2, 0.15, 0.7);
            }
          }}
          onPointerLeave={() => {
            if (!isMobile) setIsHovered(false);
          }}
          className="relative h-full w-full pointer-events-auto cursor-pointer overflow-visible"
          title="Click to puff!"
        >
          <PufferScene
            animState={animState}
            onFishClick={handleFishClick}
            bubbleTriggerRef={bubbleTriggerRef}
          />
        </div>
      </motion.div>
    </div>
  );
}

export { PufferCompanion as PufferFish, PufferCompanion as PufferFishScene };
export default PufferCompanion;