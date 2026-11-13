"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { freelanceData, FreelanceService } from "@/data/freelance";

export default function Freelance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Default initial path for SSR matching standard card center spacing
  const [pathData, setPathData] = useState<string>(
    "M 4 -20 L 4 354 Q 4 370 20 370 L 38 370 M 4 52 Q 4 68 20 68 L 38 68 M 4 203 Q 4 219 20 219 L 38 219"
  );

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      if (!container) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      const spineX = 4;
      const startY = -24; // Begins neatly in the gap below the header
      const cardLeft = cards[0].offsetLeft;
      const radius = Math.min(16, Math.max(8, (cardLeft - spineX) * 0.55));

      // Each branch connects at the exact vertical center of each card
      const branchYs = cards.map((card) => card.offsetTop + card.offsetHeight / 2);
      const lastIdx = branchYs.length - 1;
      const lastY = branchYs[lastIdx];

      // 1. Continuous vertical trunk running all the way down, then curving into the last card's center
      let d = `M ${spineX} ${startY} L ${spineX} ${lastY - radius} Q ${spineX} ${lastY} ${spineX + radius} ${lastY} L ${cardLeft + 2} ${lastY} `;

      // 2. Intermediate branches that fork off the trunk into the center of cards 0..N-2
      for (let i = 0; i < lastIdx; i++) {
        const y = branchYs[i];
        d += `M ${spineX} ${y - radius} Q ${spineX} ${y} ${spineX + radius} ${y} L ${cardLeft + 2} ${y} `;
      }

      setPathData(d);
    };

    updatePath();

    const ro = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(updatePath);
    }

    window.addEventListener("resize", updatePath);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, []);

  return (
    <section id="freelance" className="py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6">
      {/* Consistent Left-Aligned Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-left"
      >
        <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
          FREELANCE
        </span>

        <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
          crafting for clients
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8A8A85] leading-relaxed max-w-xl">
          {freelanceData.description}
        </p>
      </motion.div>

      {/* Services List with SVG Tree Connector matching wireframe */}
      <div ref={containerRef} className="relative pl-7 sm:pl-9">
        {/* SVG Tree Connector: single continuous trunk + smooth branching curves */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
          aria-hidden="true"
        >
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {freelanceData.services.map((service: FreelanceService, idx: number) => (
          <div
            key={service.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="relative mb-4 last:mb-0"
          >
            {/* Card Container */}
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 group block rounded-2xl border border-white/10 bg-[#0E0E0E] hover:bg-[#141414] hover:border-white/20 p-5 sm:p-6 transition-all duration-200 select-none shadow-sm"
            >
              {/* Category */}
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono-custom text-[#8A8A85] mb-2">
                <span className="uppercase tracking-wider text-[#8A8A85]/80">
                  {service.category}
                </span>
              </div>

              {/* Title & Description (Deliverables kept removed as requested) */}
              <div className="space-y-1.5 text-left">
                <h3 className="text-base sm:text-lg font-semibold text-[#EDEDEA] group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Bottom "+ work together .." action button without borders in dark orange */}
      <div className="mt-8 text-center select-none">
        <a
          href="#contact"
          className="font-handwriting text-xl sm:text-2xl text-[#EA580C] hover:text-orange-400 transition-colors cursor-pointer select-none inline-block"
        >
          + work together ..
        </a>
      </div>
    </section>
  );
}
