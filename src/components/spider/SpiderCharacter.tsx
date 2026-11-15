"use client";

import { SpiderState, LegRotations } from "./SpiderAnimations";

interface SpiderCharacterProps {
  state: SpiderState;
  lookX?: number; // -1, 0, 1
  lookY?: number; // -1, 0, 1
  isBlinking?: boolean;
  legRotations: LegRotations;
  size?: number;
  className?: string;
}

/**
 * Spidy - Cartoonish Cute 3D AI Spider Mascot
 *
 * Visual Rules:
 * - Orange color is ONLY at the bottom of the foot / paw pads (removed from leg centers).
 * - Default View: Back (Abdomen) is ON TOP, Head with giant chibi eyes is BELOW.
 * - Climbing View: Head is ON TOP looking UP towards top of chatbox, Abdomen is below.
 * - Cartoon Chibi Look: Giant sparkling anime eyes, rosy peach blush, cute mini-fangs.
 */
export default function SpiderCharacter({
  state,
  lookX = 0,
  lookY = 0,
  isBlinking = false,
  legRotations,
  size = 84,
  className = "",
}: SpiderCharacterProps) {
  const isSleeping = state === "sleeping";
  const isExcited = state === "excited";
  const isClimbing = state === "climbing";

  // Eye tracking offsets
  const pupilShiftX = isClimbing ? -0.8 : isSleeping ? 0 : Math.max(-1, Math.min(1, lookX)) * 2;
  const pupilShiftY = isClimbing ? -2.2 : isSleeping ? 0 : Math.max(-1, Math.min(1, lookY)) * 1.8;

  // =========================================================================
  // MODE 1: CLIMBING SPRITE
  // Head is on TOP looking UP, Abdomen is below, orange only on paw tips!
  // =========================================================================
  if (isClimbing) {
    return (
      <svg
        width={size}
        height={Math.round((size * 82) / 64)}
        viewBox="0 0 64 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none overflow-visible ${className}`}
        aria-label="Spidy climbing vertically"
      >
        <defs>
          {/* Head 3D Dome Gradient (On Top) */}
          <radialGradient id="climbHeadTop" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4A455E" />
            <stop offset="45%" stopColor="#221F2D" />
            <stop offset="90%" stopColor="#0E0D14" />
            <stop offset="100%" stopColor="#050408" />
          </radialGradient>

          {/* Abdomen 3D Gradient (Below) */}
          <radialGradient id="climbAbdomenBottom" cx="55%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3E3A50" />
            <stop offset="50%" stopColor="#1B1924" />
            <stop offset="92%" stopColor="#0A0910" />
            <stop offset="100%" stopColor="#040306" />
          </radialGradient>

          <filter id="climbShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="-2" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* --- 4 ARTICULATED LEGS CLAMPING LEFT (Orange ONLY on foot tips) --- */}
        {/* Foreleg 1 (Reaches high UP and left over border) */}
        <g
          style={{
            transformOrigin: "34px 22px",
            transform: `rotate(${legRotations.l1}deg)`,
          }}
        >
          <path
            d="M 34 22 C 25 14 16 12 11 8"
            stroke="#221F2D"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M 33 21 C 25 13 17 11 12 8"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 11 8 C 8 8 5 13 4 18"
            stroke="#171520"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="4" cy="18" r="2.2" fill="var(--accent)" />
        </g>

        {/* Mid-Upper Leg 2 */}
        <g
          style={{
            transformOrigin: "33px 30px",
            transform: `rotate(${legRotations.l2}deg)`,
          }}
        >
          <path
            d="M 33 30 C 23 26 14 27 9 24"
            stroke="#201E2B"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M 9 24 C 6 27 5 33 4 38"
            stroke="#16141F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="4" cy="38" r="2.1" fill="var(--accent)" />
        </g>

        {/* Mid-Lower Leg 3 */}
        <g
          style={{
            transformOrigin: "34px 44px",
            transform: `rotate(${legRotations.l3}deg)`,
          }}
        >
          <path
            d="M 34 44 C 24 43 16 46 11 46"
            stroke="#1B1926"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 11 46 C 8 50 6 57 6 62"
            stroke="#14121E"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="6" cy="62" r="2" fill="var(--accent)" />
        </g>

        {/* Hindleg 4 (Pushes down along border) */}
        <g
          style={{
            transformOrigin: "36px 56px",
            transform: `rotate(${legRotations.l4}deg)`,
          }}
        >
          <path
            d="M 36 56 C 28 60 20 66 14 68"
            stroke="#181622"
            strokeWidth="3.1"
            strokeLinecap="round"
          />
          <path
            d="M 14 68 C 12 72 11 76 10 80"
            stroke="#12101A"
            strokeWidth="2.7"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="10" cy="80" r="1.9" fill="var(--accent)" />
        </g>

        {/* --- ABDOMEN (BELOW IN CLIMBING) --- */}
        <g filter="url(#climbShadow)">
          <path
            d="M 32 36 C 45 34 57 42 57 56 C 57 69 45 77 33 77 C 27 77 26 70 27 62 C 28 52 30 42 32 36 Z"
            fill="url(#climbAbdomenBottom)"
          />
          <path
            d="M 36 40 C 44 38 53 44 53 54"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="45" cy="48" rx="6" ry="9" fill="rgba(255,255,255,0.1)" />
        </g>

        {/* --- HEAD (ON TOP IN CLIMBING - LOOKING UPWARDS) --- */}
        <g filter="url(#climbShadow)">
          <path
            d="M 30 14 C 41 13 50 19 50 28 C 50 37 41 43 30 43 C 25 43 25 36 26 28 C 27 20 28 15 30 14 Z"
            fill="url(#climbHeadTop)"
          />
          <path
            d="M 32 16 C 40 15 46 19 46 25"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
        </g>

        {/* --- GIANT CARTOON CHIBI EYE (ON TOP LOOKING UP) --- */}
        <g>
          <ellipse cx="37" cy="24" rx="6.4" ry="7" fill="#FFFFFF" />
          <ellipse cx="37" cy="24" rx="6" ry="6.6" fill="#F8FAFC" />

          {/* Deep Pupil Looking UP towards path */}
          <ellipse
            cx={37 + pupilShiftX}
            cy={24 + pupilShiftY}
            rx="4.2"
            ry="4.8"
            fill="#08070D"
          />

          {/* Giant Sparkling Catchlights */}
          <circle cx={35.2 + pupilShiftX * 0.4} cy={21.8 + pupilShiftY * 0.4} r="2" fill="#FFFFFF" />
          <circle cx={38.4 + pupilShiftX * 0.4} cy={25.4 + pupilShiftY * 0.4} r="1" fill="#FFFFFF" opacity="0.75" />
          <circle cx={34.8 + pupilShiftX * 0.4} cy={25.2 + pupilShiftY * 0.4} r="0.5" fill="#FFFFFF" opacity="0.6" />

          {/* Cute Rosy Peach-Amber Cheek Blush */}
          <ellipse cx="39" cy="31" rx="4.5" ry="2.4" fill="var(--accent)" opacity="0.9" />

          {/* Playful Little Amber Smile Fang */}
          <path
            d="M 28 34 C 26 36 26 39 28 41 C 29 39 30 37 29 34 Z"
            fill="var(--accent)"
          />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // MODE 2: DEFAULT FULL FRONT VIEW
  // (BACK ON TOP, HEAD BELOW, ORANGE ACCENT ONLY AT BOTTOM OF FEET)
  // =========================================================================
  return (
    <svg
      width={size}
      height={Math.round((size * 78) / 96)}
      viewBox="0 0 96 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none overflow-visible ${className}`}
      aria-label="Spidy mascot"
    >
      <defs>
        {/* Abdomen Gradient (Back on top) */}
        <radialGradient id="spidyAbdomenTopGrad" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#4A455E" />
          <stop offset="42%" stopColor="#221F2D" />
          <stop offset="85%" stopColor="#0E0D14" />
          <stop offset="100%" stopColor="#050408" />
        </radialGradient>

        {/* Head Gradient (Below) */}
        <radialGradient id="spidyHeadBottomGrad" cx="48%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#423D57" />
          <stop offset="45%" stopColor="#1E1C28" />
          <stop offset="88%" stopColor="#0B0A12" />
          <stop offset="100%" stopColor="#050408" />
        </radialGradient>

        {/* Ground Drop Shadow */}
        <radialGradient id="groundShadowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* --- Ambient Ground Shadow Beneath Spidy --- */}
      <ellipse cx="48" cy="71" rx="28" ry="6" fill="url(#groundShadowGrad)" />

      {/* ============================================================== */}
      {/* 1. LAYER 1: REAR CHUBBY LEGS (Orange ONLY at bottom of foot)   */}
      {/* ============================================================== */}
      <g opacity="0.9">
        {/* L3: Mid-Back Left Leg */}
        <g
          style={{
            transformOrigin: "36px 45px",
            transform: `rotate(${legRotations.l3}deg)`,
          }}
        >
          <path
            d="M 36 45 C 24 45 15 50 9 56"
            stroke="#15131C"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 18 49 C 12 55 9 63 8 70"
            stroke="#0E0D14"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="8" cy="70" r="2.2" fill="var(--accent)" />
        </g>

        {/* L4: Bottom-Back Left Leg */}
        <g
          style={{
            transformOrigin: "40px 53px",
            transform: `rotate(${legRotations.l4}deg)`,
          }}
        >
          <path
            d="M 40 53 C 32 58 24 64 19 66"
            stroke="#15131C"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 26 62 C 20 68 16 73 15 76"
            stroke="#0C0B12"
            strokeWidth="2.7"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="15" cy="76" r="2.1" fill="var(--accent)" />
        </g>

        {/* R3: Mid-Back Right Leg */}
        <g
          style={{
            transformOrigin: "60px 45px",
            transform: `rotate(${legRotations.r3}deg)`,
          }}
        >
          <path
            d="M 60 45 C 72 45 81 50 87 56"
            stroke="#15131C"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 78 49 C 84 55 87 63 88 70"
            stroke="#0E0D14"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="88" cy="70" r="2.2" fill="var(--accent)" />
        </g>

        {/* R4: Bottom-Back Right Leg */}
        <g
          style={{
            transformOrigin: "56px 53px",
            transform: `rotate(${legRotations.r4}deg)`,
          }}
        >
          <path
            d="M 56 53 C 64 58 72 64 77 66"
            stroke="#15131C"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 70 62 C 76 68 80 73 81 76"
            stroke="#0C0B12"
            strokeWidth="2.7"
            strokeLinecap="round"
          />
          {/* Orange ONLY at bottom of foot / paw pad */}
          <circle cx="81" cy="76" r="2.1" fill="var(--accent)" />
        </g>
      </g>

      {/* ============================================================== */}
      {/* 2. LAYER 2: BACK (ABDOMEN) IS ON TOP!                          */}
      {/* ============================================================== */}
      <g>
        <ellipse cx="48" cy="32" rx="21" ry="17" fill="url(#spidyAbdomenTopGrad)" />
        <ellipse cx="48" cy="25" rx="13" ry="6.5" fill="rgba(255,255,255,0.18)" />
        <path
          d="M 38 21 C 43 19 53 19 58 21"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        {/* Top Silk Thread Node */}
        <circle cx="48" cy="15" r="1.5" fill="rgba(255,255,255,0.85)" />
      </g>

      {/* ============================================================== */}
      {/* 3. LAYER 3: HEAD (CEPHALOTHORAX) IS BELOW!                     */}
      {/* ============================================================== */}
      <g>
        <ellipse cx="48" cy="50" rx="17.5" ry="14.5" fill="url(#spidyHeadBottomGrad)" />
        <ellipse cx="48" cy="46" rx="9" ry="4" fill="rgba(255,255,255,0.12)" />
      </g>

      {/* ============================================================== */}
      {/* 4. LAYER 4: FOREGROUND LEGS (Orange ONLY at bottom of foot)    */}
      {/* ============================================================== */}
      {/* L1: Top-Left Foreleg */}
      <g
        style={{
          transformOrigin: "36px 36px",
          transform: `rotate(${legRotations.l1}deg)`,
        }}
      >
        <path
          d="M 36 36 C 24 26 17 22 10 16"
          stroke="#252132"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M 35 35 C 24 25 17 21 11 16"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 18 22 C 12 20 7 26 5 32"
          stroke="#1A1826"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Orange ONLY at bottom of foot / paw pad */}
        <circle cx="5" cy="32" r="2.2" fill="var(--accent)" />
      </g>

      {/* L2: Upper-Mid Left Leg */}
      <g
        style={{
          transformOrigin: "34px 44px",
          transform: `rotate(${legRotations.l2}deg)`,
        }}
      >
        <path
          d="M 34 44 C 22 39 13 41 7 40"
          stroke="#221F2F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 14 40 C 9 43 6 50 5 56"
          stroke="#181624"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Orange ONLY at bottom of foot / paw pad */}
        <circle cx="5" cy="56" r="2.2" fill="var(--accent)" />
      </g>

      {/* R1: Top-Right Foreleg */}
      <g
        style={{
          transformOrigin: "60px 36px",
          transform: `rotate(${legRotations.r1}deg)`,
        }}
      >
        <path
          d="M 60 36 C 72 26 79 22 86 16"
          stroke="#252132"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M 61 35 C 72 25 79 21 85 16"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 78 22 C 84 20 89 26 91 32"
          stroke="#1A1826"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Orange ONLY at bottom of foot / paw pad */}
        <circle cx="91" cy="32" r="2.2" fill="var(--accent)" />
      </g>

      {/* R2: Upper-Mid Right Leg */}
      <g
        style={{
          transformOrigin: "62px 44px",
          transform: `rotate(${legRotations.r2}deg)`,
        }}
      >
        <path
          d="M 62 44 C 74 39 83 41 89 40"
          stroke="#221F2F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 82 40 C 87 43 90 50 91 56"
          stroke="#181624"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Orange ONLY at bottom of foot / paw pad */}
        <circle cx="91" cy="56" r="2.2" fill="var(--accent)" />
      </g>

      {/* ============================================================== */}
      {/* 5. GIANT SPARKLING CARTOON CHIBI EYES (IN HEAD BELOW)          */}
      {/* ============================================================== */}
      {isBlinking ? (
        <g>
          {/* Adorable happy closed crescent eyes */}
          <path d="M 37 50 Q 42 54 47 50" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 49 50 Q 54 54 59 50" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      ) : isSleeping ? (
        <g>
          {/* Peaceful sleepy closed eyes */}
          <path d="M 37 50 Q 42 47 47 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 49 50 Q 54 47 59 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          {/* --- LEFT EYE --- */}
          <ellipse cx="42" cy="49" rx="6.4" ry="7.2" fill="#FFFFFF" />
          <ellipse cx="42" cy="49" rx="6" ry="6.8" fill="#F8FAFC" />
          {/* Left Pupil */}
          <ellipse
            cx={42 + pupilShiftX * 0.8}
            cy={49 + pupilShiftY * 0.8}
            rx="4.2"
            ry="5"
            fill="#09080E"
          />
          {/* Giant Sparkling Catchlights */}
          <circle cx={40.2 + pupilShiftX * 0.3} cy={46.8 + pupilShiftY * 0.3} r="2" fill="#FFFFFF" />
          <circle cx={43.6 + pupilShiftX * 0.3} cy={50.6 + pupilShiftY * 0.3} r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx={39.8 + pupilShiftX * 0.3} cy={50.2 + pupilShiftY * 0.3} r="0.5" fill="#FFFFFF" opacity="0.6" />

          {/* --- RIGHT EYE --- */}
          <ellipse cx="54" cy="49" rx="6.4" ry="7.2" fill="#FFFFFF" />
          <ellipse cx="54" cy="49" rx="6" ry="6.8" fill="#F8FAFC" />
          {/* Right Pupil */}
          <ellipse
            cx={54 + pupilShiftX * 0.8}
            cy={49 + pupilShiftY * 0.8}
            rx="4.2"
            ry="5"
            fill="#09080E"
          />
          {/* Giant Sparkling Catchlights */}
          <circle cx={52.2 + pupilShiftX * 0.3} cy={46.8 + pupilShiftY * 0.3} r="2" fill="#FFFFFF" />
          <circle cx={55.6 + pupilShiftX * 0.3} cy={50.6 + pupilShiftY * 0.3} r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx={51.8 + pupilShiftX * 0.3} cy={50.2 + pupilShiftY * 0.3} r="0.5" fill="#FFFFFF" opacity="0.6" />

          {/* Excited sparkle stars */}
          {isExcited && (
            <>
              <circle cx="42" cy="49" r="1.6" fill="var(--accent)" />
              <circle cx="54" cy="49" r="1.6" fill="var(--accent)" />
            </>
          )}
        </g>
      )}

      {/* ============================================================== */}
      {/* 6. GLOWING ROSY PEACH CHEEKS & CUTE PLAYFUL FANGS             */}
      {/* ============================================================== */}
      <ellipse cx="37" cy="56" rx="4.8" ry="2.6" fill="var(--accent)" opacity="0.88" />
      <ellipse cx="59" cy="56" rx="4.8" ry="2.6" fill="var(--accent)" opacity="0.88" />

      {/* Cute Playful Little Amber Fangs Peeking Out */}
      <g>
        <path
          d="M 44.5 58 C 43.5 60 43.5 63 45.5 64 C 46.5 62 46.5 60 45.5 58 Z"
          fill="var(--accent)"
        />
        <path
          d="M 51.5 58 C 50.5 60 50.5 62 51.5 64 C 52.5 63 52.5 60 51.5 58 Z"
          fill="var(--accent)"
        />
      </g>
    </svg>
  );
}
