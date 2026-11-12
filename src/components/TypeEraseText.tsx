"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function TypeEraseText({
  initialText = "@Adarsh",
  targetText = "@exorcist",
  eraseSpeed = 90,
  typeSpeed = 100,
  pauseDelay = 1200,
}: {
  initialText?: string;
  targetText?: string;
  eraseSpeed?: number;
  typeSpeed?: number;
  pauseDelay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-40px" });

  const [displayText, setDisplayText] = useState(initialText);
  const [phase, setPhase] = useState<"idle" | "erasing" | "typing" | "settled">("idle");

  useEffect(() => {
    if (!isInView) {
      setDisplayText(initialText);
      setPhase("idle");
      return;
    }

    let timeout: NodeJS.Timeout;

    if (phase === "idle") {
      // Wait for section to settle in view, then start erasing
      timeout = setTimeout(() => {
        setPhase("erasing");
      }, pauseDelay);
    } else if (phase === "erasing") {
      if (displayText.length > 1) {
        // Erase back to '@'
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, eraseSpeed);
      } else {
        // Paused at '@', begin typing target word
        timeout = setTimeout(() => {
          setPhase("typing");
        }, 300);
      }
    } else if (phase === "typing") {
      if (displayText.length < targetText.length) {
        timeout = setTimeout(() => {
          setDisplayText(targetText.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // Finished typing
        setPhase("settled");
      }
    }

    return () => clearTimeout(timeout);
  }, [isInView, phase, displayText, initialText, targetText, eraseSpeed, typeSpeed, pauseDelay]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center justify-center font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white select-none"
    >
      <span>{displayText}</span>

      {/* Blinking Cursor in dark orange */}
      <span className="ml-1 inline-block w-[3px] sm:w-[5px] h-[0.9em] bg-[#EA580C] animate-pulse rounded-full align-middle" />
    </div>
  );
}

