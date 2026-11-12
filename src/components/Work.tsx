"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/projects";
import FolderCard from "./FolderCard";

export default function Work() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6">
      {/* Consistent Left-Aligned Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-left"
      >
        <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
          WORK
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
          selected projects
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#8A8A85]">
          Selected works across design systems, creative technology, and product engineering.
        </p>
      </motion.div>

      {/* Exactly 2 Featured macOS-style Folder Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
        {featuredProjects.map((project) => (
          <FolderCard key={project.id} project={project} />
        ))}
      </div>

      {/* Secondary Projects: Text cards with right-side link and tech stack below name */}
      {otherProjects.length > 0 && (
        <div className="mt-8 space-y-3.5">
          {otherProjects.map((project) => (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/[0.08] bg-[#0E0E0E] hover:bg-[#151515] hover:border-white/20 p-5 transition-all duration-200 select-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side: Name, description, and tech stack */}
                <div className="space-y-2 flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#EDEDEA] group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A8A85] mt-0.5">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Tech stack used below the name */}
                  {project.techStack && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono-custom px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[#8A8A85]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Arrow link button */}
                 <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#8A8A85] group-hover:text-white group-hover:border-white/30 group-hover:bg-white/[0.1] transition-all shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#8A8A85] group-hover:text-white group-hover:border-white/30 group-hover:bg-white/[0.1] transition-all shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Bottom "+ more .." button without borders */}
      <div className="mt-8 text-center select-none">
        <button
          type="button"
          className="font-handwriting text-xl sm:text-2xl text-[#EA580C] hover:text-orange-400 transition-colors cursor-pointer select-none"
        >
          + more ..
        </button>
      </div>
    </section>
  );
}
