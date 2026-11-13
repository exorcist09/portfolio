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
    <div className="min-h-screen bg-black text-[#EDEDEA] overflow-x-clip selection:bg-[#EA580C]/25 selection:text-[#EA580C]">
      <main className="w-full max-w-[760px] mx-auto px-5 sm:px-6 py-12 sm:py-20">
        {/* Header: Back button (rounded-lg with border) beside the clean heading "Work" */}
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

        {/* Project Cards: Image pops out from the BACK of the card */}
        <div className="space-y-4 sm:space-y-5">
          {projects.map((project: Project) => (
            <div
              key={project.id}
              className="relative group z-10 hover:z-30"
            >
              {/* Pop-Out Image: Sits physically BEHIND the card (-z-10) and slides out from behind the right edge */}
              {project.image && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 -z-10 transition-all duration-300 ease-out opacity-0 scale-95 translate-x-0 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-[calc(100%-20px)] group-hover:pointer-events-auto"
                  aria-label={`Preview of ${project.title}`}
                  title={`Open ${project.title}`}
                >
                  <div className="w-52 sm:w-60 md:w-64 aspect-[4/3] rounded-xl overflow-hidden border border-white/20 bg-[#121214] shadow-2xl shadow-black/90 hover:border-white/40 transition-colors">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </a>
              )}

              {/* Front Card Container: Sits in front of the image with solid background & border */}
              <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-[#0E0E0E] hover:bg-[#141414] hover:border-white/20 p-5 sm:p-6 transition-all duration-200 select-none shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side: Category, Title, Description, Tech Stack */}
                  <div className="space-y-2 text-left flex-1 max-w-xl">
                    <span className="text-[10px] font-mono-custom uppercase tracking-wider text-[#8A8A85]">
                      {project.category}
                    </span>

                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#EDEDEA] group-hover:text-white transition-colors">
                      {project.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed">
                      {project.description}
                    </p>

                    {project.techStack && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono-custom px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#8A8A85]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Action Links */}
                  <div className="flex items-center gap-2 shrink-0 self-start">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer"
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
                      className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer"
                      aria-label={`Live site for ${project.title}`}
                      title="Open Live Deployment"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
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
