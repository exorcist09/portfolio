"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experiences, ExperienceItem } from "@/data/experience";

export default function ListView() {
  // First item (active) expanded by default
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || "skyclad");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative w-full mt-6">
      {/* Continuous vertical timeline line connecting center of company logo tiles */}
      <div className="absolute left-[17px] sm:left-[19px] top-8 bottom-6 w-[1px] bg-white/[0.08]" />

      <div className="space-y-4">
        {experiences.map((exp: ExperienceItem) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div key={exp.id} className="relative group">
              {/* Timeline row header */}
              <div
                onClick={() => toggleExpand(exp.id)}
                className="flex items-center justify-between gap-4 cursor-pointer select-none rounded-xl py-2 px-1 hover:bg-white/[0.02] transition-colors w-full"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(exp.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Logo square tile */}
                  <div
                    className={`relative z-10 shrink-0 w-8 h-8 sm:w-9 sm:h-9 ${exp.id === "iiit" ? "rounded-lg" : "rounded-xl"
                      } flex items-center justify-center font-mono-custom text-xs font-bold border border-white/[0.08] shadow-md overflow-hidden`}
                    style={{ backgroundColor: exp.logoBg, color: exp.logoColor }}
                  >
                    {exp.image ? (
                      <img
                        src={exp.image}
                        alt={exp.company}
                        className={`w-full h-full object-cover ${exp.id === "iiit" ? "rounded-lg" : ""
                          }`}
                      />
                    ) : (
                      exp.logoText
                    )}
                  </div>

                  {/* Company & Role */}
                  <div className="truncate">
                    <h3 className="text-sm sm:text-base font-semibold text-[#EDEDEA] group-hover:text-white transition-colors truncate">
                      {exp.company}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A8A85] truncate">
                      {exp.role}
                    </p>
                  </div>
                </div>

                {/* Period & Chevron */}
                <div className="flex items-center gap-2 text-right shrink-0">
                  <span className="text-[11px] sm:text-xs text-[#8A8A85]">
                    {exp.period}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#8A8A85] group-hover:text-white"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
              </div>

              {/* Expandable details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden pl-11 sm:pl-13 pr-2 pt-1 pb-3 text-xs sm:text-sm text-[#8A8A85] space-y-2.5"
                  >
                    {exp.description && (
                      <p className="leading-relaxed text-[#EDEDEA]/90">
                        {exp.description}
                      </p>
                    )}

                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0 select-none" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

