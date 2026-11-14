"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { experiences } from "@/data/experience";

export default function TimelineView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Distinct experiences fetched by ID
  const skycladExp = experiences.find((e) => e.id === "skyclad");
  const bloopExp = experiences.find((e) => e.id === "bloop");
  const meteoriteExp = experiences.find((e) => e.id === "meteorite");
  const iiitExp = experiences.find((e) => e.id === "iiit");

  // Timeline coordinate configuration matching user wireframe (media_1794526993896_4f3a48bd.png)
  const timelineWidth = 1750; // px
  const yLine = 200; // Y position of the horizontal axis
  const canvasHeight = 420; // px

  // Specific marker coordinates along the axis line
  const xCoords = {
    y2021: 60,
    y2022: 160, // Left boundary of IIIT
    y2023: 260,
    y2024: 360,
    y2025: 460,
    mJan: 560, // Meteorite start
    mFeb: 760, // Meteorite end (width: 200px)
    mJune: 870, // Bloop start
    mAug: 1090, // Bloop end (width: 220px)
    mDec: 1200, // Skyclad start
    y2026: 1280,
    mMay: 1460, // IIIT end (width: 1300px)
    mJune26: 1530,
    y2027: 1650,
  };

  // Markers on the timeline: Solid Filled Circles for years, Solid Filled Diamonds for months
  const markers = [
    { label: "2021", x: xCoords.y2021, type: "circle" },
    { label: "2022", x: xCoords.y2022, type: "circle" },
    { label: "2023", x: xCoords.y2023, type: "circle" },
    { label: "2024", x: xCoords.y2024, type: "circle" },
    { label: "2025", x: xCoords.y2025, type: "circle" },
    { label: "Jan", x: xCoords.mJan, type: "diamond" },
    { label: "Feb", x: xCoords.mFeb, type: "diamond" },
    { label: "June", x: xCoords.mJune, type: "diamond" },
    { label: "Aug", x: xCoords.mAug, type: "diamond" },
    { label: "Dec", x: xCoords.mDec, type: "diamond" },
    { label: "2026", x: xCoords.y2026, type: "circle" },
    { label: "May", x: xCoords.mMay, type: "diamond" },
    { label: "June", x: xCoords.mJune26, type: "diamond" },
    { label: "2027", x: xCoords.y2027, type: "circle" },
  ];

  // Scroll to active span on initial load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 280;
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

  // Card component strictly matching Headout design & user wireframe
  // Outer capsule is rounded-2xl; Inner logo box has rounded-md (border-md) only as requested
  const WireframeCard = ({
    logo,
    logoBg,
    logoColor,
    logoText,
    title,
    subtitle,
    className = "",
    style,
  }: {
    logo?: string;
    logoBg?: string;
    logoColor?: string;
    logoText?: string;
    title: string;
    subtitle: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <motion.div
      style={style}
      whileHover={{ y: -2 }}
      className={`group flex items-center gap-3 px-3.5 py-2 rounded-lg border border-white/10 bg-[#111113] shadow-md hover:border-white/25 hover:bg-[#161619] transition-all select-none cursor-default overflow-hidden ${className}`}
    >
      {/* Left Image Box with rounded-md (border-md) only */}
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center font-mono-custom text-xs font-bold shrink-0 overflow-hidden shadow-sm border border-white/10 bg-black/40"
        style={{
          backgroundColor: logoBg || "#1A1A1A",
          color: logoColor || "#EDEDEA",
        }}
      >
        {logo ? (
          <img src={logo} alt={title} className="w-full h-full object-cover rounded-md" />
        ) : (
          <span>{logoText}</span>
        )}
      </div>

      {/* Title & Period / Role matching Headout structure */}
      <div className="min-w-0 flex-1 pr-1 text-left">
        <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate leading-tight font-sans">
          {title}
        </h4>
        <p className="text-[10px] sm:text-[11px] text-[#8A8A85] tracking-tight truncate leading-tight mt-0.5 font-inter">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full my-3">
      {/* Scrollable Timeline Canvas */}
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
        <div style={{ width: `${timelineWidth}px` }} className="relative h-[420px]">
          {/* ========================================================== */}
          {/* 1. ARCHITECTURAL VERTICAL DASHED LINES (FADING TOP/BOTTOM) */}
          {/* ========================================================== */}

          {/* Above axis lines (Fading out towards the top) */}
          {[xCoords.mJan, xCoords.mFeb, xCoords.mJune, xCoords.mAug, xCoords.mDec].map(
            (xPos, idx) => (
              <div
                key={`top-line-${idx}`}
                style={{
                  left: `${xPos}px`,
                  top: "0px",
                  height: `${yLine}px`,
                  maskImage: "linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                }}
                className="absolute w-0 border-l border-dashed border-white/25 pointer-events-none"
              />
            )
          )}

          {/* Below axis lines (Fading out towards the bottom) */}
          {[xCoords.y2022, xCoords.mMay].map((xPos, idx) => (
            <div
              key={`bottom-line-${idx}`}
              style={{
                left: `${xPos}px`,
                top: `${yLine}px`,
                height: `${canvasHeight - yLine}px`,
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
              }}
              className="absolute w-0 border-l border-dashed border-white/25 pointer-events-none"
            />
          ))}

          {/* ========================================================== */}
          {/* 2. MAIN HORIZONTAL AXIS LINE                               */}
          {/* ========================================================== */}
          <div
            style={{
              left: "40px",
              width: `${xCoords.y2027 - 40 + 50}px`,
              top: `${yLine}px`,
            }}
            className="absolute h-[2px] bg-white/20 rounded-full pointer-events-none"
          />

          {/* ========================================================== */}
          {/* 3. AXIS MARKERS (SOLID FILLED CIRCLES & DIAMONDS)          */}
          {/* ========================================================== */}
          {markers.map((m, i) => (
            <div
              key={i}
              style={{ left: `${m.x}px` }}
              className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
            >
              {/* Marker shape on the axis line (SOLID FILLED) */}
              <div
                style={{ top: `${yLine}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
              >
                {m.type === "diamond" ? (
                  // Solid filled grey diamond marker for months (same color as date, no glow)
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#8A8A85]" />
                ) : (
                  // Solid filled grey circular dot for years (same color as date, no glow)
                  <div className="w-3 h-3 rounded-full bg-[#8A8A85]" />
                )}
              </div>

              {/* Inter Monospace Label below the line */}
              <span
                style={{ top: `${yLine + 14}px` }}
                className="absolute -translate-x-1/2 font-mono-custom text-[11px] text-[#8A8A85] whitespace-nowrap select-none tracking-tight font-medium"
              >
                {m.label}
              </span>
            </div>
          ))}

          {/* ========================================================== */}
          {/* 4. WORK EXPERIENCE CARDS ABOVE THE LINE (MATCHING SKETCH)  */}
          {/* ========================================================== */}

          {/* Card 1: Meteorite (Spans from Jan to Feb 2025) */}
          {meteoriteExp && (
            <WireframeCard
              logo={meteoriteExp.image || "/meteorite.jpg"}
              logoBg={meteoriteExp.logoBg}
              logoColor={meteoriteExp.logoColor}
              logoText={meteoriteExp.logoText}
              title={meteoriteExp.company}
              subtitle="Jan – Feb 2025"
              className="absolute z-20"
              style={{
                left: `${xCoords.mJan}px`,
                width: `${xCoords.mFeb - xCoords.mJan}px`,
                top: "92px",
                height: "56px",
              }}
            />
          )}

          {/* Card 2: Bloop (Spans from June to Aug 2025) */}
          {bloopExp && (
            <WireframeCard
              logo={bloopExp.image}
              logoBg={bloopExp.logoBg || "#2A124D"}
              logoColor={bloopExp.logoColor || "#A855F7"}
              logoText={bloopExp.logoText || "BL"}
              title={bloopExp.company}
              subtitle="June – Aug 2025"
              className="absolute z-20"
              style={{
                left: `${xCoords.mJune}px`,
                width: `${xCoords.mAug - xCoords.mJune}px`,
                top: "92px",
                height: "56px",
              }}
            />
          )}

          {/* Card 3: Skyclad Ventures (Spans from Dec 2025 across 2026+) */}
          {skycladExp && (
            <WireframeCard
              logo={skycladExp.image || "/skyclad_ventures.jpg"}
              logoBg={skycladExp.logoBg || "#0F281E"}
              logoColor={skycladExp.logoColor || "#10B981"}
              logoText={skycladExp.logoText || "SV"}
              title={skycladExp.company}
              subtitle="2025 – Present"
              className="absolute z-20"
              style={{
                left: `${xCoords.mDec}px`,
                width: `${1620 - xCoords.mDec}px`,
                top: "92px",
                height: "56px",
              }}
            />
          )}

          {/* ========================================================== */}
          {/* 5. IIIT JABALPUR CARD BELOW THE LINE (SPANS 2022 TO MAY)  */}
          {/* ========================================================== */}
          {iiitExp && (
            <WireframeCard
              logo={iiitExp.image || "/iiitdmj.jpg"}
              logoBg={iiitExp.logoBg || "#083337"}
              logoColor={iiitExp.logoColor || "#06B6D4"}
              logoText={iiitExp.logoText || "IIIT"}
              title="IIIT Jabalpur"
              subtitle="Bachelor of Technology • 2022–2026"
              className="absolute z-20"
              style={{
                left: `${xCoords.y2022}px`,
                width: `${xCoords.mMay - xCoords.y2022}px`,
                top: "250px",
                height: "58px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
