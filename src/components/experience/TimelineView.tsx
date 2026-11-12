"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { experiences } from "@/data/experience";

export default function TimelineView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Find specific milestone items from user data
  const exp2020 = experiences.find((e) => e.startYear <= 2021.5 && !e.isTileOnly);
  const exp2022 = experiences.find((e) => e.id === "iiit" || e.lane === 2 || e.isTileOnly);
  const exp2023 = experiences.find(
    (e) => (e.id === "meteorite" || (e.startYear >= 2022 && e.startYear < 2023.5)) && !e.isTileOnly
  );
  const exp2024 = experiences.find(
    (e) => e.id === "bloop" || (e.startYear >= 2023.5 && e.startYear < 2025.5)
  );
  const exp2026 = experiences.find(
    (e) => e.id === "skyclad" || e.active || e.startYear >= 2025.5
  );

  // Timeline coordinate configuration (Grey monochrome theme)
  const timelineWidth = 1080; // px
  const yLine = 168; // Y position of the horizontal axis

  const yearCoords: Record<number, number> = {
    2020: 70,
    2021: 175,
    2022: 280,
    2023: 390,
    2024: 515,
    2025: 635,
    2026: 755,
    2027: 875,
  };

  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

  // Scroll to focus on active years (2022-2026) on initial load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 140;
    }
  }, []);

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full my-3">
      {/* Scrollable Timeline Canvas - NO SIDE BORDER, only subtle top/bottom borders */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto no-scrollbar py-6 border-y border-white/[0.06] bg-transparent select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div style={{ width: `${timelineWidth}px` }} className="relative h-[280px]">
          {/* ========================================================== */}
          {/* 1. HORIZONTAL AXIS LINE (SOLID GREY & DASHED GREY)         */}
          {/* ========================================================== */}
          {/* Solid grey line (2020 to 2026) */}
          <div
            style={{
              left: `${yearCoords[2020]}px`,
              width: `${yearCoords[2026] - yearCoords[2020]}px`,
              top: `${yLine}px`,
            }}
            className="absolute h-[2px] bg-white/20 rounded-full pointer-events-none"
          />

          {/* Dashed grey line with arrow extension (2026 to 2027+) */}
          <div
            style={{
              left: `${yearCoords[2026]}px`,
              width: `${yearCoords[2027] - yearCoords[2026] + 45}px`,
              top: `${yLine}px`,
            }}
            className="absolute h-0 border-t-2 border-dashed border-white/20 pointer-events-none flex items-center justify-end"
          >
            <span className="text-[#8A8A85] text-xs font-mono-custom -mr-1.5 -mt-[1px] select-none">
              ▸
            </span>
          </div>

          {/* ========================================================== */}
          {/* 2. GREY CONNECTOR STEMS (Leader lines connecting dots)     */}
          {/* ========================================================== */}

          {/* 2020 Stem (if 2020 card exists) */}
          {exp2020 && (
            <div
              style={{
                left: `${yearCoords[2020]}px`,
                top: "128px",
                height: `${yLine - 128}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 pointer-events-none"
            />
          )}

          {/* 2022 Stem (IIITDMJ - drops down to squircle below the line) */}
          {exp2022 && (
            <div
              style={{
                left: `${yearCoords[2022]}px`,
                top: `${yLine}px`,
                height: "44px",
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* 2023 Stem (Meteorite - goes up to squircle above the line) */}
          {exp2023 && (
            <div
              style={{
                left: `${yearCoords[2023]}px`,
                top: "126px",
                height: `${yLine - 126}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* 2024 Stem (Bloop - goes up to bottom of card) */}
          {exp2024 && (
            <div
              style={{
                left: `${yearCoords[2024]}px`,
                top: "124px",
                height: `${yLine - 124}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* 2026 Stem (Skyclad - goes up to bottom of card) */}
          {exp2026 && (
            <div
              style={{
                left: `${yearCoords[2026]}px`,
                top: "124px",
                height: `${yLine - 124}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* ========================================================== */}
          {/* 3. GREY YEAR DOTS & YEAR LABELS                            */}
          {/* ========================================================== */}
          {years.map((year) => {
            const x = yearCoords[year];
            const isMilestone = [2020, 2022, 2023, 2024, 2026].includes(year);
            const isCurrent = year === 2026;

            return (
              <div
                key={year}
                style={{ left: `${x}px` }}
                className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
              >
                {/* Milestone Dot on the line */}
                <div
                  style={{ top: `${yLine}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  {isCurrent ? (
                    // Current Year (2026) Dot with subtle ring
                    <div className="relative flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full border border-white/30 bg-[#161616]" />
                      <span className="absolute w-2 h-2 rounded-full bg-white/90" />
                    </div>
                  ) : isMilestone ? (
                    // Main Milestone Dot
                    <div className="w-3 h-3 rounded-full border border-white/25 bg-[#141416] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    </div>
                  ) : (
                    // Intermediate Subtle Dot
                    <div className="w-2 h-2 rounded-full bg-white/25" />
                  )}
                </div>

                {/* Monospace Year Label below the line */}
                <span
                  style={{ top: `${yLine + 14}px` }}
                  className="absolute -translate-x-1/2 font-mono-custom text-[11px] text-[#8A8A85] select-none"
                >
                  {year}
                </span>
              </div>
            );
          })}

          {/* ========================================================== */}
          {/* 4. GREY MONOCHROME CARDS (Only logo has custom color)     */}
          {/* ========================================================== */}

          {/* Card 1: 2020 (Optional early milestone in grey) */}
          {exp2020 && (
            <motion.div
              style={{
                left: `${yearCoords[2020]}px`,
                top: "48px",
              }}
              whileHover={{ y: -2 }}
              className="absolute w-[190px] rounded-2xl border border-white/10 bg-[#121214] p-3 shadow-md hover:border-white/25 transition-all cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 shadow-sm"
                  style={{
                    backgroundColor: exp2020.logoBg || "#1A1A1A",
                    color: exp2020.logoColor || "#EDEDEA",
                  }}
                >
                  {exp2020.logoText || "AB"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-white tracking-tight truncate">
                    {exp2020.company}
                  </h4>
                  <p className="text-[10px] text-[#8A8A85] tracking-tight truncate">
                    {exp2020.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono-custom text-[#8A8A85]">
                <Calendar className="w-2.5 h-2.5 text-[#8A8A85] shrink-0" />
                <span>{exp2020.period}</span>
              </div>
            </motion.div>
          )}

          {/* Card 2: 2022 (IIITDMJ) - Grey squircle card BELOW the line */}
          {exp2022 && (
            <motion.div
              style={{
                left: `${yearCoords[2022]}px`,
                top: "212px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ scale: 1.08 }}
              className="absolute group w-11 h-11 rounded-xl border border-white/10 bg-[#121214] hover:border-white/30 flex items-center justify-center cursor-default transition-all shadow-md"
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center font-mono-custom font-bold text-xs"
                style={{
                  backgroundColor: exp2022.logoBg || "#0A1D20",
                  color: exp2022.logoColor || "#06B6D4",
                }}
              >
                {exp2022.logoText || "GD"}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute top-full mt-2 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-black/95 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-white z-40 pointer-events-none shadow-lg">
                <span className="font-semibold text-[#EDEDEA]">{exp2022.company}</span>
                <span className="text-[#8A8A85] text-[9px]">{exp2022.role} • 2022–2026</span>
              </div>
            </motion.div>
          )}

          {/* Card 3: 2023 (Meteorite) - Grey squircle card ABOVE the line */}
          {exp2023 && (
            <motion.div
              style={{
                left: `${yearCoords[2023]}px`,
                top: "82px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ scale: 1.08 }}
              className="absolute group w-11 h-11 rounded-xl border border-white/10 bg-[#121214] hover:border-white/30 flex items-center justify-center cursor-default transition-all shadow-md"
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center font-mono-custom font-bold text-xs"
                style={{
                  backgroundColor: exp2023.logoBg || "#1C1C1E",
                  color: exp2023.logoColor || "#FFFFFF",
                }}
              >
                {exp2023.logoText || "LA"}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-black/95 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-white z-40 pointer-events-none shadow-lg">
                <span className="font-semibold text-[#EDEDEA]">{exp2023.company}</span>
                <span className="text-[#8A8A85] text-[9px]">{exp2023.role} • 2022–2023</span>
              </div>
            </motion.div>
          )}

          {/* Card 4: 2024 (Bloop) - Grey card ABOVE the line */}
          {exp2024 && (
            <motion.div
              style={{
                left: `${yearCoords[2024]}px`,
                top: "48px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute w-[190px] rounded-2xl border border-white/10 bg-[#121214] p-3 shadow-md hover:border-white/25 transition-all cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 shadow-sm"
                  style={{
                    backgroundColor: exp2024.logoBg || "#1E122A",
                    color: exp2024.logoColor || "#A855F7",
                  }}
                >
                  {exp2024.logoText || "hd"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-white tracking-tight truncate">
                    {exp2024.company}
                  </h4>
                  <p className="text-[10px] text-[#8A8A85] tracking-tight truncate">
                    {exp2024.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono-custom text-[#8A8A85]">
                <Calendar className="w-2.5 h-2.5 text-[#8A8A85] shrink-0" />
                <span>{exp2024.period}</span>
              </div>
            </motion.div>
          )}

          {/* Card 5: 2026 (Skyclad Ventures) - Grey card ABOVE the line */}
          {exp2026 && (
            <motion.div
              style={{
                left: `${yearCoords[2026]}px`,
                top: "48px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute w-[190px] rounded-2xl border border-white/10 bg-[#121214] p-3 shadow-md hover:border-white/25 transition-all cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 shadow-sm"
                  style={{
                    backgroundColor: exp2026.logoBg || "#0F281E",
                    color: exp2026.logoColor || "#10B981",
                  }}
                >
                  {exp2026.logoText || "WW"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-white tracking-tight truncate">
                    {exp2026.company}
                  </h4>
                  <p className="text-[10px] text-[#8A8A85] tracking-tight truncate">
                    {exp2026.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono-custom text-[#8A8A85]">
                <Calendar className="w-2.5 h-2.5 text-[#8A8A85] shrink-0" />
                <span className="capitalize">{exp2026.period}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
