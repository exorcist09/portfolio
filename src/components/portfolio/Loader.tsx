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
        onProgress?.(n);
        if (n >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("reveal"), 250);
          setTimeout(() => {
            setPhase("done");
            onDone();
          }, 1500);
          return 100;
        }
        return n;
      });
    }, 30);
    return () => clearInterval(id);
  }, [phase, onDone, onProgress]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden ${phase === "reveal" ? "pointer-events-none" : ""}`}
      aria-hidden
    >
      {/* Top reveal panel */}
      <div
        className="absolute inset-x-0 top-0 z-10 bg-black transition-transform duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)]"
        style={{
          height: "calc(50% + 1px)",
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

      {/* adarsh. branding only — no loader bar or % */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500"
        style={{ opacity: phase === "reveal" ? 0 : 1 }}
      >
        <div className="absolute left-6 top-6 font-hero text-lg tracking-tight text-white">
          adarsh<span className="text-primary">.</span>
        </div>
      </div>
    </div>
  );
}
