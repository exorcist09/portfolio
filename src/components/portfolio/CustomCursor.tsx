import { useEffect, useState, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const { cursorMode } = useTheme();

  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);
  const trailId = useRef(0);

  // Follower physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Hide default cursor conditionally
    if (!isMobile && cursorMode !== "normal" && cursorMode !== "trail") {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "auto";
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (cursorMode === "trail") {
        setTrail((prev) => {
          const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId.current++ }];
          if (newTrail.length > 20) newTrail.shift();
          return newTrail;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [cursorMode, cursorX, cursorY]);

  // Trail decay
  useEffect(() => {
    if (cursorMode !== "trail") return;
    const interval = setInterval(() => {
      setTrail((prev) => (prev.length > 0 ? prev.slice(1) : []));
    }, 50);
    return () => clearInterval(interval);
  }, [cursorMode]);

  if (cursorMode === "normal" || isMobile) return null;

  return (
    <>

      {/* Trail Mode: Windows 95 style mouse trails */}
      {cursorMode === "trail" && trail.map((pt, i) => (
        <div
          key={pt.id}
          className="pointer-events-none fixed z-[9999] h-4 w-4 rounded-full bg-primary/40 shadow-[0_0_10px_var(--primary)]"
          style={{
            left: pt.x - 8,
            top: pt.y - 8,
            opacity: (i + 1) / trail.length,
            transform: `scale(${(i + 1) / trail.length})`
          }}
        />
      ))}

      {/* Follower Mode */}
      {cursorMode === "follower" && (
        <motion.div
          className="pointer-events-none fixed z-[9999] h-8 w-8 rounded-full border-2 border-primary/50 bg-primary/10 shadow-[0_0_15px_var(--primary)]"
          style={{
            x: followerX,
            y: followerY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}

      {/* Invert Mode */}
      {cursorMode === "invert" && (
        <motion.div
          className="pointer-events-none fixed z-[9999] h-12 w-12 rounded-full bg-white mix-blend-difference"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}

      {/* Magnifying Mode */}
      {cursorMode === "magnifying" && (
        <motion.div
          className="pointer-events-none fixed z-[9999] flex items-center justify-center h-24 w-24 rounded-full border border-foreground/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            backdropFilter: "saturate(2) brightness(1.2)",
            WebkitBackdropFilter: "saturate(2) brightness(1.2)",
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
          }}
        >
          {/* Magnifier Stem and Handle */}
          <div className="absolute top-1/2 left-1/2 flex flex-col items-center justify-start origin-top" style={{ transform: "translate(-50%, 0) rotate(-45deg) translateY(44px)" }}>
            <div className="h-4 w-1.5 bg-white rounded-sm" />
            <div className="h-8 w-3.5 bg-foreground rounded-full shadow-sm mt-0.5" />
          </div>
        </motion.div>
      )}

      {/* Custom dot for modes that hide the main cursor */}
      {["follower", "invert", "magnifying"].includes(cursorMode) && (
        <motion.div
          className="pointer-events-none fixed z-[9999] h-1.5 w-1.5 rounded-full bg-primary"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}

    </>
  );
}
