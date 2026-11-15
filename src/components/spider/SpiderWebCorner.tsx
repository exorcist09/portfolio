"use client";

import { motion } from "framer-motion";

interface SpiderWebCornerProps {
  isWeaving: boolean;
  hasWoven: boolean;
  visible?: boolean;
}

/**
 * Procedural Spider Web in Bottom-Right Corner
 * Woven SLOWLY by Spidy when untouched for a period of time.
 * Silk originates directly from Spidy's rear hindleg (x: 245, y: 265).
 * Color: Totally white/10 to white/20 (rgba(255, 255, 255, 0.16)).
 */
export default function SpiderWebCorner({
  isWeaving,
  hasWoven,
  visible = true,
}: SpiderWebCornerProps) {
  if (!visible && !hasWoven && !isWeaving) return null;

  // Origin at bottom-right corner of 300x300 canvas
  const Ox = 300;
  const Oy = 300;

  // Spidy's rear hindleg anchor point where silk is drawn
  const legAnchorX = 246;
  const legAnchorY = 264;

  // 8 Radiating anchor spokes (from 0 deg = straight up, to 90 deg = straight left)
  // Angles in degrees: 0, 13, 26, 39, 51, 64, 77, 90
  const angles = [0, 13, 26, 39, 51, 64, 77, 90];
  const maxRadius = 285;

  const spokes = angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const endX = Ox - Math.sin(rad) * maxRadius;
    const endY = Oy - Math.cos(rad) * maxRadius;
    return {
      d: `M ${Ox} ${Oy} L ${endX.toFixed(1)} ${endY.toFixed(1)}`,
      angleRad: rad,
      endX,
      endY,
    };
  });

  // 6 Concentric spiral rings with catenary sags towards corner
  const ringRadii = [48, 92, 140, 190, 240, 285];

  const ringPaths = ringRadii.map((r) => {
    let path = "";
    for (let i = 0; i < angles.length; i++) {
      const rad = (angles[i] * Math.PI) / 180;
      const x = Ox - Math.sin(rad) * r;
      const y = Oy - Math.cos(rad) * r;

      if (i === 0) {
        path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        const prevRad = (angles[i - 1] * Math.PI) / 180;
        const prevX = Ox - Math.sin(prevRad) * r;
        const prevY = Oy - Math.cos(prevRad) * r;

        // Control point pulled slightly towards corner (catenary sag)
        const midX = (prevX + x) / 2;
        const midY = (prevY + y) / 2;
        const cpX = midX * 0.94 + Ox * 0.06;
        const cpY = midY * 0.94 + Oy * 0.06;

        path += ` Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    }
    return path;
  });

  // Dewdrop intersections
  const dewDrops: { x: number; y: number }[] = [];
  ringRadii.forEach((r, rIdx) => {
    angles.forEach((deg, aIdx) => {
      if ((rIdx + aIdx) % 2 === 0) {
        const rad = (deg * Math.PI) / 180;
        dewDrops.push({
          x: Ox - Math.sin(rad) * r,
          y: Oy - Math.cos(rad) * r,
        });
      }
    });
  });

  const showWeb = isWeaving || hasWoven;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showWeb ? 1 : 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed bottom-0 right-0 w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] pointer-events-none z-[90] overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="silkSpokeGrad" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
          </linearGradient>

          {/* Active silk thread glow from leg */}
          <linearGradient id="activeLegSilk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* --- 8 Radial Anchor Spokes (Generated SLOWLY one by one) --- */}
        {spokes.map((spoke, idx) => (
          <motion.path
            key={`spoke-${idx}`}
            d={spoke.d}
            stroke="url(#silkSpokeGrad)"
            strokeWidth="1.25"
            strokeLinecap="round"
            initial={{ pathLength: hasWoven ? 1 : 0, opacity: hasWoven ? 1 : 0 }}
            animate={{
              pathLength: showWeb ? 1 : 0,
              opacity: showWeb ? 1 : 0,
            }}
            transition={{
              duration: hasWoven ? 0.3 : 2.2, // Slow, smooth spoke expansion
              delay: hasWoven ? 0 : idx * 0.55, // Staggered over ~4.4s
              ease: "easeOut",
            }}
          />
        ))}

        {/* --- 6 Concentric Spiral Catenary Web Arcs (Generated SLOWLY ring by ring) --- */}
        {ringPaths.map((d, idx) => (
          <motion.path
            key={`ring-${idx}`}
            d={d}
            stroke="rgba(255, 255, 255, 0.17)"
            strokeWidth="1.15"
            strokeLinecap="round"
            initial={{ pathLength: hasWoven ? 1 : 0, opacity: hasWoven ? 1 : 0 }}
            animate={{
              pathLength: showWeb ? 1 : 0,
              opacity: showWeb ? 1 : 0,
            }}
            transition={{
              duration: hasWoven ? 0.3 : 2.4, // Slow, deliberate spiral curve drawing
              delay: hasWoven ? 0 : 4.4 + idx * 2.0, // Ring 0 at 4.4s, Ring 5 at 14.4s
              ease: "easeInOut",
            }}
          />
        ))}

        {/* --- Dewdrop Intersections appearing gradually --- */}
        {dewDrops.map((drop, idx) => (
          <motion.circle
            key={`dew-${idx}`}
            cx={drop.x}
            cy={drop.y}
            r="1.4"
            fill="rgba(255, 255, 255, 0.28)"
            initial={{ scale: hasWoven ? 1 : 0, opacity: hasWoven ? 1 : 0 }}
            animate={{
              scale: showWeb ? 1 : 0,
              opacity: showWeb ? 1 : 0,
            }}
            transition={{
              duration: 0.6,
              delay: hasWoven ? 0 : 5.0 + idx * 0.28,
              ease: "easeOut",
            }}
          />
        ))}

        {/* --- VISIBLE SILK THREAD STARTING DIRECTLY FROM SPIDY'S LEG --- */}
        {isWeaving && (
          <g>
            {/* Luminous silk thread stretching from Spidy's hindleg to the active weave zone */}
            <motion.path
              d={`M ${legAnchorX} ${legAnchorY} Q 210 230 180 160`}
              stroke="url(#activeLegSilk)"
              strokeWidth="1.4"
              strokeDasharray="4 2"
              fill="none"
              animate={{
                d: [
                  `M ${legAnchorX} ${legAnchorY} Q 220 240 180 140`,
                  `M ${legAnchorX} ${legAnchorY} Q 190 220 120 180`,
                  `M ${legAnchorX} ${legAnchorY} Q 210 200 160 210`,
                  `M ${legAnchorX} ${legAnchorY} Q 230 220 220 160`,
                  `M ${legAnchorX} ${legAnchorY} Q 220 240 180 140`,
                ],
                opacity: [0.35, 0.7, 0.45, 0.65, 0.35],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Glowing silk spinneret droplet at Spidy's leg anchor */}
            <motion.circle
              cx={legAnchorX}
              cy={legAnchorY}
              r="2.2"
              fill="var(--accent)"
              animate={{
                scale: [1, 1.4, 0.9, 1.3, 1],
                opacity: [0.6, 1, 0.7, 0.95, 0.6],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
