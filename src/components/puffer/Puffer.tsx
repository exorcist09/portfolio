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
    "Enjoying yourself?",
    "I'm always watching your cursor... swim swim! 🐡",
    "Puff! Looking for something special?",
    "Adarsh's code is clean down here.",
    "Double click me if you want to chat.",
];

export function PufferCompanion({
    loading = false,
    progress = 0,
    onClick,
    onAssistantOpen,
}: PufferProps) {
    const { pufferEnabled, accent } = useTheme();

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
    const isFirstMount = useRef(true);
    const hasTriggered60Swim = useRef(false);
    const hasGreeted = useRef(false);

    // Personality throttling refs
    const lastFastCursorQuip = useRef(0);
    const singleClickIndex = useRef(0);
    const rapidClickCount = useRef(0);
    const rapidClickTimer = useRef<NodeJS.Timeout | null>(null);
    const triggeredMilestones = useRef<Record<string, boolean>>({});
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
                setSpeech("Hey, I'm Puffer. Ask me about Adarsh.");
                bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.2, 0.9);
            }, 1200);

            return () => clearTimeout(greetTimer);
        }
    }, [settledInCorner, pufferEnabled, loading]);

    // 4. Theme change personality reaction ("See? I don't change colors. I'm loyal.")
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

    // 5. Fast cursor movement detection (Throttled, 95% silent, 5% personality)
    useEffect(() => {
        if (!pufferEnabled || isMobile) return;

        let lastX = 0, lastY = 0, lastTime = performance.now();

        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();
            const dt = (now - lastTime) / 1000;
            if (dt > 0.05) {
                const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
                const speed = dist / dt; // pixels per second

                if (speed > 4200 && now - lastFastCursorQuip.current > 50000 && !isAssistantOpen) {
                    lastFastCursorQuip.current = now;
                    const quips = ["Whoa. Slow down.", "Easy. I'm a fish, not a race car."];
                    setSpeech(quips[Math.floor(Math.random() * quips.length)]);
                    bubbleTriggerRef.current?.(0, 0, 0.6, 3, 0.25, 1.0);
                }

                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = now;
            }
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [pufferEnabled, isMobile, isAssistantOpen]);

    // 6. Section scroll milestone personality quips
    useEffect(() => {
        if (!pufferEnabled || loading) return;

        const milestones: Record<string, string> = {
            projects: "Now we're getting somewhere.",
            experience: "Here's where the lore begins.",
            contact: "Finally. Someone wants to talk to him.",
        };

        const handleScroll = () => {
            if (isAssistantOpen) return;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            for (const [id, message] of Object.entries(milestones)) {
                if (triggeredMilestones.current[id]) continue;
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= vh * 0.45 && rect.bottom >= vh * 0.2) {
                        triggeredMilestones.current[id] = true;
                        if (scrollY > 400) {
                            setSpeech(message);
                            bubbleTriggerRef.current?.(0, 0, 0.5, 2, 0.2, 0.85);
                        }
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pufferEnabled, loading, isAssistantOpen]);

    // 7. Tab return / Resume modal / Talk to Puffer external events
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
            } else if (lastBlurTime.current && Date.now() - lastBlurTime.current > 20000 && !isAssistantOpen) {
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

    // 8. Single Click Handler: triggers quips / speech bubbles
    const handleSingleClick = useCallback(() => {
        onClick?.();

        rapidClickCount.current++;
        if (rapidClickTimer.current) clearTimeout(rapidClickTimer.current);
        rapidClickTimer.current = setTimeout(() => {
            rapidClickCount.current = 0;
        }, 2200);

        if (rapidClickCount.current === 2) {
            setSpeech("Enjoying yourself?");
        } else if (rapidClickCount.current === 3) {
            setSpeech("You really like clicking me, huh?");
        } else if (rapidClickCount.current >= 4) {
            setSpeech("I noticed.");
        } else {
            const quip = SINGLE_CLICK_QUIPS[singleClickIndex.current % SINGLE_CLICK_QUIPS.length];
            singleClickIndex.current++;
            setSpeech(quip);
        }
    }, [onClick]);

    // 9. Double Click Handler: opens/toggles AI chat modal
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

    const boxSize = isAssistantOpen
        ? (isMobile ? 150 : 170)
        : (isMobile ? 190 : 230);

    return (
        <>
            {/* ── Conversational Assistant UI Panel (HTML Layer) ── */}
            <PufferAssistant
                isOpen={isAssistantOpen}
                onClose={() => setIsAssistantOpen(false)}
            />

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
                            <PufferMessage
                                message={speech}
                                onDismiss={() => setSpeech(null)}
                            />
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