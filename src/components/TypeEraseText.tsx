"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useInView } from "framer-motion";

export default function TypeEraseText({
  initialText = "@Adarsh",
  targetText = "@exorcist",
  eraseSpeed = 80,
  typeSpeed = 90,
  pauseDelay = 2000,
}: {
  initialText?: string;
  targetText?: string;
  eraseSpeed?: number;
  typeSpeed?: number;
  pauseDelay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-40px" });

  const words = useMemo(() => [initialText, targetText], [initialText, targetText]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(initialText);
  const [phase, setPhase] = useState<"pausing" | "erasing" | "typing">("pausing");

  useEffect(() => {
    if (!isInView) {
      setDisplayText(initialText);
      setWordIndex(0);
      setPhase("pausing");
      return;
    }

    let timeout: NodeJS.Timeout;
    const currentFullWord = words[wordIndex];
    const nextWordIndex = (wordIndex + 1) % words.length;
    const nextFullWord = words[nextWordIndex];

    if (phase === "pausing") {
      // Pause at full word so user can read it, then begin erasing
      timeout = setTimeout(() => {
        setPhase("erasing");
      }, pauseDelay);
    } else if (phase === "erasing") {
      // Keep '@' prefix if both words start with '@'
      const minLen = currentFullWord.startsWith("@") && nextFullWord.startsWith("@") ? 1 : 0;
      if (displayText.length > minLen) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, eraseSpeed);
      } else {
        // Paused at prefix, switch to next word and start typing
        timeout = setTimeout(() => {
          setWordIndex(nextWordIndex);
          setPhase("typing");
        }, 250);
      }
    } else if (phase === "typing") {
      const target = words[wordIndex];
      if (displayText.length < target.length) {
        timeout = setTimeout(() => {
          setDisplayText(target.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // Finished typing the word, pause before erasing again
        setPhase("pausing");
      }
    }

    return () => clearTimeout(timeout);
  }, [
    isInView,
    phase,
    displayText,
    wordIndex,
    words,
    initialText,
    eraseSpeed,
    typeSpeed,
    pauseDelay,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center justify-center font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white select-none"
    >
      <span>{displayText}</span>

      {/* Blinking Cursor in accent color */}
      <span className="ml-1 inline-block w-[3px] sm:w-[5px] h-[0.9em] bg-[var(--accent)] animate-pulse rounded-full align-middle" />
    </div>
  );
}
