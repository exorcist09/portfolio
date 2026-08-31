import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../portfolio/ThemeContext";
import { PufferScene } from "./PufferScene";
import { PufferMessage } from "./PufferMessage";
import { PufferAssistant } from "./PufferAssistant";
import type { BubbleTrigger } from "./PufferBubbles";
import type { FishAnimationState } from "./PufferFish";

export interface PufferProps {
  loading?: boolean;
  progress?: number;
  onClick?: () => void;
  onAssistantOpen?: () => void;
}

const SINGLE_CLICK_QUIPS = [
  "Are you trying to pet me?",
  "That's a lot of attention for a fish.",
  "You really like clicking me, huh?",
  "I noticed.",
  "Enjoying yourself?",
  "Was that necessary?",
  "Again?",
  "You clicked me. Bold choice.",
  "I felt that.",
  "You're curious, aren't you?",
  "I'm starting to feel important.",
  "You have my attention.",
  "I see what you're doing.",
  "You're making this awkward.",
  "Do I look clickable?",
  "I was just swimming here.",
  "You interrupted my swim.",
  "Just checking if I'm real?",
  "Yes, I'm still here.",
  "I'm not going anywhere.",
  "You seem very invested in this fish.",
  "I appreciate the attention. Probably.",
  "Okay, I get it. I'm cute.",
  "This is becoming a pattern.",
  "I know. I'm hard to resist.",
  "You could've just said hello.",
  "Is this your idea of networking?",
  "We could've talked instead.",
  "You know I can actually talk, right?",
  "That's one way to start a conversation.",
  "I'm beginning to question your priorities.",
  "You have discovered my greatest feature: being clickable.",
];

export function PufferCompanion({
  loading = false,
  progress = 0,
  onClick,
  onAssistantOpen,
}: PufferProps) {
  const { pufferEnabled, accent, mode } = useTheme();

  // Assistant & speech states
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [settledInCorner, setSettledInCorner] = useState(!loading && progress >= 100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bubbleTriggerRef = useRef<BubbleTrigger | null>(null);
  const prevAccent = useRef(accent);
  const prevMode = useRef(mode);
  const isFirstMount = useRef(true);
  const hasTriggered60Swim = useRef(false);
  const hasGreeted = useRef(false);

  // Personality throttling refs
  const lastFastScrollQuip = useRef(0);
  const lastColorChangeQuip = useRef(0);
  const singleClickIndex = useRef(0);
  const rapidClickCount = useRef(0);
  const rapidClickTimer = useRef<NodeJS.Timeout | null>(null);
  const triggeredMilestones = useRef<Record<string, boolean>>({});
  const hasTriggeredToolsDwell = useRef(false);
  const lastBlurTime = useRef<number | null>(null);

  // 1. Check prefers-reduced-motion & mobile
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

  // 2. Loading threshold 60%: start smooth swim to bottom-right corner
  useEffect(() => {
    if (progress >= 60 && !hasTriggered60Swim.current) {
      hasTriggered60Swim.current = true;
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 1150);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Handle final completion fallback
  useEffect(() => {
    if (!loading && !settledInCorner) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, settledInCorner]);

  // 3. Initial Introduction Speech: after settling in corner
  useEffect(() => {
    if (settledInCorner && !hasGreeted.current && pufferEnabled && !loading) {
      hasGreeted.current = true;
      const greetTimer = setTimeout(() => {
        setSpeech(
          "Hi there, human! I'm Puffer, the fish responsible for this place. Let's dive deep into the sea!",
        );
        bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.2, 0.9);
      }, 1200);

      return () => clearTimeout(greetTimer);
    }
  }, [settledInCorner, pufferEnabled, loading]);

  // 4. Accent Color change ("They changed the entire ocean. I refused.")
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevAccent.current = accent;
      prevMode.current = mode;
      return;
    }

    const now = Date.now();
    if (prevAccent.current !== accent && pufferEnabled) {
      prevAccent.current = accent;
      if (now - lastColorChangeQuip.current > 15000 && !isAssistantOpen) {
        lastColorChangeQuip.current = now;
        const oceanQuips = [
          "U See? I don't change colors. I'm loyal.",
          "They changed the entire ocean. I refused.",
        ];
        setSpeech(oceanQuips[Math.floor(Math.random() * oceanQuips.length)]);
        bubbleTriggerRef.current?.(0, 0, 0.8, 4, 0.2, 0.9);
      }
    }
  }, [accent, pufferEnabled, isAssistantOpen]);

  // 5. Theme Mode switch to light ("ahh, sun")
  useEffect(() => {
    if (isFirstMount.current) return;
    if (prevMode.current !== mode && pufferEnabled) {
      prevMode.current = mode;
      if (mode === "light" && !isAssistantOpen) {
        setSpeech("ahh, sun");
        bubbleTriggerRef.current?.(0, 0, 0.8, 4, 0.2, 0.9);
      }
    }
  }, [mode, pufferEnabled, isAssistantOpen]);

  // 6. Fast Manual Scroll detection (Triggered ONLY on user wheel/touch, NOT programmatic links)
  useEffect(() => {
    if (!pufferEnabled || isMobile) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let isUserScrolling = false;
    let userScrollResetTimer: NodeJS.Timeout | null = null;

    const markUserScroll = () => {
      isUserScrolling = true;
      if (userScrollResetTimer) clearTimeout(userScrollResetTimer);
      userScrollResetTimer = setTimeout(() => {
        isUserScrolling = false;
      }, 350);
    };

    window.addEventListener("wheel", markUserScroll, { passive: true });
    window.addEventListener("touchmove", markUserScroll, { passive: true });

    const handleScrollSpeed = () => {
      if (isAssistantOpen) return;
      const now = performance.now();
      const dt = (now - lastScrollTime) / 1000;
      const currentY = window.scrollY;

      if (dt > 0.05) {
        const speed = Math.abs(currentY - lastScrollY) / dt;

        // Trigger multiple times with a short 7s cooldown on fast manual scroll
        if (isUserScrolling && speed > 3400 && now - lastFastScrollQuip.current > 7000) {
          lastFastScrollQuip.current = now;
          const quips = ["Whoa. Slow down.", "Easy. I'm a fish, not a race car."];
          setSpeech(quips[Math.floor(Math.random() * quips.length)]);
          bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.25, 1.0);
        }

        lastScrollY = currentY;
        lastScrollTime = now;
      }
    };

    window.addEventListener("scroll", handleScrollSpeed, { passive: true });
    return () => {
      window.removeEventListener("wheel", markUserScroll);
      window.removeEventListener("touchmove", markUserScroll);
      window.removeEventListener("scroll", handleScrollSpeed);
      if (userScrollResetTimer) clearTimeout(userScrollResetTimer);
    };
  }, [pufferEnabled, isMobile, isAssistantOpen]);

  // 7. Tools section dwell detection ("Bro really knows all this? Apparently.")
  useEffect(() => {
    if (!pufferEnabled || loading) return;

    let dwellTimer: NodeJS.Timeout | null = null;

    const checkDwell = () => {
      if (hasTriggeredToolsDwell.current || isAssistantOpen) return;
      const el = document.getElementById("about");
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const inView = rect.top <= vh * 0.45 && rect.bottom >= vh * 0.35;
        if (inView) {
          if (!dwellTimer) {
            dwellTimer = setTimeout(() => {
              if (!hasTriggeredToolsDwell.current) {
                hasTriggeredToolsDwell.current = true;
                setSpeech("Bro really knows all this? Apparently.");
                bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.25, 0.9);
              }
            }, 5000);
          }
        } else if (dwellTimer) {
          clearTimeout(dwellTimer);
          dwellTimer = null;
        }
      }
    };

    window.addEventListener("scroll", checkDwell, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkDwell);
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [pufferEnabled, loading, isAssistantOpen]);

  // 8. Section scroll milestones (Projects & Freelance "⚔️"; Contact with few seconds delay)
  useEffect(() => {
    if (!pufferEnabled || loading) return;

    const instantMilestones: Record<string, string> = {
      projects: "Now we're getting somewhere.",
      services: "⚔️",
    };

    let contactDelayTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isAssistantOpen) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Instant milestone checks (Projects, Freelance/Services)
      for (const [id, message] of Object.entries(instantMilestones)) {
        if (triggeredMilestones.current[id]) continue;
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vh * 0.45 && rect.bottom >= vh * 0.2) {
            triggeredMilestones.current[id] = true;
            if (scrollY > 300) {
              setSpeech(message);
              bubbleTriggerRef.current?.(0, 0, 0.5, 2, 0.2, 0.85);
            }
          }
        }
      }

      // Contact / Get In Touch section (appears after a few seconds delay)
      const contactEl = document.getElementById("contact");
      if (contactEl && !triggeredMilestones.current["contact"]) {
        const rect = contactEl.getBoundingClientRect();
        const inContactView = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.2;
        if (inContactView) {
          if (!contactDelayTimer) {
            contactDelayTimer = setTimeout(() => {
              if (!triggeredMilestones.current["contact"] && !isAssistantOpen) {
                triggeredMilestones.current["contact"] = true;
                setSpeech("Finally. Someone wants to talk to him.");
                bubbleTriggerRef.current?.(0, 0, 0.5, 2, 0.2, 0.85);
              }
            }, 2600);
          }
        } else if (contactDelayTimer) {
          clearTimeout(contactDelayTimer);
          contactDelayTimer = null;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (contactDelayTimer) clearTimeout(contactDelayTimer);
    };
  }, [pufferEnabled, loading, isAssistantOpen]);

  // 9. Tab return / Resume modal / Talk to Puffer external events
  useEffect(() => {
    if (!pufferEnabled) return;

    const handleResumeOpen = () => {
      setSpeech("Ah yes. The official paperwork.");
      bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.25, 0.9);
    };

    const handleTalkCTA = () => {
      bubbleTriggerRef.current?.(0, 0, 0.7, 5, 0.35, 1.1);
      setTimeout(() => {
        setIsAssistantOpen(true);
        onAssistantOpen?.();
      }, 350);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        lastBlurTime.current = Date.now();
      } else if (
        lastBlurTime.current &&
        Date.now() - lastBlurTime.current > 20000 &&
        !isAssistantOpen
      ) {
        lastBlurTime.current = null;
        setSpeech("You're back.");
        bubbleTriggerRef.current?.(0, 0, 0.5, 2, 0.2, 0.85);
      }
    };

    window.addEventListener("open-resume-modal", handleResumeOpen);
    window.addEventListener("talk-with-puffer", handleTalkCTA);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("open-resume-modal", handleResumeOpen);
      window.removeEventListener("talk-with-puffer", handleTalkCTA);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pufferEnabled, isAssistantOpen, onAssistantOpen]);

  // 10. Single Click Handler: triggers quips / speech bubbles
  const handleSingleClick = useCallback(() => {
    onClick?.();

    rapidClickCount.current++;
    if (rapidClickTimer.current) clearTimeout(rapidClickTimer.current);
    rapidClickTimer.current = setTimeout(() => {
      rapidClickCount.current = 0;
    }, 2200);

    const quip = SINGLE_CLICK_QUIPS[singleClickIndex.current % SINGLE_CLICK_QUIPS.length];
    singleClickIndex.current++;
    setSpeech(quip);
    bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.2, 0.9);
  }, [onClick]);

  // 11. Double Click Handler: opens/toggles AI chat modal
  const handleDoubleClick = useCallback(() => {
    setIsAssistantOpen((prev) => !prev);
    onAssistantOpen?.();
  }, [onAssistantOpen]);

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
    isAssistantOpen,
    reducedMotion,
    isMobile,
  };

  const boxSize = isAssistantOpen ? (isMobile ? 150 : 170) : isMobile ? 190 : 230;

  return (
    <>
      {/* ── Conversational Assistant UI Panel (HTML Layer) ── */}
      <PufferAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      {/* ── Puffer 3D Companion Layer (Three.js Canvas Layer - Hidden on small screens) ── */}
      <div
        aria-label="Puffer fish mascot companion"
        role="region"
        className="pointer-events-none select-none hidden sm:block"
      >
        <motion.div
          initial={{
            top: "46vh",
            left: "50vw",
            x: "-50%",
            y: "-50%",
            width: boxSize,
            height: boxSize,
            zIndex: 150,
          }}
          animate={
            isCentered
              ? {
                  top: "46vh",
                  left: "50vw",
                  x: "-50%",
                  y: "-50%",
                  width: boxSize,
                  height: boxSize,
                  zIndex: 150,
                }
              : isAssistantOpen
                ? {
                    top: isMobile ? "calc(100vh - 75px)" : "calc(100vh - 85px)",
                    left: isMobile ? "calc(100vw - 75px)" : "calc(100vw - 85px)",
                    x: "-50%",
                    y: "-50%",
                    width: boxSize,
                    height: boxSize,
                    zIndex: 150,
                  }
                : {
                    top: isMobile ? "calc(100vh - 125px)" : "calc(100vh - 145px)",
                    left: isMobile ? "calc(100vw - 125px)" : "calc(100vw - 145px)",
                    x: "-50%",
                    y: "-50%",
                    width: boxSize,
                    height: boxSize,
                    zIndex: 150,
                  }
          }
          transition={{
            duration: isCentered || isTransitioning ? 1.15 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed pointer-events-none overflow-visible"
        >
          {/* Personality Speech Bubble (HTML Layer) */}
          <AnimatePresence>
            {speech && !isAssistantOpen && (
              <PufferMessage message={speech} onDismiss={() => setSpeech(null)} />
            )}
          </AnimatePresence>

          {/* Hover Hint below Puffer */}
          <AnimatePresence>
            {isHovered && !isAssistantOpen && !isMobile && settledInCorner && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tracking-wide text-white/50 select-none pointer-events-none drop-shadow-sm"
              >
                double click to talk
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive 3D Canvas Scene */}
          <div
            onPointerEnter={() => {
              if (!isMobile) {
                setIsHovered(true);
              }
            }}
            onPointerLeave={() => {
              if (!isMobile) setIsHovered(false);
            }}
            className="relative h-full w-full pointer-events-auto cursor-pointer overflow-visible"
          >
            <PufferScene
              animState={animState}
              onFishClick={handleSingleClick}
              onFishDoubleClick={handleDoubleClick}
              bubbleTriggerRef={bubbleTriggerRef}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

export { PufferCompanion as PufferFish, PufferCompanion as PufferFishScene };
export default PufferCompanion;
