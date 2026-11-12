"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListView from "./experience/ListView";
import TimelineView from "./experience/TimelineView";

export default function Experience() {
  const [activeTab, setActiveTab] = useState<"list" | "timeline">("timeline");

  return (
    <section
      id="experience"
      className="py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6"
    >
      {/* Consistent Left-Aligned Header + Right-Aligned Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 text-left">
        <div>
          <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
            EXPERIENCE
          </span>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
            where I have stayed
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#8A8A85]">
            Work history, timeline, and core product engineering roles.
          </p>
        </div>

        {/* Toggle Pill + Active Pill Fill */}
        <div className="relative flex items-center self-start sm:self-auto pt-2 sm:pt-0">
          <div className="relative flex items-center p-1 rounded-full bg-[#121212] border border-white/[0.08] shadow-inner">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`relative px-4 py-1.5 text-xs font-mono-custom rounded-full transition-colors cursor-pointer select-none ${
                activeTab === "timeline"
                  ? "text-black font-semibold"
                  : "text-[#8A8A85] hover:text-[#EDEDEA]"
              }`}
              aria-label="Timeline view"
            >
              {activeTab === "timeline" && (
                <motion.div
                  layoutId="experience-toggle-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">timeline</span>
            </button>

            <button
              onClick={() => setActiveTab("list")}
              className={`relative px-4 py-1.5 text-xs font-mono-custom rounded-full transition-colors cursor-pointer select-none ${
                activeTab === "list"
                  ? "text-black font-semibold"
                  : "text-[#8A8A85] hover:text-[#EDEDEA]"
              }`}
              aria-label="List view"
            >
              {activeTab === "list" && (
                <motion.div
                  layoutId="experience-toggle-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">list</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Switch with Animation */}
      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <ListView />
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <TimelineView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom "+ know more" button: visible in timeline mode, hidden in list mode */}
      {activeTab === "timeline" && (
        <div className="mt-8 text-center select-none">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className="font-handwriting text-xl sm:text-2xl text-[#EA580C] hover:text-orange-400 transition-colors cursor-pointer select-none"
          >
            + know more
          </button>
        </div>
      )}
    </section>
  );
}
