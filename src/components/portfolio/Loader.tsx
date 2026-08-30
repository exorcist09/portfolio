import { useEffect, useState } from "react";

export function Loader({
  onDone,
  onProgress,
}: {
  onDone: () => void;
  onProgress?: (progress: number) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const n = p + 2;
        const clamped = Math.min(n, 100);
        onProgress?.(clamped);
        if (n >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("reveal"), 200);
          setTimeout(() => {
            setPhase("done");
            onDone();
          }, 800);
          return 100;
        }
        return n;
      });
    }, 28);
    return () => clearInterval(id);
  }, [phase, onDone, onProgress]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity duration-700 ease-out ${
        phase === "reveal" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden
    >
      <style>{`
        @keyframes waveFront {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveBack {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* ── Top-Center "adarsh." Branding with Green Accent Dot ── */}
      <div className="absolute top-8 sm:top-12 inset-x-0 z-30 pointer-events-none flex justify-center">
        <h1 className="font-hero text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] select-none">
          adarsh<span className="text-[#22c55e]">.</span>
        </h1>
      </div>

      {/* ── Rising Water with Prominent Dynamic Fluid Waves ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 overflow-visible transition-[height] duration-150 ease-out pointer-events-none"
        style={{ height: `${Math.max(progress, 5)}%` }}
      >
        {/* Secondary Back Wave (Slower, deep cyan) */}
        <div
          className="absolute inset-x-0 -top-8 h-12 w-[200%] pointer-events-none opacity-50"
          style={{ animation: "waveBack 6s linear infinite" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C240,95 480,5 720,48 C960,90 1200,10 1440,32 L1440,120 L0,120 Z"
              fill="#0284c7"
            />
          </svg>
        </div>

        {/* Primary Front Wave (Faster, bright caustic sky-blue crest) */}
        <div
          className="absolute inset-x-0 -top-7 h-11 w-[200%] pointer-events-none opacity-95"
          style={{ animation: "waveFront 3.8s linear infinite" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,45 C200,5 440,85 720,38 C1000,-5 1240,75 1440,45 L1440,120 L0,120 Z"
              fill="rgba(56, 189, 248, 0.92)"
            />
          </svg>
        </div>

        {/* Deep Water Gradient Body */}
        <div className="h-full w-full bg-gradient-to-t from-[#0284c7]/90 via-[#0ea5e9]/65 to-[#38bdf8]/40 backdrop-blur-[1px] shadow-[inset_0_16px_50px_rgba(56,189,248,0.5)]" />

        {/* Continuous Rising Ambient Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-4 left-[15%] h-3.5 w-3.5 rounded-full bg-white/50 animate-ping" />
          <div className="absolute bottom-10 left-[82%] h-4.5 w-4.5 rounded-full bg-white/40 animate-pulse" />
          <div className="absolute bottom-16 left-[46%] h-3 w-3 rounded-full bg-white/60 animate-bounce" />
          <div className="absolute bottom-28 left-[28%] h-4 w-4 rounded-full bg-white/45 animate-pulse" />
          <div className="absolute bottom-36 left-[68%] h-3.5 w-3.5 rounded-full bg-white/50 animate-ping" />
          <div className="absolute bottom-48 left-[50%] h-2.5 w-2.5 rounded-full bg-white/60 animate-bounce" />
          <div className="absolute bottom-60 left-[35%] h-4 w-4 rounded-full bg-white/40 animate-pulse" />
          <div className="absolute bottom-72 left-[75%] h-3 w-3 rounded-full bg-white/50 animate-ping" />
        </div>
      </div>
    </div>
  );
}
