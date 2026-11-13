"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects, Project } from "@/data/projects";

export default function WorkPage() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] selection:bg-[#EA580C]/25 selection:text-[#EA580C]">
      <main className="w-full max-w-[760px] mx-auto px-5 sm:px-6 py-12 sm:py-20">
        {/* Header: Back button (rounded-lg with border) beside the clean heading "WORK" */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-10">
          <Link
            href="/"
            onClick={handleBack}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/15 bg-[#0E0E0E] hover:bg-[#181818] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer group shrink-0"
            aria-label="Back to home page"
            title="Back to home"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
          </Link>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
            Work
          </h1>
        </div>

        {/* Project List: All written similar, no highlighted cards, no side borders, only top and bottom, no rounded */}
        <div className="border-t border-white/[0.1]">
          {projects.map((project: Project) => (
            <div
              key={project.id}
              className="border-b border-white/[0.1] py-6 sm:py-7 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors hover:bg-white/[0.02]"
            >
              {/* Left Side: Category, Title, Description, Tech Stack */}
              <div className="space-y-2 flex-1 text-left">
                <span className="text-[10px] font-mono-custom uppercase tracking-wider text-[#8A8A85]">
                  {project.category}
                </span>

                <h2 className="text-lg sm:text-xl font-semibold text-[#EDEDEA]">
                  {project.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed max-w-xl">
                  {project.description}
                </p>

                {project.techStack && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono-custom px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] text-[#8A8A85]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Links */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer"
                    aria-label={`GitHub repo for ${project.title}`}
                    title="View Source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer"
                  aria-label={`Live site for ${project.title}`}
                  title="Open Live Deployment"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Book / Work Together */}
        <div className="mt-14 text-center select-none pt-8">
          <Link
            href="/work-together"
            className="font-handwriting text-xl sm:text-2xl text-[#EA580C] hover:text-orange-400 transition-colors cursor-pointer select-none inline-block"
          >
            + work together ..
          </Link>
        </div>
      </main>
    </div>
  );
}
