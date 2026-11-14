"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SkillIcon from "@/components/SkillIcon";

interface SkillItem {
  name: string;
  slug: string;
}

export default function SkillsPage() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // 4 Primary Highlighted Tools: TypeScript, Python, Claude, Cursor
  const highlightedTools = [
    { name: "TypeScript", slug: "typescript" },
    { name: "Python", slug: "python" },
    { name: "Claude", slug: "claude" },
    { name: "Cursor", slug: "cursor" },
  ];

  // Secondary Top Tiles matching wireframe row 1 & row 2
  const secondaryRow1 = [
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React", slug: "react" },
    { name: "Node.js", slug: "nodedotjs" },
  ];

  const secondaryRow2 = [
    { name: "Docker", slug: "docker" },
    { name: "AWS", slug: "aws" },
  ];

  // 3 Columns of Skills (white logos only, no descriptions, no column headings, generous gap)
  const column1: SkillItem[] = [
    { name: "TypeScript", slug: "typescript" },
    { name: "JavaScript", slug: "javascript" },
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React.js", slug: "react" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "Zustand", slug: "zustand" },
    { name: "Redux Toolkit", slug: "redux" },
    { name: "TanStack Query", slug: "reactquery" },
    { name: "HTML5 / CSS3", slug: "html5" },
  ];

  const column2: SkillItem[] = [
    { name: "Python", slug: "python" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Express.js", slug: "express" },
    { name: "Java", slug: "java" },
    { name: "Spring Boot", slug: "springboot" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "Redis", slug: "redis" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "WebSockets", slug: "websockets" },
    { name: "Prisma ORM", slug: "prisma" },
  ];

  // Column 3: Codex and OpenAI removed as requested
  const column3: SkillItem[] = [
    { name: "Cursor", slug: "cursor" },
    { name: "Claude", slug: "claude" },
    { name: "Agentic AI", slug: "agentic-ai" },
    { name: "LangChain / Graph", slug: "langchain" },
    { name: "Docker", slug: "docker" },
    { name: "AWS", slug: "aws" },
    { name: "Linux / Bash", slug: "linux" },
    { name: "Git & GitHub", slug: "git" },
    { name: "RabbitMQ", slug: "rabbitmq" },
  ];

  // Guaranteed icons using shared SkillIcon component
  const renderIcon = (slug: string, name: string, isTop = false) => {
    const imgSize = isTop ? "w-5 h-5 sm:w-6 sm:h-6" : "w-4 h-4";
    return <SkillIcon slug={slug} name={name} className={imgSize} />;
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] selection:bg-[var(--accent)]/25 selection:text-[var(--accent)]">
      <main className="w-full max-w-[760px] mx-auto px-5 sm:px-6 py-12 sm:py-20">
        {/* Header: Back button (rounded-lg with border) beside the clean heading "Skills" (not uppercase) */}
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
            Skills
          </h1>
        </div>

        {/* Top Section matching Wireframe (media_1794551049149_9255301c.png) */}
        <div className="mb-14 space-y-3">
          {/* Row 1: 4 Highlighted Tiles (TS, Python, Claude, Cursor) with border-lg, then a gap, then 3 tiles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 4 Highlighted Tiles */}
            {highlightedTools.map((tile) => (
              <div
                key={tile.name}
                title={tile.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg border border-white/25 bg-[#141414] hover:border-white/40 hover:bg-[#1C1C1F] flex items-center justify-center transition-all cursor-default shadow-sm group"
              >
                {renderIcon(tile.slug, tile.name, true)}
              </div>
            ))}

            {/* Visual separator gap as drawn in wireframe */}
            <div className="hidden sm:block w-3" />

            {/* Next 3 tiles on Row 1 */}
            {secondaryRow1.map((tile) => (
              <div
                key={tile.name}
                title={tile.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg border border-white/10 bg-[#0E0E0E] hover:border-white/25 hover:bg-[#151515] flex items-center justify-center transition-all cursor-default shadow-sm group"
              >
                {renderIcon(tile.slug, tile.name, true)}
              </div>
            ))}
          </div>

          {/* Row 2: 2 Tiles (Docker, AWS) + "+more..." in handwriting font */}
          <div className="flex items-center gap-3 pt-0.5">
            {secondaryRow2.map((tile) => (
              <div
                key={tile.name}
                title={tile.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg border border-white/10 bg-[#0E0E0E] hover:border-white/25 hover:bg-[#151515] flex items-center justify-center transition-all cursor-default shadow-sm group"
              >
                {renderIcon(tile.slug, tile.name, true)}
              </div>
            ))}

            <span className="font-handwriting text-xl text-[#8A8A85] pl-2 select-none">
              +more...
            </span>
          </div>
        </div>

        {/* 3 Columns matching wireframe: Generous gap, NO column headings, NO descriptions, WHITE logos in rounded-lg */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-16 pt-2">
          {/* Column 1 */}
          <div className="space-y-0 text-left">
            {column1.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3.5 py-3 border-b border-white/[0.08] transition-colors hover:bg-white/[0.02] group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0E0E0E] border border-white/10 flex items-center justify-center shrink-0">
                  {renderIcon(skill.slug, skill.name, false)}
                </div>
                <span className="text-sm font-medium text-[#EDEDEA] tracking-tight">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-0 text-left">
            {column2.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3.5 py-3 border-b border-white/[0.08] transition-colors hover:bg-white/[0.02] group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0E0E0E] border border-white/10 flex items-center justify-center shrink-0">
                  {renderIcon(skill.slug, skill.name, false)}
                </div>
                <span className="text-sm font-medium text-[#EDEDEA] tracking-tight">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-0 text-left">
            {column3.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3.5 py-3 border-b border-white/[0.08] transition-colors hover:bg-white/[0.02] group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0E0E0E] border border-white/10 flex items-center justify-center shrink-0">
                  {renderIcon(skill.slug, skill.name, false)}
                </div>
                <span className="text-sm font-medium text-[#EDEDEA] tracking-tight">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA to Book / Work Together */}
        <div className="mt-16 text-center select-none pt-8">
          <Link
            href="/work-together"
            className="font-handwriting text-xl sm:text-2xl text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors cursor-pointer select-none inline-block"
          >
            + work together ..
          </Link>
        </div>
      </main>
    </div>
  );
}
