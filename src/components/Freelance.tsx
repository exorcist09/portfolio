"use client";

import { motion } from "framer-motion";
import { freelanceData, FreelanceService } from "@/data/freelance";

export default function Freelance() {
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

      {/* Services List with Tree Connector Branches matching wireframe (media_1794528517668_0d5f0445.png) */}
      <div className="relative pl-7 sm:pl-9">
        {freelanceData.services.map((service: FreelanceService, idx: number) => {
          const isFirst = idx === 0;
          const isLast = idx === freelanceData.services.length - 1;

          return (
            <div key={service.id} className="relative mb-4 last:mb-0">
              {/* Vertical Spine: runs continuously through cards 1 & 2; omitted on last card so nothing overshoots */}
              {!isLast && (
                <div
                  className="absolute -left-7 sm:-left-9 w-0 border-l border-white/25 pointer-events-none"
                  style={{
                    top: isFirst ? "-1.75rem" : "-1rem",
                    bottom: "-1rem",
                  }}
                />
              )}

              {/* Curved Branch Connector: on cards 1 & 2 branches off the spine; on the last card forms the terminal curve itself */}
              <div
                className="absolute -left-7 sm:-left-9 w-7 sm:w-9 border-b border-l border-white/25 rounded-bl-2xl pointer-events-none"
                style={{
                  top: isLast ? "-1rem" : "calc(50% - 1.5rem)",
                  height: isLast ? "calc(50% + 1rem)" : "1.5rem",
                }}
              />

              {/* Card Container */}
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className="group block rounded-2xl border border-white/10 bg-[#0E0E0E] hover:bg-[#141414] hover:border-white/20 p-5 sm:p-6 transition-all duration-200 select-none shadow-sm"
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
          );
        })}
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

