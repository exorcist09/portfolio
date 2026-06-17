import { useEffect, useState } from "react";

const emojis = ["😐", "🙂", "😊", "😄", "😁"];

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const n = p + 2;
        if (n >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("reveal"), 250);
          setTimeout(() => { setPhase("done"); onDone(); }, 1500);
          return 100;
        }
        return n;
      });
    }, 30);
    return () => clearInterval(id);
  }, [phase, onDone]);

  if (phase === "done") return null;

  const emojiIdx = Math.min(emojis.length - 1, Math.floor((progress / 100) * emojis.length));
  const trackWidth = 320;
  const circleSize = 56;
  const offset = ((progress / 100) * (trackWidth - circleSize));

  const loaderUI = (
    <div className="relative w-full h-full">
      {/* adarsh. top-left */}
      <div className="absolute left-6 top-6 z-20 font-hero text-lg tracking-tight text-white">
        adarsh<span className="text-primary">.</span>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative h-14 overflow-hidden rounded-full border border-white/15 backdrop-blur-xl"
          style={{ width: trackWidth, background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100 ease-linear"
            style={{ width: circleSize + offset, background: "rgba(255,255,255,0.9)" }}
          />
          <div
            className="absolute top-1/2 grid place-items-center rounded-full border border-white/40 text-xl shadow-2xl"
            style={{
              width: circleSize,
              height: circleSize,
              left: offset,
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(14px) saturate(160%)",
              transition: "left 100ms linear",
            }}
          >
            {emojis[emojiIdx]}
          </div>
        </div>
        <div className="absolute left-1/2 top-[calc(100%+2rem)] -translate-x-1/2 text-xs tracking-widest text-white/60">
          {progress}%
        </div>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden ${phase === "reveal" ? "pointer-events-none" : ""}`} aria-hidden>
      {/* Top reveal panel */}
      <div
        className="absolute inset-x-0 top-0 z-10 bg-black transition-transform duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)]"
        style={{
          height: "calc(50% + 1px)", // 1px overlap to prevent sub-pixel gap
          boxShadow: phase === "reveal" ? "0 30px 50px 20px black" : "none",
          transform: phase === "reveal" ? "translateY(calc(-100% - 150px))" : "translateY(0)",
        }}
      />

      {/* Bottom reveal panel */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 bg-black transition-transform duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)]"
        style={{
          height: "50%",
          boxShadow: phase === "reveal" ? "0 -30px 50px 20px black" : "none",
          transform: phase === "reveal" ? "translateY(calc(100% + 150px))" : "translateY(0)",
        }}
      />

      {/* Central Loader UI that fades out */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500" 
        style={{ opacity: phase === "reveal" ? 0 : 1 }}
      >
        {loaderUI}
      </div>
    </div>
  );
}
