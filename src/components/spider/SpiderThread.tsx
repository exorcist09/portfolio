"use client";

interface SpiderThreadProps {
  topAnchorX: number;
  topAnchorY: number;
  spiderX: number;
  spiderY: number;
  swingOffset?: number;
  opacity?: number;
  visible?: boolean;
}

export default function SpiderThread({
  topAnchorX,
  topAnchorY = 0,
  spiderX,
  spiderY,
  swingOffset = 0,
  opacity = 0.5,
  visible = true,
}: SpiderThreadProps) {
  if (!visible || spiderY <= 0) return null;

  // Gentle physics curve during swing/descent
  const midX = (topAnchorX + spiderX) / 2 + swingOffset * 0.75;
  const midY = (topAnchorY + spiderY) / 2;

  const pathD = `M ${topAnchorX} ${topAnchorY} Q ${midX} ${midY} ${spiderX} ${spiderY}`;

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-[115] overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* Luminous silk thread gradient with subtle accent glow */}
        <linearGradient id="spidySilkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Main Silk Web Thread */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#spidySilkGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          opacity,
          transition: "opacity 0.3s ease-out",
          filter: "drop-shadow(0 0 2px rgba(255,255,255,0.35))",
        }}
      />
    </svg>
  );
}
