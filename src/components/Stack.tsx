"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  Layers,
  Terminal,
  Palette,
  Sparkles,
  RefreshCw,
  Cpu,
  Server,
  Database,
  Zap,
  Radio,
  ShieldCheck,
  Blocks,
  Workflow,
  Box,
  Braces,
  HardDrive,
  Bot,
  Cloud,
  Shield,
  Component,
} from "lucide-react";
import { skillRows, SkillRow, SkillItem } from "@/data/skills";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Globe,
  Layers,
  Terminal,
  Palette,
  Sparkles,
  RefreshCw,
  Cpu,
  Server,
  Database,
  Zap,
  Radio,
  ShieldCheck,
  Blocks,
  Workflow,
  Box,
  Braces,
  HardDrive,
  Bot,
  Cloud,
  Shield,
  Component,
};

function SkillPill({ item }: { item: SkillItem }) {
  const IconComponent = ICON_MAP[item.iconName] || Code2;

  return (
    <div className="shrink-0 rounded-full px-4 py-2 border border-white/[0.08] bg-[#0E0E0E] hover:bg-[#161616] hover:border-white/20 text-xs font-mono-custom text-[#EDEDEA] flex items-center gap-2 select-none cursor-default transition-all shadow-sm">
      <IconComponent className="w-3.5 h-3.5 text-white stroke-[2]" />
      <span>{item.name}</span>
    </div>
  );
}

function MarqueeLine({ row }: { row: SkillRow }) {
  // Triple the items for seamless infinite marquee loop
  const repeated = [...row.items, ...row.items, ...row.items];

  return (
    <div className="relative w-full overflow-hidden py-1">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-black to-transparent z-10" />

      {/* Scrolling row */}
      <div className={row.speedClass}>
        <div className="flex items-center gap-3 pr-3">
          {repeated.map((item, idx) => (
            <SkillPill key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Stack() {
  return (
    <section id="stack" className="py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6">
      {/* Consistent Left-Aligned Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-left"
      >
        <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
          STACK
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
          what I make things with
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#8A8A85]">
          Technologies, frameworks, cloud primitives, and generative AI systems.
        </p>
      </motion.div>

      {/* Marquee Rows (Without Category Headings) */}
      <div className="space-y-4">
        {skillRows.map((row) => (
          <MarqueeLine key={row.id} row={row} />
        ))}
      </div>

      {/* Bottom "+ check .." button without borders */}
      <div className="mt-8 text-center select-none">
        <button
          type="button"
          className="font-handwriting text-xl sm:text-2xl text-[#F5A623] hover:text-amber-400 transition-colors cursor-pointer select-none"
        >
          + check ..
        </button>
      </div>
    </section>
  );
}
