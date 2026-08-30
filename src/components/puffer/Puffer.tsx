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
  const hasTriggered80Swim = useRef(false);

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

  // Loading 80% threshold: start swim to bottom-right corner with bubbles
  useEffect(() => {
    if (progress >= 80 && !hasTriggered80Swim.current) {
      hasTriggered80Swim.current = true;
      setIsTransitioning(true);

      // Swimming bubble trail burst
      bubbleTriggerRef.current?.(0, 0, 0.8, 12, 0.4, 1.4);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Handle final completion if progress didn't tick through 80% (e.g. reload)
  useEffect(() => {
    if (!loading && !settledInCorner) {
      setIsTransitioning(true);
      bubbleTriggerRef.current?.(0, 0, 0.8, 10, 0.35, 1.3);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 500);

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

  // Centered while loading and before 80% progress
  const isCentered = loading && progress < 80 && !hasTriggered80Swim.current;

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
        layout
        initial={
          isCentered
            ? {
                top: "38%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                bottom: "auto",
                right: "auto",
                width: isMobile ? 230 : 290,
                height: isMobile ? 230 : 290,
                zIndex: 102,
              }
            : false
        }
        animate={
          isCentered
            ? {
                top: "38%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                bottom: "auto",
                right: "auto",
                width: isMobile ? 230 : 290,
                height: isMobile ? 230 : 290,
                zIndex: 102,
              }
            : {
                top: "auto",
                left: "auto",
                x: "0%",
                y: "0%",
                bottom: isMobile ? 28 : 42,
                right: isMobile ? 28 : 48,
                width: isMobile ? 165 : 215,
                height: isMobile ? 165 : 215,
                zIndex: 40,
              }
        }
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
          mass: 0.7,
        }}
        className="fixed pointer-events-none"
      >
        {/* Personality Speech Bubble */}
        <AnimatePresence>
          {speech && (
            <SpeechBubble message={speech} onDismiss={() => setSpeech(null)} />
          )}
        </AnimatePresence>

        {/* Interactive 3D Canvas Scene with Grab to Spin */}
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
          className="relative h-full w-full pointer-events-auto cursor-pointer"
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