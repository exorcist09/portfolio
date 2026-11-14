"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { ProjectReadmeData } from "@/data/projectReadmes";

interface ReadmeViewProps {
  data: ProjectReadmeData;
  fromHome?: boolean;
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");

  const tokenizeLine = (line: string) => {
    if (!line) return <span className="inline-block h-4">&#160;</span>;

    const commentIdx = line.indexOf("//");
    let codePart = line;
    let commentPart = "";
    if (commentIdx !== -1) {
      codePart = line.slice(0, commentIdx);
      commentPart = line.slice(commentIdx);
    }

    const tokenRegex =
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[\s\S]*?`|\b(?:if|else|while|for|switch|case)\b|\b(?:export|async|function|const|let|var|await|return|throw|new|type|interface|from|import)\b|\b(?:string|Record)\b|\b(?:number|boolean|void|any|unknown|Promise|Error)\b|[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+|=>|[=!<>]+|[{}()[\].,;:?])/g;

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(codePart)) !== null) {
      if (match.index > lastIndex) {
        elements.push(
          <span key={`ws-${lastIndex}`} className="text-[#8A8A85]">
            {codePart.slice(lastIndex, match.index)}
          </span>
        );
      }

      const token = match[0];
      let colorClass = "text-[#4A88C7]";
      let fontClass = "";

      // 1. Strings in quotes: brown color
      if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'")) ||
        (token.startsWith("`") && token.endsWith("`"))
      ) {
        colorClass = "text-[#CE9178]";
      }
      // 2. Conditionals and loops: purple
      else if (/^(if|else|while|for|switch|case)$/.test(token)) {
        colorClass = "text-[#C586C0]";
        fontClass = "font-medium";
      }
      // 3. Other keywords
      else if (
        /^(export|async|function|const|let|var|await|return|throw|new|type|interface|from|import)$/.test(
          token
        )
      ) {
        colorClass = "text-[#E06C75]";
        fontClass = "font-medium";
      }
      // 4. "green for string, Record etc"
      else if (/^(string|Record)$/.test(token)) {
        colorClass = "text-[#6A9955]";
        fontClass = "font-medium";
      }
      // 5. "for datatype use dark blue color"
      else if (/^(number|boolean|void|any|unknown|Promise|Error)$/.test(token)) {
        colorClass = "text-[#2563EB]";
        fontClass = "font-medium";
      }
      // 6. Numbers
      else if (/^[0-9]+$/.test(token)) {
        colorClass = "text-[#4A88C7]";
      }
      // 7. Function names vs Variables
      else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)) {
        const afterToken = codePart.slice(match.index + token.length).trimStart();
        if (afterToken.startsWith("(")) {
          // Yellow color for function name (soft warm syntax yellow)
          colorClass = "text-[#D7BA7D]";
        } else {
          // Light blue made a little darker
          colorClass = "text-[#4A88C7]";
        }
      }
      // 8. Operators and punctuation (soft neutral, not bright white)
      else if (/^(=>|[=!<>]+|[{}()[\].,;:?])$/.test(token)) {
        colorClass = "text-[#8A8A85]";
      }

      elements.push(
        <span key={`token-${match.index}`} className={`${colorClass} ${fontClass}`}>
          {token}
        </span>
      );

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < codePart.length) {
      elements.push(
        <span key={`tail-${lastIndex}`} className="text-[#8A8A85]">
          {codePart.slice(lastIndex)}
        </span>
      );
    }

    // Comments are green as well
    if (commentPart) {
      elements.push(
        <span key="comment" className="text-[#6A9955] italic">
          {commentPart}
        </span>
      );
    }

    return elements;
  };

  return (
    <pre className="p-4 sm:p-5 overflow-x-auto leading-relaxed font-victor text-xs sm:text-[13px] bg-[#0A0A0C]">
      <code className="font-victor">
        {lines.map((line, idx) => (
          <div key={idx} className="table-row">
            <span className="table-cell select-none pr-4 sm:pr-6 text-right text-[#484F58] font-victor text-[11px] sm:text-xs">
              {idx + 1}
            </span>
            <span className="table-cell whitespace-pre font-victor">
              {tokenizeLine(line)}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}

export default function ReadmeView({ data, fromHome }: ReadmeViewProps) {
  const router = useRouter();
  const [isFromHome, setIsFromHome] = useState(Boolean(fromHome));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("from") === "home") {
        setIsFromHome(true);
      }
    }
  }, [fromHome]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFromHome) {
      router.push("/");
    } else {
      router.push("/work");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] selection:bg-[var(--accent)]/25 selection:text-[var(--accent)] relative">
      {/* Extreme Left: Back Button + Heading */}
      <div className="lg:fixed lg:top-14 xl:top-16 lg:left-8 xl:left-12 2xl:left-16 z-40 flex items-center gap-2.5 sm:gap-3 select-none px-5 pt-6 sm:pt-8 lg:p-0">
        <Link
          href={isFromHome ? "/" : "/work"}
          onClick={handleBack}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-white/15 bg-[#0E0E0E] hover:bg-[#181818] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer group shrink-0 shadow-sm"
          aria-label={isFromHome ? "Back to home" : "Back to projects"}
          title={isFromHome ? "Back to Home" : "Back to Work"}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>

        <h1 className="text-base sm:text-lg font-medium tracking-tight text-[#EDEDEA]">
          {isFromHome ? "Back" : "Work"}
        </h1>
      </div>

      {/* Main Centered README Document Container */}
      <main className="w-full max-w-[820px] mx-auto px-5 sm:px-6 py-8 sm:py-14 lg:py-20 space-y-12">
        {/* Document Header & Metadata */}
        <section className="space-y-4 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white font-sans">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-[#8A8A85] leading-relaxed max-w-2xl">
              {data.tagline}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-sans text-[#EDEDEA] hover:text-white transition-all cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}

            {data.liveUrl && (
              <a
                href={data.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 border border-[var(--accent)] text-xs font-sans text-white font-semibold transition-all shadow-md shadow-[var(--accent)]/20 cursor-pointer"
              >
                <span>Live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* Hero Visual Media (If Available) */}
        {data.heroImage && (
          <section className="rounded-2xl border border-white/10 bg-[#0E0E10] overflow-hidden shadow-2xl relative group">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0A0A0A] text-xs text-[#8A8A85] select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="font-mono-custom text-[11px] text-[#8A8A85] ml-2">preview.png</span>
              </div>
            </div>
            <div className="relative aspect-video w-full bg-[#121214] flex items-center justify-center p-2 sm:p-4">
              <img
                src={data.heroImage}
                alt={data.title}
                className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-lg"
              />
            </div>
          </section>
        )}

        {/* Section 1: Executive Overview & Problem Context */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold select-none">
            <span>01 / System Overview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-md border border-white/[0.08] bg-[#0E0E0E] space-y-2">
              <h3 className="text-sm font-semibold text-white">The Core Challenge</h3>
              <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed">
                {data.problemStatement}
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-md border border-white/[0.08] bg-[#0E0E0E] space-y-2">
              <h3 className="text-sm font-semibold text-white">Architectural Solution</h3>
              <p className="text-xs sm:text-sm text-[#8A8A85] leading-relaxed">
                {data.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Flowchart Diagram matching GitHub README */}
        <section className="space-y-6">
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold">
              <span>02 / System Architecture Flow</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-lg border border-white/[0.08] bg-[#0E0E10] shadow-xl relative overflow-hidden space-y-6">
            {/* Flowchart 1: System Pipeline (Mermaid flowchart LR equivalent) */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono-custom text-[#8A8A85] flex items-center justify-between">
                <span>SYSTEM PIPELINE</span>
                <span className="text-[10px] text-[#8A8A85]/70">FLOWCHART LR</span>
              </div>

              {/* Dual Inputs: User + KAI AI Agent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-[#141416] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#EDEDEA]">User</div>
                    <div className="text-[11px] text-[#8A8A85]">Manual visual workflow creation</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8A8A85]" />
                </div>

                <div className="p-3 rounded-md bg-[#141416] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#EDEDEA]">KAI (AI Agent)</div>
                    <div className="text-[11px] text-[#8A8A85]">Natural language instructions to graphs</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8A8A85]" />
                </div>
              </div>

              {/* Sequential Processing Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                {[
                  { name: "Workflow Builder", role: "React Flow Editor", step: "01" },
                  { name: "Workflow Definition", role: "JSON Graph Nodes", step: "02" },
                  { name: "Workflow Validation", role: "Cycle & Node Checks", step: "03" },
                  { name: "Scheduler / Queue", role: "Job Queue & Timers", step: "04" },
                  { name: "Workflow Executor", role: "Graph Traversal", step: "05" },
                  { name: "Logs & Dashboard", role: "PostgreSQL & UI", step: "06" },
                ].map((stage, idx) => (
                  <div
                    key={idx}
                    className="relative p-2.5 rounded-md bg-[#121214] border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono-custom text-[#8A8A85]">
                      <span>{stage.step}</span>
                      {idx < 5 && <ArrowRight className="w-3 h-3 text-[#8A8A85]/60 hidden lg:block" />}
                    </div>
                    <div className="mt-2 text-xs font-medium text-[#EDEDEA] leading-tight">{stage.name}</div>
                    <div className="text-[10px] text-[#8A8A85] mt-1">{stage.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flowchart 2: Directed Graph Execution with Condition Branching (Mermaid flowchart TD equivalent) */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono-custom text-[#8A8A85] flex items-center justify-between">
                <span>WORKFLOW EXECUTION GRAPH</span>
                <span className="text-[10px] text-[#8A8A85]/70">DIRECTED GRAPH WITH CONDITIONS</span>
              </div>

              <div className="p-4 rounded-md bg-[#121214] border border-white/[0.08] overflow-x-auto">
                <div className="min-w-[560px] flex items-center justify-between gap-3 text-xs">
                  {/* Trigger Node */}
                  <div className="px-3.5 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-center shrink-0">
                    <div className="text-[10px] font-mono-custom text-[#8A8A85]">TRIGGER</div>
                    <div className="font-medium text-[#EDEDEA] mt-0.5">Webhook / Cron</div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#8A8A85] shrink-0" />

                  {/* Operation 1 */}
                  <div className="px-3.5 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-center shrink-0">
                    <div className="text-[10px] font-mono-custom text-[#8A8A85]">OPERATION</div>
                    <div className="font-medium text-[#EDEDEA] mt-0.5">Fetch Data</div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#8A8A85] shrink-0" />

                  {/* Operation 2 */}
                  <div className="px-3.5 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-center shrink-0">
                    <div className="text-[10px] font-mono-custom text-[#8A8A85]">OPERATION</div>
                    <div className="font-medium text-[#EDEDEA] mt-0.5">Transform</div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#8A8A85] shrink-0" />

                  {/* Condition Node */}
                  <div className="px-3.5 py-2.5 rounded-md bg-white/[0.08] border border-white/20 text-center shrink-0">
                    <div className="text-[10px] font-mono-custom text-white font-medium">DECISION</div>
                    <div className="font-medium text-white mt-0.5">&#123; Condition &#125;</div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#8A8A85] shrink-0" />

                  {/* Branch Outcomes */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-custom text-emerald-400 font-semibold">TRUE →</span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium">
                        Success
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-custom text-rose-400 font-semibold">FALSE →</span>
                      <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-medium">
                        Failure
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8A8A85] leading-relaxed pt-2 border-t border-white/[0.06] text-center max-w-xl mx-auto">
              {data.architectureOverview}
            </p>
          </div>
        </section>

        {/* Section 3: Execution Lifecycle Breakdown */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold select-none">
            <span>03 / Lifecycle Execution Steps</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.flowSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-md border border-white/[0.08] bg-[#0E0E0E] hover:border-white/20 transition-colors space-y-2 select-none"
              >
                <div className="flex items-center justify-between text-xs font-mono-custom">
                  <span className="text-white font-bold">{step.step}</span>
                  <span className="text-[#8A8A85] text-[10px] px-2 py-0.5 rounded bg-white/[0.04]">
                    {step.component}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                <p className="text-xs text-[#8A8A85] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Architecture Decision Records (ADRs) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold select-none">
            <span>04 / Architecture Decisions & Trade-offs</span>
          </div>

          <div className="space-y-4">
            {data.decisions.map((decision, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-md border border-white/[0.08] bg-[#0E0E0E] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    ADR-{idx + 1}: {decision.title}
                  </h4>
                  <span className="text-[10px] font-mono-custom text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ACCEPTED
                  </span>
                </div>

                <div className="text-xs space-y-2 text-[#8A8A85] font-sans">
                  <div>
                    <span className="text-[#EDEDEA] font-medium">Problem Context: </span>
                    <span>{decision.context}</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Decision: </span>
                    <span className="text-[#EDEDEA]">{decision.decision}</span>
                  </div>
                  <div className="pt-1 text-[11px] text-[#8A8A85]/90 border-t border-white/[0.04]">
                    <span className="font-semibold text-white/70">Trade-offs & Rationale: </span>
                    <span>{decision.tradeoffs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Performance Benchmarks & Reliability Metrics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold">
              <span>05 / Performance & Reliability Benchmarks</span>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-white/[0.08] bg-[#0E0E0E] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.metrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-md bg-[#141416] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-[#8A8A85]">{metric.label}</span>
                    <span className="text-white font-mono-custom font-bold">{metric.value}</span>
                  </div>

                  {/* Horizontal Visual Gauge Bar */}
                  <div className="w-full h-1.5 rounded-sm bg-white/[0.08] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.chartValue}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-sm bg-white/20"
                    />
                  </div>

                  <p className="text-[11px] text-[#8A8A85]/80">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Tech Stack Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold select-none">
            <span>06 / Technology Matrix</span>
          </div>

          <div className="p-5 sm:p-6 rounded-md border border-white/[0.08] bg-[#0E0E0E] space-y-4">
            {data.techStack.map((stack, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-2 border-b last:border-b-0 border-white/[0.06]">
                <span className="text-xs font-mono-custom text-[#8A8A85] w-36 shrink-0 font-medium">
                  {stack.layer}
                </span>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-sans px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Code Snippet / Implementation Spec */}
        <section className="space-y-4">
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-[#EDEDEA] font-semibold">
              <span>07 / Core Implementation Spec</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0A0A0C] overflow-hidden shadow-2xl text-xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#0E0E10] text-[#8A8A85]">
              <span className="text-[11px] font-mono-custom">{data.codeSnippet.title}</span>
              <span className="text-[10px] uppercase font-mono-custom">
                {data.codeSnippet.language}
              </span>
            </div>
            <HighlightedCode code={data.codeSnippet.code} />
          </div>
        </section>

        {/* Bottom Navigation & CTA */}
        <section className="pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <Link
            href={isFromHome ? "/" : "/work"}
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-sans text-[#8A8A85] hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{isFromHome ? "back to home" : "all projects"}</span>
          </Link>

          <Link
            href="/work-together"
            className="font-handwriting text-xl text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors cursor-pointer"
          >
            + work together on systems like this ..
          </Link>
        </section>
      </main>
    </div>
  );
}
