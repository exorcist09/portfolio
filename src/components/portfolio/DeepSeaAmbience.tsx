import React from "react";

export function DeepSeaAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden>
      
      {/* ── Ambient Caustic Ocean Rays ── */}
      <div
        className="absolute -top-10 left-1/4 h-96 w-64 rotate-12 bg-gradient-to-b from-primary/10 via-cyan-500/5 to-transparent blur-3xl opacity-20"
        style={{ animation: "causticSway 14s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute -top-10 right-1/4 h-96 w-72 -rotate-12 bg-gradient-to-b from-sky-400/10 via-primary/5 to-transparent blur-3xl opacity-20"
        style={{ animation: "causticSway 18s ease-in-out 3s infinite alternate-reverse" }}
      />

      {/* ═════════════════════════════════════════════════════════════════════
          LEFT DEEP SEA MARGIN
         ═════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-44 opacity-30 transition-opacity duration-700">

        {/* 1. Bioluminescent Anglerfish with Glowing Lure */}
        <div
          className="absolute left-2 top-[12%]"
          style={{ animation: "anglerProwl 24s ease-in-out infinite" }}
        >
          <svg className="h-16 w-14 text-primary/75 filter drop-shadow-[0_0_10px_currentColor]" viewBox="0 0 60 50" fill="none">
            {/* Lure stalk & glowing esca */}
            <path d="M22 18 C20 4 36 6 36 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="36" cy="12" r="3" fill="#38bdf8" className="animate-pulse" filter="drop-shadow(0 0 6px #38bdf8)" />
            {/* Body */}
            <path
              d="M10 28 C10 16 32 16 38 24 C44 20 50 18 54 16 C51 24 51 32 54 40 C50 38 44 36 38 32 C30 38 12 40 10 28 Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Jaw & Fangs */}
            <path d="M12 28 Q22 36 28 28" stroke="currentColor" strokeWidth="1.2" />
            <path d="M16 27 L17 31 M20 28 L21 32 M24 28 L25 31" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Fin */}
            <path d="M30 26 Q36 22 34 32" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          </svg>
        </div>

        {/* 2. Bioluminescent Jellyfish */}
        <div
          className="absolute left-6 top-[34%]"
          style={{ animation: "jellySwim 16s ease-in-out infinite" }}
        >
          <svg className="h-14 w-10 text-cyan-400/70 filter drop-shadow-[0_0_8px_currentColor]" viewBox="0 0 40 60" fill="none">
            <path
              d="M5 25 C5 8 35 8 35 25 C30 27 25 24 20 26 C15 24 10 27 5 25 Z"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <ellipse cx="20" cy="18" rx="6" ry="4" fill="currentColor" fillOpacity="0.5" />
            <path d="M12 25 Q9 38 13 52" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
            <path d="M17 26 Q21 40 18 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <path d="M23 26 Q19 41 22 57" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <path d="M28 25 Q31 39 27 50" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* 3. Tiny School of Deep-Sea Lanternfish */}
        <div
          className="absolute left-3 top-[58%]"
          style={{ animation: "fishSchool 18s linear infinite" }}
        >
          <div className="relative h-12 w-20">
            <div className="absolute left-0 top-0 h-1.5 w-4 rounded-full bg-primary/70 border border-primary/40 shadow-[0_0_6px_currentColor]" />
            <div className="absolute left-4 top-3 h-1.5 w-4 rounded-full bg-cyan-400/70 border border-cyan-400/40 shadow-[0_0_6px_currentColor]" />
            <div className="absolute left-1 top-6 h-1.5 w-4 rounded-full bg-sky-300/70 border border-sky-300/40 shadow-[0_0_6px_currentColor]" />
          </div>
        </div>

        {/* 4. Deep Sea Swaying Kelp / Flora at Bottom Left */}
        <div className="absolute -bottom-6 left-1 h-56 w-20 origin-bottom" style={{ animation: "kelpSway 9s ease-in-out infinite alternate" }}>
          <svg className="h-full w-full text-primary/40" viewBox="0 0 60 180" fill="none">
            <path
              d="M20 180 Q35 130 15 90 T30 20 Q35 5 28 0"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M20 150 Q42 140 38 125" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M16 110 Q-2 100 2 85" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M24 70 Q45 60 40 45" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>

        {/* Marine Snow / Bioluminescent Particles */}
        <div className="absolute top-[22%] left-8 h-1.5 w-1.5 rounded-full bg-primary/70 animate-pulse shadow-[0_0_6px_currentColor]" />
        <div className="absolute top-[48%] left-14 h-1 w-1 rounded-full bg-cyan-300/80 animate-ping" />
        <div className="absolute top-[76%] left-6 h-2 w-2 rounded-full bg-primary/60 animate-pulse shadow-[0_0_8px_currentColor]" />

        {/* Rising micro-bubbles */}
        <div className="absolute left-10 top-[40%] h-2 w-2 rounded-full border border-cyan-400/50 bg-cyan-400/10" style={{ animation: "deepBubble 9s linear infinite" }} />
        <div className="absolute left-4 top-[80%] h-2.5 w-2.5 rounded-full border border-primary/50 bg-primary/10" style={{ animation: "deepBubble 13s linear 3s infinite" }} />
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          RIGHT DEEP SEA MARGIN
         ═════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-y-0 right-0 w-24 sm:w-44 opacity-30 transition-opacity duration-700">

        {/* 1. Graceful Deep-Sea Manta / Stingray Glide */}
        <div
          className="absolute right-4 top-[15%]"
          style={{ animation: "mantaGlide 26s ease-in-out 2s infinite" }}
        >
          <svg className="h-14 w-16 text-cyan-400/70 filter drop-shadow-[0_0_8px_currentColor]" viewBox="0 0 60 50" fill="none">
            {/* Wing body */}
            <path
              d="M30 10 C45 18 58 28 54 32 C45 32 36 24 30 25 C24 24 15 32 6 32 C2 28 15 18 30 10 Z"
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Long thin tail */}
            <path d="M30 25 Q30 40 33 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
            {/* Subtle cephalic fins */}
            <path d="M26 10 Q24 6 26 4 M34 10 Q36 6 34 4" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          </svg>
        </div>

        {/* 2. Bioluminescent Comb Jelly / Ctenophore */}
        <div
          className="absolute right-8 top-[46%]"
          style={{ animation: "jellySwim 20s ease-in-out 4s infinite" }}
        >
          <svg className="h-12 w-8 text-primary/75 filter drop-shadow-[0_0_8px_currentColor]" viewBox="0 0 30 50" fill="none">
            <ellipse cx="15" cy="20" rx="10" ry="16" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" />
            {/* Iridescent comb rows */}
            <path d="M11 7 Q9 20 11 33" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
            <path d="M15 5 Q15 20 15 35" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
            <path d="M19 7 Q21 20 19 33" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
            {/* Trailing fine filaments */}
            <path d="M12 36 Q8 44 11 50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <path d="M18 36 Q22 44 19 50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          </svg>
        </div>

        {/* 3. Deep Sea Kelp at Bottom Right */}
        <div className="absolute -bottom-6 right-2 h-60 w-24 origin-bottom" style={{ animation: "kelpSway 11s ease-in-out 2s infinite alternate-reverse" }}>
          <svg className="h-full w-full text-cyan-400/35" viewBox="0 0 60 180" fill="none">
            <path
              d="M38 180 Q20 130 42 90 T26 20 Q22 5 30 0"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M38 150 Q16 140 20 125" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M40 110 Q58 100 54 85" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M34 70 Q14 60 18 45" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>

        {/* Phytoplankton Glow Particles */}
        <div className="absolute top-[28%] right-8 h-2 w-2 rounded-full bg-cyan-400/70 animate-pulse shadow-[0_0_8px_currentColor]" />
        <div className="absolute top-[68%] right-12 h-1.5 w-1.5 rounded-full bg-primary/70 animate-ping" />
        <div className="absolute top-[85%] right-6 h-2 w-2 rounded-full bg-sky-300/60 animate-pulse shadow-[0_0_6px_currentColor]" />

        {/* Rising micro-bubbles */}
        <div className="absolute right-8 top-[36%] h-2.5 w-2.5 rounded-full border border-sky-400/50 bg-sky-400/10" style={{ animation: "deepBubble 11s linear 1.5s infinite" }} />
        <div className="absolute right-12 top-[72%] h-2 w-2 rounded-full border border-primary/50 bg-primary/10" style={{ animation: "deepBubble 14s linear 5s infinite" }} />
      </div>

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes causticSway {
          0% { transform: translateY(0) rotate(10deg); opacity: 0.15; }
          100% { transform: translateY(40px) rotate(16deg); opacity: 0.28; }
        }

        @keyframes anglerProwl {
          0% { transform: translateY(0) translateX(0); }
          30% { transform: translateY(-16px) translateX(6px); }
          65% { transform: translateY(12px) translateX(-4px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes mantaGlide {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          35% { transform: translateY(22px) translateX(-8px) rotate(-4deg); }
          70% { transform: translateY(-14px) translateX(4px) rotate(3deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }

        @keyframes jellySwim {
          0% { transform: translateY(0) scaleY(1); }
          25% { transform: translateY(-24px) scaleY(1.15) scaleX(0.92); }
          50% { transform: translateY(-40px) scaleY(0.95) scaleX(1.05); }
          75% { transform: translateY(-20px) scaleY(1.08) scaleX(0.96); }
          100% { transform: translateY(0) scaleY(1); }
        }

        @keyframes fishSchool {
          0% { transform: translateY(0) translateX(-10px); opacity: 0; }
          20% { opacity: 0.9; }
          50% { transform: translateY(-18px) translateX(12px); opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-36px) translateX(24px); opacity: 0; }
        }

        @keyframes kelpSway {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(5deg); }
        }

        @keyframes deepBubble {
          0% { transform: translateY(60px) translateX(0) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          50% { transform: translateY(-40px) translateX(8px) scale(1); }
          80% { opacity: 0.8; }
          100% { transform: translateY(-140px) translateX(-6px) scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
