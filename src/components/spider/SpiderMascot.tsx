"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpiderCharacter from "./SpiderCharacter";
import SpiderThread from "./SpiderThread";
import SpiderAssistant from "./SpiderAssistant";
import { getSpidyClickQuote } from "./SpiderQuotes";
import {
  SpiderState,
  calculateLegRotations,
  calculateEyeTracking,
} from "./SpiderAnimations";

interface SpiderMascotProps {
  isReady?: boolean;
}

export default function SpiderMascot({ isReady = true }: SpiderMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation and interaction states
  const [phase, setPhase] = useState<SpiderState>("spawning");
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookDir, setLookDir] = useState<{ lookX: number; lookY: number }>({
    lookX: 0,
    lookY: 0,
  });
  const [legRotations, setLegRotations] = useState(() =>
    calculateLegRotations("idle", 0)
  );

  // Dynamic viewport tracking for drop & silk thread
  const [mascotPos, setMascotPos] = useState<{
    x: number;
    y: number;
    rotation: number;
    threadTopX: number;
    threadTopY: number;
    swing: number;
    opacity: number;
    isSettled: boolean;
  }>({
    x: 0,
    y: -120,
    rotation: 0,
    threadTopX: 0,
    threadTopY: 0,
    swing: 0,
    opacity: 0,
    isSettled: false,
  });

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCursorNear, setIsCursorNear] = useState(false);

  // Initial drop speech bubble state
  const [showIntroBubble, setShowIntroBubble] = useState(false);
  const [typedGreeting, setTypedGreeting] = useState("");

  // Click dialogue interaction state
  const [showClickBubble, setShowClickBubble] = useState(false);
  const [typedQuote, setTypedQuote] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);
  const [rapidStreak, setRapidStreak] = useState(0);
  const lastClickTimeRef = useRef<number>(0);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Climbing state when assistant is open
  const [climbingOffset, setClimbingOffset] = useState({ x: 0, y: 0, rotation: 0 });

  // Inactivity tracking
  const lastActivityRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasTriggeredEntrance = useRef(false);

  // 1. Initial Website Entrance Animation:
  // Drops from top-right -> Hangs at mid-height -> Types "I haunt this portfolio." -> Descends to corner & sits firmly!
  useEffect(() => {
    if (typeof window === "undefined" || !isReady || hasTriggeredEntrance.current) {
      return;
    }
    hasTriggeredEntrance.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cornerX = window.innerWidth - 72;
    const cornerY = window.innerHeight - 92;
    const dropX = cornerX;
    const midY = window.innerHeight * 0.45;

    if (prefersReducedMotion) {
      setPhase("idle");
      setMascotPos({
        x: cornerX,
        y: cornerY,
        rotation: 0,
        threadTopX: cornerX,
        threadTopY: 0,
        swing: 0,
        opacity: 0.15,
        isSettled: true,
      });
      return;
    }

    let stage = 0;
    let stageStart = performance.now();
    setPhase("descending");

    const fullGreeting = "I haunt this portfolio.";

    const animateSequence = (now: number) => {
      const elapsed = now - stageStart;

      if (stage === 0) {
        const duration = 1200;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentY = -100 + (midY + 100) * ease;
        const swing = Math.sin(progress * Math.PI * 3) * (1 - progress) * 16;

        setMascotPos({
          x: dropX + swing,
          y: currentY,
          rotation: swing * 1.1,
          threadTopX: dropX,
          threadTopY: 0,
          swing,
          opacity: 0.85,
          isSettled: false,
        });

        if (progress < 1) {
          requestAnimationFrame(animateSequence);
        } else {
          stage = 1;
          stageStart = performance.now();
          setPhase("swinging");
          setShowIntroBubble(true);

          let charIdx = 0;
          const typingTimer = setInterval(() => {
            charIdx += 2;
            setTypedGreeting(fullGreeting.slice(0, charIdx));
            if (charIdx >= fullGreeting.length) {
              clearInterval(typingTimer);
            }
          }, 35);

          requestAnimationFrame(animateSequence);
        }
      } else if (stage === 1) {
        const duration = 2500;
        const progress = Math.min(elapsed / duration, 1);
        const t = elapsed / 1000;
        const swing = Math.sin(t * 4) * 8;

        setMascotPos({
          x: dropX + swing,
          y: midY + Math.sin(t * 3) * 3,
          rotation: swing * 1.1,
          threadTopX: dropX,
          threadTopY: 0,
          swing,
          opacity: 0.8,
          isSettled: false,
        });

        if (progress < 1) {
          requestAnimationFrame(animateSequence);
        } else {
          setShowIntroBubble(false);
          stage = 2;
          stageStart = performance.now();
          setPhase("descending");
          requestAnimationFrame(animateSequence);
        }
      } else if (stage === 2) {
        const duration = 1000;
        const progress = Math.min(elapsed / duration, 1);
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentY = midY + (cornerY - midY) * ease;
        const swing = Math.sin(progress * Math.PI * 2) * (1 - progress) * 14;

        setMascotPos({
          x: dropX + swing * 0.4,
          y: currentY,
          rotation: swing * 0.7,
          threadTopX: dropX,
          threadTopY: 0,
          swing,
          opacity: 0.75 - progress * 0.55,
          isSettled: false,
        });

        if (progress < 1) {
          requestAnimationFrame(animateSequence);
        } else {
          stage = 3;
          setPhase("landing");
          setMascotPos({
            x: cornerX,
            y: cornerY,
            rotation: 0,
            threadTopX: cornerX,
            threadTopY: 0,
            swing: 0,
            opacity: 0.2,
            isSettled: true,
          });

          setTimeout(() => {
            setPhase("idle");
          }, 350);
        }
      }
    };

    const frameId = requestAnimationFrame(animateSequence);
    return () => cancelAnimationFrame(frameId);
  }, [isReady]);

  // 2. Vertical Climbing Animation when Assistant Opens:
  // - Chatbox is at sm:right-8.
  // - Spidy is small (size 56) and climbs along the right border at x: 12.
  // - Head on TOP looking up towards destination.
  // - Mid-way slip: straight vertical drop down (0deg rotation).
  // - Sits on top of chatbox: x: -18, y: -605.
  // - Closed while on top: tumbles with 720deg mid-air spin.
  // - Closed while in middle: normal straight drop (0deg rotation).
  useEffect(() => {
    if (!mascotPos.isSettled) return;

    let timeoutIds: NodeJS.Timeout[] = [];

    if (isAssistantOpen) {
      setShowClickBubble(false);
      setPhase("climbing");
      // x: 6 places Spidy directly over the chatbox right border in full view!
      setClimbingOffset({ x: 6, y: 0, rotation: 0 });

      const s = 460;
      const lift = 38;

      // ── Attempt 1: Step-by-step climb along chatbox right border ──
      for (let i = 1; i <= 7; i++) {
        timeoutIds.push(
          setTimeout(() => {
            setClimbingOffset({
              x: 6,
              y: -i * lift,
              rotation: 0,
            });
          }, i * s)
        );
      }

      // Middle slip: normal straight drop (NO ROTATION!)
      timeoutIds.push(
        setTimeout(() => {
          setPhase("falling");
          setClimbingOffset({ x: 6, y: 0, rotation: 0 });
        }, 8 * s)
      );

      // Hits bottom floor: squash landing
      timeoutIds.push(
        setTimeout(() => {
          setPhase("landing");
          setClimbingOffset({ x: 6, y: 0, rotation: 0 });
        }, 8 * s + 340)
      );

      // ── Attempt 2: Climbs up from scratch all the way to top ──
      const a2 = 8 * s + 800;

      timeoutIds.push(
        setTimeout(() => {
          setPhase("climbing");
        }, a2)
      );

      const totalSteps = 15;
      for (let i = 1; i <= totalSteps; i++) {
        timeoutIds.push(
          setTimeout(() => {
            setClimbingOffset({
              x: 6,
              y: -i * lift,
              rotation: 0,
            });
          }, a2 + i * s)
        );
      }

      // Reached top! Sits comfortably on TOP of chatbox border
      timeoutIds.push(
        setTimeout(() => {
          setPhase("idle");
          setClimbingOffset({ x: -24, y: -605, rotation: 0 });
        }, a2 + (totalSteps + 1) * s)
      );
    } else {
      // Chatbox closed:
      // Tumble with 720deg rotation ONLY if Spidy was on top!
      // If closed in the middle, straight drop down (0deg)!
      if (climbingOffset.y < -20) {
        const fellFromTop = climbingOffset.y <= -500;
        setPhase("falling");
        setClimbingOffset({
          x: 0,
          y: 0,
          rotation: fellFromTop ? 720 : 0,
        });

        const fallDuration = fellFromTop ? 560 : 340;

        timeoutIds.push(
          setTimeout(() => {
            setPhase("landing");
            setClimbingOffset({ x: 0, y: 0, rotation: 0 });
          }, fallDuration)
        );

        timeoutIds.push(
          setTimeout(() => {
            setPhase("idle");
          }, fallDuration + 320)
        );
      }
    }

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [isAssistantOpen, mascotPos.isSettled]);

  // 3. Eye Tracking & Mouse Movement Activity:
  // - Proximity detection: shows "double click to chat" only when cursor is near Spidy!
  // - Wake up from sleeping state on cursor activity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastActivityRef.current = Date.now();

      // Wake up from sleep when user moves mouse
      if (phase === "sleeping") {
        setPhase("idle");
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const tracking = calculateEyeTracking(rect, e.clientX, e.clientY);
        setLookDir(tracking);

        // Proximity detection: cursor within 140px of Spidy
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        setIsCursorNear(dist < 140);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [phase]);

  // 4. Untouched Inactivity Check -> Sleep State:
  // After 15 seconds untouched, Spidy goes to sleep!
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (phase !== "sleeping" && !isBlinking) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 160);
      }
    }, 4000 + Math.random() * 2500);

    const inactivityInterval = setInterval(() => {
      const inactiveMs = Date.now() - lastActivityRef.current;
      // Untouched for 15s: go to sleep!
      if (inactiveMs > 15000 && phase === "idle" && !isAssistantOpen) {
        setPhase("sleeping");
      }
    }, 2000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(inactivityInterval);
    };
  }, [phase, isBlinking, isAssistantOpen]);

  // 5. Procedural Leg Kinematics Loop
  useEffect(() => {
    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (document.visibilityState === "visible") {
        const time = now - startTimeRef.current;
        const rotations = calculateLegRotations(phase, time);
        setLegRotations(rotations);
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [phase]);

  // 6. Hover Interaction: On hover it does nothing
  const handleMouseEnter = () => {
    lastActivityRef.current = Date.now();
    setIsCursorNear(true);
  };

  const handleMouseLeave = () => {
    setIsCursorNear(false);
  };

  // 7. Double Click vs Single Click Interaction:
  // - Double click: Opens AI chat assistant immediately!
  // - Single click: Plays funny dialogue in small bubble very close to Spidy!
  const handleDoubleClick = () => {
    lastActivityRef.current = Date.now();
    if (clickDebounceTimerRef.current) {
      clearTimeout(clickDebounceTimerRef.current);
      clickDebounceTimerRef.current = null;
    }
    setShowClickBubble(false);
    setIsAssistantOpen(true);
  };

  const triggerSingleClickDialogue = () => {
    const now = Date.now();
    const isRapid = now - lastClickTimeRef.current < 3200;
    const newStreak = isRapid ? rapidStreak + 1 : 1;
    const newTotal = totalClicks + 1;

    lastClickTimeRef.current = now;
    setRapidStreak(newStreak);
    setTotalClicks(newTotal);

    // Cute greeting bounce
    setPhase("greeting");
    setTimeout(() => {
      if (!isAssistantOpen && phase !== "sleeping") setPhase("idle");
    }, 420);

    const quote = getSpidyClickQuote(newTotal, newStreak);
    setShowClickBubble(true);
    setTypedQuote("");

    let charIdx = 0;
    const typingTimer = setInterval(() => {
      charIdx += 2;
      setTypedQuote(quote.slice(0, charIdx));
      if (charIdx >= quote.length) {
        clearInterval(typingTimer);
      }
    }, 26);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowClickBubble(false);
    }, 4200);
  };

  const handleClick = () => {
    lastActivityRef.current = Date.now();

    if (isAssistantOpen) {
      setIsAssistantOpen(false);
      return;
    }

    if (clickDebounceTimerRef.current) {
      clearTimeout(clickDebounceTimerRef.current);
      clickDebounceTimerRef.current = null;
      handleDoubleClick();
      return;
    }

    clickDebounceTimerRef.current = setTimeout(() => {
      clickDebounceTimerRef.current = null;
      triggerSingleClickDialogue();
    }, 250);
  };

  return (
    <>
      {/* Silk Thread Hanging from Top of Viewport to Spidy (z-[95] strictly above TopBar) */}
      <SpiderThread
        topAnchorX={mascotPos.threadTopX}
        topAnchorY={mascotPos.threadTopY}
        spiderX={mascotPos.x}
        spiderY={mascotPos.y + 6}
        swingOffset={mascotPos.swing}
        opacity={mascotPos.opacity}
        visible={!mascotPos.isSettled || mascotPos.opacity > 0.05}
      />

      {/* Initial Entrance Greeting Bubble: Glass style on TOP-LEFT of Spidy */}
      <AnimatePresence>
        {showIntroBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[125] pointer-events-none px-3.5 py-1.5 rounded-[18px] bg-[#161a18]/90 backdrop-blur-md border border-white/15 text-[#EDEDEA] shadow-xl shadow-black/80 flex items-center text-[13px] font-sans tracking-tight whitespace-nowrap"
            style={{
              right: `${typeof window !== "undefined"
                ? Math.max(16, window.innerWidth - mascotPos.x + 36)
                : 104
                }px`,
              top: `${mascotPos.y - 34}px`,
            }}
          >
            <span>{typedGreeting}</span>
            <span className="inline-block font-light ml-0.5 animate-pulse select-none text-[var(--accent)]">
              |
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot Container (z-[120] strictly above chatbox at z-[90] and TopBar at z-50) */}
      <div
        ref={containerRef}
        className={`fixed z-[120] select-none flex flex-col items-center justify-center ${mascotPos.isSettled
          ? "bottom-7 right-5 sm:bottom-9 sm:right-7 pointer-events-none"
          : "pointer-events-none"
          }`}
        style={
          mascotPos.isSettled
            ? undefined
            : {
              left: `${mascotPos.x - 42}px`,
              top: `${mascotPos.y - 14}px`,
              transform: `rotate(${mascotPos.rotation}deg)`,
              transformOrigin: "center 8px",
            }
        }
      >
        {/* Click Dialogue Speech Bubble: Small size, very close to Spidy, no ask spidy button */}
        <AnimatePresence>
          {showClickBubble && !isAssistantOpen && (
            <motion.div
              initial={{ opacity: 0, x: 6, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 4, scale: 0.92 }}
              transition={{ duration: 0.14 }}
              className="absolute right-[62px] -top-3 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-[14px] bg-[#14161b]/95 backdrop-blur-md border border-white/15 text-[#EDEDEA] text-[11px] font-sans tracking-tight shadow-xl shadow-black/90 flex items-center z-[125]"
            >
              <span>{typedQuote}</span>
              <span className="inline-block font-light ml-0.5 animate-pulse select-none text-[var(--accent)]">
                |
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Sleepy Indicator (zZz) when Untouched */}
        <AnimatePresence>
          {phase === "sleeping" && (
            <motion.div
              key="sleeping-zzz"
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{
                opacity: [0, 0.95, 0],
                y: -24,
                x: [0, 6, 12],
                scale: [0.7, 1, 0.8],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute -top-5 right-2 text-[11.5px] font-mono-custom font-bold text-[#8A8A85] pointer-events-none select-none"
            >
              zZz
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Spidy Mascot Button */}
        <button
          type="button"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative pointer-events-auto cursor-pointer p-1 rounded-2xl transition-transform duration-200 active:scale-95 focus:outline-none"
          aria-label={
            isAssistantOpen
              ? "Close Spidy assistant"
              : "Interact with Spidy"
          }
          title={isAssistantOpen ? "Close Spidy" : "Double-click to chat, click to talk"}
        >
          {/* Animated Transform for Climbing, Falling, Landing, or Sitting */}
          <motion.div
            animate={{
              x:
                mascotPos.isSettled && isAssistantOpen
                  ? climbingOffset.x
                  : 0,
              y:
                mascotPos.isSettled && isAssistantOpen
                  ? climbingOffset.y
                  : phase === "greeting"
                    ? -10
                    : phase === "landing"
                      ? [0, 4, 0]
                      : 0,
              rotate:
                mascotPos.isSettled && isAssistantOpen
                  ? climbingOffset.rotation
                  : 0,
            }}
            transition={{
              x: {
                duration: phase === "falling" ? 0.55 : 0.2,
                ease: "easeOut",
              },
              y: {
                duration:
                  phase === "falling"
                    ? 0.55
                    : phase === "climbing"
                      ? 0.22
                      : phase === "landing"
                        ? 0.2
                        : 0.22,
                ease:
                  phase === "falling"
                    ? [0.55, 0, 1, 0.45]
                    : phase === "climbing"
                      ? [0.4, 0, 0.2, 1]
                      : "easeOut",
              },
              rotate: {
                duration: phase === "falling" ? 0.55 : 0.2,
                ease: phase === "falling" ? "easeIn" : "easeOut",
              },
            }}
          >
            <SpiderCharacter
              state={phase}
              lookX={lookDir.lookX}
              lookY={lookDir.lookY}
              isBlinking={isBlinking}
              legRotations={legRotations}
              // Spider is small when climbing (size 56), normal cute (size 84) when sitting!
              size={phase === "climbing" ? 56 : 84}
            />
          </motion.div>
        </button>

        {/* Subtitle Label: Only visible when cursor is near it, and without any border etc (in font-handwriting like +more) */}
        <AnimatePresence>
          {isCursorNear && !isAssistantOpen && mascotPos.isSettled && (
            <motion.button
              type="button"
              onClick={handleDoubleClick}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 pointer-events-auto font-handwriting text-base sm:text-lg text-[#8A8A85] hover:text-[var(--accent)] tracking-wide transition-colors cursor-pointer select-none whitespace-nowrap"
              title="Double click Spidy to open AI assistant"
            >
              double click to chat
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Spidy Assistant Modal Card (z-[100] strictly on top) */}
      <SpiderAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </>
  );
}
