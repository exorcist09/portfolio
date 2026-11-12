"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { experiences, ExperienceItem } from "@/data/experience";

export default function TimelineView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Distinct experiences fetched by ID to guarantee ZERO duplication
  const skycladExp = experiences.find((e) => e.id === "skyclad");
  const bloopExp = experiences.find((e) => e.id === "bloop");
  const meteoriteExp = experiences.find((e) => e.id === "meteorite");
  const iiitExp = experiences.find((e) => e.id === "iiit");

  // Timeline coordinate configuration:
  // Empty years (2020-2021) are SHORT/compressed.
  // Active years (2025-2026) are EXPANDED with months (Jan, Jun, Dec, May).
  const timelineWidth = 1180; // px
  const yLine = 175; // Y position of the horizontal axis

  // Compressed early years, expanded milestone years
  const yearMarks = [
    { label: "2020", x: 50, isYear: true },
    { label: "2021", x: 105, isYear: true }, // 55px gap (short/compact)
    { label: "2022", sub: "Nov", x: 175, isYear: true }, // 70px gap (IIIT begins)
    { label: "2023", x: 280, isYear: true }, // 105px gap
    { label: "2024", x: 385, isYear: true }, // 105px gap
    // 2025: EXPANDED WITH MONTHS for each internship
    { label: "2025", sub: "Jan", x: 500, isYear: true, isMonth: true }, // Meteorite (Jan-Feb)
    { label: "Jun – Aug", x: 690, isMonth: true }, // Bloop (Jun-Aug)
    { label: "Dec", x: 880, isMonth: true }, // Skyclad (Dec)
    // 2026: Graduation & Present
    { label: "2026", sub: "May", x: 980, isYear: true, isMonth: true }, // IIIT graduation
    { label: "Now", x: 1020, isCurrent: true },
  ];

  const xIIITStart = 175; // Nov 2022
  const xIIITEnd = 980; // May 2026
  const xMeteorite = 500; // Jan 2025
  const xBloop = 690; // Jun - Aug 2025
  const xSkyclad = 880; // Dec 2025 - Present

  // Scroll to focus on active years on initial load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 200;
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

  // Reusable Timeline Card Component matching user reference image
  const TimelineCard = ({
    exp,
    className = "",
  }: {
    exp: ExperienceItem;
    className?: string;
  }) => (
    <div
      className={`group flex items-center gap-3 p-2.5 px-3.5 rounded-2xl border border-white/10 bg-[#121214] shadow-md hover:border-white/25 transition-all select-none ${className}`}
    >
      {/* Squircle Icon / Image */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 overflow-hidden shadow-sm border border-white/10"
        style={{
          backgroundColor: exp.logoBg || "#1A1A1A",
          color: exp.logoColor || "#EDEDEA",
        }}
      >
        {exp.image ? (
          <img
            src={exp.image}
            alt={exp.company}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{exp.logoText}</span>
        )}
      </div>

      {/* Company Name & Role (Clean 2-line layout without date clutter) */}
      <div className="min-w-0 pr-1 text-left">
        <h4 className="text-sm font-semibold text-white tracking-tight truncate leading-tight">
          {exp.company}
        </h4>
        <p className="text-xs text-[#8A8A85] tracking-tight truncate leading-tight mt-0.5">
          {exp.role}
        </p>
      </div>
    </div>
  );

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
        <div style={{ width: `${timelineWidth}px` }} className="relative h-[325px]">
          {/* ========================================================== */}
          {/* 1. HORIZONTAL AXIS LINE (SOLID GREY & DASHED FUTURE RAIL)  */}
          {/* ========================================================== */}
          {/* Solid grey line across active timeline (2020 to Now) */}
          <div
            style={{
              left: "50px",
              width: `${1020 - 50}px`,
              top: `${yLine}px`,
            }}
            className="absolute h-[2px] bg-white/20 rounded-full pointer-events-none"
          />

          {/* Dashed grey future extension with arrow */}
          <div
            style={{
              left: "1020px",
              width: "110px",
              top: `${yLine}px`,
            }}
            className="absolute h-0 border-t-2 border-dashed border-white/20 pointer-events-none flex items-center justify-end"
          >
            <span className="text-[#8A8A85] text-xs font-mono-custom -mr-1.5 -mt-[1px] select-none">
              ▸
            </span>
          </div>

          {/* ========================================================== */}
          {/* 2. LEADER STEMS (UP & DOWN) TO MONTH POSITIONS             */}
          {/* ========================================================== */}

          {/* Stem for Meteorite: Jan 2025 (UP to top: 38px) */}
          {meteoriteExp && (
            <div
              style={{
                left: `${xMeteorite}px`,
                top: "90px",
                height: `${yLine - 90}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* Stem for Bloop: Jun–Aug 2025 (DOWN to top: 104px) */}
          {bloopExp && (
            <div
              style={{
                left: `${xBloop}px`,
                top: "156px",
                height: `${yLine - 156}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* Stem for Skyclad Ventures: Dec 2025 (UP to top: 38px) */}
          {skycladExp && (
            <div
              style={{
                left: `${xSkyclad}px`,
                top: "90px",
                height: `${yLine - 90}px`,
              }}
              className="absolute w-[1.5px] bg-white/20 -translate-x-[0.5px] pointer-events-none"
            />
          )}

          {/* Stems & Rail for IIITDMJ: Spanning full from Nov 2022 to May 2026 */}
          {iiitExp && (
            <>
              {/* Left stem at Nov 2022 dropping down to IIIT track */}
              <div
                style={{
                  left: `${xIIITStart}px`,
                  top: `${yLine}px`,
                  height: "56px",
                }}
                className="absolute w-[1.5px] bg-cyan-500/30 -translate-x-[0.5px] pointer-events-none"
              />
              {/* Right stem at May 2026 dropping down to IIIT track */}
              <div
                style={{
                  left: `${xIIITEnd}px`,
                  top: `${yLine}px`,
                  height: "56px",
                }}
                className="absolute w-[1.5px] bg-cyan-500/30 -translate-x-[0.5px] pointer-events-none"
              />
              {/* Academic Span Bar from Nov 2022 to May 2026 */}
              <div
                style={{
                  left: `${xIIITStart}px`,
                  width: `${xIIITEnd - xIIITStart}px`,
                  top: "231px",
                }}
                className="absolute h-[2px] bg-cyan-500/30 rounded-full pointer-events-none"
              />
              {/* Left terminal dot at Nov 2022 */}
              <div
                style={{ left: `${xIIITStart}px`, top: "231px" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#06B6D4] ring-2 ring-black"
              />
              {/* Right terminal dot at May 2026 */}
              <div
                style={{ left: `${xIIITEnd}px`, top: "231px" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#06B6D4] ring-2 ring-black"
              />
            </>
          )}

          {/* ========================================================== */}
          {/* 3. YEAR & EXPANDED MONTH TICKS & LABELS                    */}
          {/* ========================================================== */}
          {yearMarks.map((mark, i) => {
            const isMilestone = [175, 500, 690, 880, 980].includes(mark.x);

            return (
              <div
                key={i}
                style={{ left: `${mark.x}px` }}
                className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
              >
                {/* Milestone Dot on the line */}
                <div
                  style={{ top: `${yLine}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  {mark.isCurrent ? (
                    // Now (Current Beacon)
                    <div className="relative flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full border border-white/30 bg-[#161616]" />
                      <span className="absolute w-2 h-2 rounded-full bg-[#10B981]" />
                    </div>
                  ) : isMilestone ? (
                    // Milestone Dot (White filled center)
                    <div className="w-3 h-3 rounded-full border border-white/25 bg-[#141416] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    </div>
                  ) : (
                    // Subtle intermediate tick
                    <div className="w-2 h-2 rounded-full bg-white/25" />
                  )}
                </div>

                {/* Primary Label below the line (Year / Month) */}
                <div
                  style={{ top: `${yLine + 12}px` }}
                  className="absolute -translate-x-1/2 flex flex-col items-center whitespace-nowrap select-none"
                >
                  <span
                    className={`font-mono-custom text-[11px] ${
                      mark.isCurrent
                        ? "text-[#10B981] font-semibold"
                        : mark.isMonth
                        ? "text-[#EDEDEA]/90 font-medium"
                        : "text-[#8A8A85]"
                    }`}
                  >
                    {mark.label}
                  </span>

                  {/* Sub-month badge if applicable (e.g. Nov '22, Jan '25, May '26) */}
                  {mark.sub && (
                    <span className="font-mono-custom text-[9px] text-[#8A8A85]/70 -mt-0.5">
                      {mark.sub}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* ========================================================== */}
          {/* 4. WORK EXPERIENCE CARDS (MATCHING REFERENCE IMAGE)        */}
          {/* ========================================================== */}

          {/* Card 1: Meteorite (Jan 2025) - Staggered UP (top: 38px) */}
          {meteoriteExp && (
            <motion.div
              style={{
                left: `${xMeteorite}px`,
                top: "38px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute"
            >
              <TimelineCard exp={meteoriteExp} className="w-[195px]" />
            </motion.div>
          )}

          {/* Card 2: Bloop (Jun–Aug 2025) - Staggered DOWN (top: 104px) */}
          {bloopExp && (
            <motion.div
              style={{
                left: `${xBloop}px`,
                top: "104px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute"
            >
              <TimelineCard exp={bloopExp} className="w-[195px]" />
            </motion.div>
          )}

          {/* Card 3: Skyclad Ventures (Dec 2025) - Staggered UP (top: 38px) */}
          {skycladExp && (
            <motion.div
              style={{
                left: `${xSkyclad}px`,
                top: "38px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute"
            >
              <TimelineCard exp={skycladExp} className="w-[195px]" />
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* 5. IIITDMJ: SPANNING FULL FROM NOV 2022 TO MAY 2026        */}
          {/* ========================================================== */}
          {iiitExp && (
            <motion.div
              style={{
                left: `${(xIIITStart + xIIITEnd) / 2}px`,
                top: "244px",
                transform: "translateX(-50%)",
              }}
              whileHover={{ y: -2 }}
              className="absolute"
            >
              <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl border border-cyan-500/25 bg-[#0A181C]/95 backdrop-blur-md shadow-md hover:border-cyan-500/50 transition-all select-none w-[440px] sm:w-[480px]">
                {/* Logo / Image */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 overflow-hidden shadow-sm border border-cyan-500/30"
                  style={{
                    backgroundColor: iiitExp.logoBg || "#083337",
                    color: iiitExp.logoColor || "#06B6D4",
                  }}
                >
                  {iiitExp.image ? (
                    <img
                      src={iiitExp.image}
                      alt={iiitExp.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{iiitExp.logoText || "IIIT"}</span>
                  )}
                </div>

                {/* Company & Role */}
                <div className="min-w-0 flex-1 pr-1 text-left">
                  <h4 className="text-sm font-semibold text-white tracking-tight truncate leading-tight">
                    {iiitExp.company}
                  </h4>
                  <p className="text-xs text-[#8A8A85] tracking-tight truncate leading-tight mt-0.5">
                    {iiitExp.role}
                  </p>
                </div>

                {/* Duration Badge spanning Nov 2022 to May 2026 */}
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#06B6D4] font-mono-custom text-[10px] shrink-0 whitespace-nowrap">
                  2022 — 2026
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
