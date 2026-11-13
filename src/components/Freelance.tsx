"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { freelanceData, FreelanceService } from "@/data/freelance";

export default function Freelance() {
  return (
    <section id="freelance" className="py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6">
      {/* Consistent Left-Aligned Header + Availability Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
            FREELANCE
          </span>
        </div>

        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
          crafting for clients
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8A8A85] leading-relaxed max-w-xl">
          {freelanceData.description}
        </p>
      </motion.div>

      {/* Services List / Cards */}
      <div className="space-y-4">
        {freelanceData.services.map((service: FreelanceService) => (
          <div
            key={service.id}
            className="group block rounded-2xl border border-white/[0.08] bg-[#0E0E0E] hover:bg-[#141414] hover:border-white/20 p-5 sm:p-6 transition-all duration-200 select-none shadow-sm"
          >
            {/* Top row: Category & Timeline */}
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono-custom text-[#8A8A85] mb-2.5">
              <span className="uppercase tracking-wider text-[#8A8A85]/80">
                {service.category}
              </span>
              {/* <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#EDEDEA]/70">
                <Clock className="w-3 h-3 text-[#EA580C]" />
                <span>{service.timeline}</span>
              </span> */}
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-[#EDEDEA] group-hover:text-white transition-colors">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed">
                {service.description}
              </p>
            </div>
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

