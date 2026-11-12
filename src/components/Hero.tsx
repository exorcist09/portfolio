"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileDown, Clock, Cloud, Mail } from "lucide-react";
import { siteContent } from "@/data/content";
import AgentModal from "./AgentModal";

export default function Hero() {
  const [timeString, setTimeString] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);

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
        <div className="relative w-16 h-16 rounded-[18px] overflow-hidden border border-white/10 shadow-lg bg-[#141414]">
          <Image
            src={siteContent.avatarUrl || "/adarsh.png"}
            alt={siteContent.name}
            fill
            sizes="64px"
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback to SVG if png not found
              const target = e.target as HTMLImageElement;
              target.src = "/avatar.svg";
            }}
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
          {siteContent.bioParagraph1.greeting} I&apos;m currently working as a{" "}
          <strong className="font-medium text-[#EDEDEA]">
            {siteContent.bioParagraph1.currentRole}
          </strong>{" "}
          at{" "}
          <strong className="font-medium text-[#EDEDEA] inline-flex items-center gap-1">
            {siteContent.bioParagraph1.company}{" "}
            <span className="text-xs">{siteContent.bioParagraph1.companyIcon}</span>
          </strong>{" "}
          and as a{" "}
          <strong className="font-medium text-[#EDEDEA]">
            {siteContent.bioParagraph1.secondaryRole}
          </strong>{" "}
          at{" "}
          <strong className="font-medium text-[#EDEDEA] inline-flex items-center gap-1">
            {siteContent.bioParagraph1.lab}{" "}
            <span className="text-xs">{siteContent.bioParagraph1.labIcon}</span>
          </strong>
          , {siteContent.bioParagraph1.locationText}{" "}
          <span className="text-sm">{siteContent.countryFlag}</span>
        </p>

        {/* Bio Paragraph 2 */}
        <p className="text-sm sm:text-base leading-relaxed text-[#8A8A85]">
          {siteContent.bioParagraph2}
        </p>

        {/* Action Buttons: Talk to agent + Resume */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
           <button
            onClick={() => setIsAgentOpen(true)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-xs sm:text-sm font-medium text-[#EDEDEA] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Talk to AI Agent"
          >
            <Mail className="w-3.5 h-3.5 text-[#F5A623] group-hover:rotate-12 transition-transform" />
            <span>Contact</span>
          </button>

          <button
            onClick={() => setIsAgentOpen(true)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-xs sm:text-sm font-medium text-[#EDEDEA] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Talk to AI Agent"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5A623] group-hover:rotate-12 transition-transform" />
            <span>talk to agent</span>
          </button>

          <a
            href={siteContent.resumeUrl}
            download="Adarsh_Resume.pdf"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-[#EDEDEA] hover:text-white transition-all hover:scale-[1.05] active:scale-[0.98]"
            aria-label="Download Resume"
            title="Download Resume"
          >
            <FileDown className="w-4 h-4 stroke-[1.8]" />
          </a>
        </div>
      </motion.div>

      {/* Talk to Agent Modal */}
      <AgentModal isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
    </section>
  );
}

