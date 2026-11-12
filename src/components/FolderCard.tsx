"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";

export default function FolderCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  const theme = project.gradientTheme || {
    tabFrom: "#1E344F",
    tabTo: "#152538",
    bodyFrom: "#1E344F",
    bodyVia: "#16273B",
    bodyTo: "#0F1A28",
    accentGlow: "rgba(30, 52, 79, 0.15)",
  };

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`View featured project: ${project.title}`}
    >
      {/* Bigger, taller folder with generous proportion */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] min-h-[270px] sm:min-h-[300px] select-none [perspective:1000px]">
        {/* Soft, subtle matte ambient shadow */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-20 blur-xl pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: theme.accentGlow }}
        />

        {/* Back Tab Shape (Top Left Folder Tab) - Matte finish */}
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.tabFrom} 0%, ${theme.tabTo} 100%)`,
          }}
          className="absolute top-0 left-0 w-36 sm:w-44 h-12 rounded-t-2xl border-t border-l border-r border-white/[0.12] shadow-sm"
        />

        {/* Back Body (Behind front flap) - Matte finish */}
        <div
          style={{
            background: `linear-gradient(180deg, ${theme.tabTo} 0%, ${theme.bodyTo} 100%)`,
          }}
          className="absolute top-5 inset-x-0 bottom-0 rounded-2xl sm:rounded-3xl border border-white/[0.08] shadow-inner"
        />

        {/* Peeking Document / Paper Sheet on Hover */}
        <motion.div
          animate={{
            y: isHovered ? -18 : 0,
            rotate: isHovered ? -1.5 : 0,
            scale: isHovered ? 0.97 : 0.95,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="absolute top-3 inset-x-5 h-28 rounded-t-xl bg-[#EBEBE8] text-[#1A1A1A] p-3.5 shadow-md pointer-events-none border border-black/10"
        >
          <div className="flex items-center justify-between text-[10px] font-mono-custom text-[#666666]">
            <span>README.md</span>
            <span className="text-[#1A1A1A] font-semibold">CLICK TO READ ↗</span>
          </div>
        </motion.div>

        {/* Front Folder Flap - Matte architectural texture with clean, uncluttered layout */}
        <motion.div
          animate={{
            y: isHovered ? 4 : 0,
            rotateX: isHovered ? -5 : 0,
            scale: isHovered ? 1.01 : 1,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          style={{
            background: `linear-gradient(180deg, ${theme.bodyFrom} 0%, ${theme.bodyVia} 50%, ${theme.bodyTo} 100%)`,
            boxShadow: isHovered
              ? "0 22px 40px -12px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
              : "0 12px 28px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
          className="absolute top-8 inset-x-0 bottom-0 rounded-2xl sm:rounded-3xl border border-white/[0.14] p-6 sm:p-7 flex flex-col justify-between text-white overflow-hidden"
        >
          {/* Top Row: Category tag + subtle arrow button */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-custom tracking-[0.16em] uppercase text-[#EDEDEA]/75 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08]">
              {project.category}
            </span>

            <div className="w-8 h-8 rounded-full bg-black/25 backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-white/70 group-hover:text-white group-hover:scale-105 group-hover:border-white/30 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          </div>

          {/* Bottom Area: Clean Title & Tagline (Uncluttered, no noisy chips) */}
          <div className="space-y-1.5 pb-1">
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#EDEDEA] group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8A85] font-normal leading-relaxed line-clamp-2">
              {project.tagline}
            </p>
          </div>
        </motion.div>
      </div>
    </a>
  );
}
