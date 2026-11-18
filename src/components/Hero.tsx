"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileDown, Clock, Cloud, Mail, Circle } from "lucide-react";
import { siteContent } from "@/data/content";
import { avatarBase64 } from "@/data/avatarBase64";
import AgentModal from "./AgentModal";
import ResumeModal from "./ResumeModal";

export default function Hero() {
  const [timeString, setTimeString] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Live local time with timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: siteContent.timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(now);

      setTimeString(`${formatted} GMT+5:30`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Press "c" or "C" to copy email
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "c" || e.key === "C") {
        navigator.clipboard.writeText(siteContent.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section
      id="hero"
      className="relative pt-10 pb-16 md:py-20 w-full max-w-[760px] mx-auto px-5 sm:px-6 text-left"
    >
      {/* Avatar & Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Avatar & Profile */}
        <div
          className="relative w-16 h-16 rounded-[18px] overflow-hidden border border-white/10 shadow-lg bg-[#141414] select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* CSS Background div using inlined Base64 (Zero network requests, no 'Open in new tab' context menu) */}
          <div
            style={{
              backgroundImage: `url(${avatarBase64})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="w-full h-full pointer-events-none select-none"
            aria-label={siteContent.name}
            role="img"
          />

          {/* Protective overlay against right-clicks, downloads and dragging */}
          <div
            className="absolute inset-0 z-10 select-none cursor-default"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* Name and Role */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
            {siteContent.name}
          </h1>
          <p className="text-sm sm:text-base text-[#8A8A85] mt-1">
            {siteContent.role}
          </p>
        </div>

        {/* Bio Paragraph 1 */}
        <p className="text-sm sm:text-base leading-relaxed text-[#8A8A85]">
          {siteContent.bioParagraph1}
        </p>

        {/* Bio Paragraph 2 */}
        <p className="text-sm sm:text-base leading-relaxed text-[#8A8A85]">
          {siteContent.bioParagraph2}
        </p>

        {/* Action Buttons: Contact (accent filled pill, unfilled mail icon) + Resume */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            style={{
              backgroundColor: "var(--accent)",
              borderColor: "var(--accent)",
              boxShadow: "0 4px 14px var(--accent-glow)",
            }}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer  hover:scale-[1.02] active:scale-[0.98] border"
            aria-label="Contact Adarsh"
          >
            <Mail className="w-3.5 h-3.5 text-white stroke-current stroke-[2] fill-none" />
            <span>Contact</span>
          </a>

          <button
            type="button"
            onClick={() => setIsResumeOpen(true)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-xs sm:text-sm font-medium text-[#EDEDEA] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            aria-label="View Resume"
            title="View Resume"
          >
            <FileDown className="w-4 h-4 stroke-[1.8]" />
            <span>Resume</span>
          </button>

          {/* Mobile Only: Chat button next to Resume (opens AI assistant modal) */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="sm:hidden group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-[#EDEDEA] hover:text-white transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            aria-label="Chat with AI Agent"
            title="Chat with AI Agent"
          >
            <Circle className="w-2.5 h-2.5 fill-white text-white shrink-0" />
            <span>Chat</span>
          </button>
        </div>
      </motion.div>

      {/* Talk to Agent Modal */}
      <AgentModal isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />

      {/* Resume Preview Dialog */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={siteContent.resumeUrl}
      />
    </section>
  );
}

