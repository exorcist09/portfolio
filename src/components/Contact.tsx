"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, ArrowUpRight, Copy, Check, MapPin } from "lucide-react";
import { siteContent } from "@/data/content";
import TypeEraseText from "./TypeEraseText";

export default function Contact() {
  // Email is open by default. Only one pill open at a time.
  const [activePill, setActivePill] = useState<"email" | "linkedin" | "github">("email");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(siteContent.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="pt-16 sm:pt-20 pb-20 w-full max-w-[760px] mx-auto px-5 sm:px-6">
      {/* Oversized Type-Erase Wordmark with generous top & bottom whitespace */}
      <div className="pt-6 sm:pt-10 pb-18 sm:pb-22 text-center overflow-hidden">
        <TypeEraseText
          initialText={siteContent.handle}
          targetText={siteContent.alternateHandle}
        />
      </div>

      {/* Consistent Left-Aligned Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-left"
      >
        <span className="text-[11px] font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
          CONTACT
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDEA]">
          get in touch
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#8A8A85]">
          Open for collaborations, creative engineering, and high-impact design systems.
        </p>
      </motion.div>

      {/* Monochrome Glass Pills - Synchronously expanding & collapsing with zero reflow lag */}
      <div
        onMouseLeave={() => setActivePill("email")}
        className="mt-6 p-2 pt-10 flex flex-wrap items-center justify-center gap-3"
      >
        {/* Email Pill - Open by default */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          onMouseEnter={() => setActivePill("email")}
          onClick={() => setActivePill("email")}
          className={`h-11 rounded-full border border-white/[0.1] bg-[#0E0E0E] hover:bg-[#161616] hover:border-white/20 flex items-center overflow-hidden cursor-pointer select-none transition-colors duration-200 ${
            activePill === "email" ? "shadow-lg shadow-white/5" : ""
          }`}
        >
          {/* Always centered 44px icon container */}
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            <Mail
              className={`w-4 h-4 transition-colors duration-200 ${
                activePill === "email" ? "text-white" : "text-white"
              }`}
            />
          </div>

          {/* Synchronized spring width container */}
          <motion.div
            initial={false}
            animate={{
              width: activePill === "email" ? "auto" : 0,
              opacity: activePill === "email" ? 1 : 0,
              paddingRight: activePill === "email" ? 16 : 0,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="overflow-hidden flex items-center whitespace-nowrap"
          >
            <span className="text-xs sm:text-sm text-[#EDEDEA] font-medium mr-2">
              {siteContent.email}
            </span>

            <button
              onClick={handleCopyEmail}
              className="p-1 text-[#8A8A85] hover:text-white transition-colors cursor-pointer mr-1"
              title="Copy email"
              aria-label="Copy email"
            >
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <a
              href={`mailto:${siteContent.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-white hover:text-white/80 transition-colors"
              title="Open mail client"
              aria-label="Open mail client"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* LinkedIn Pill - Compact 44px circle when closed */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          onMouseEnter={() => setActivePill("linkedin")}
          onClick={() => setActivePill("linkedin")}
          className={`h-11 rounded-full border border-white/[0.1] bg-[#0E0E0E] hover:bg-[#161616] hover:border-white/20 flex items-center overflow-hidden cursor-pointer select-none transition-colors duration-200 ${
            activePill === "linkedin" ? "shadow-lg shadow-white/5" : ""
          }`}
        >
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            <Linkedin className="w-4 h-4 text-white" />
          </div>

          <motion.div
            initial={false}
            animate={{
              width: activePill === "linkedin" ? "auto" : 0,
              opacity: activePill === "linkedin" ? 1 : 0,
              paddingRight: activePill === "linkedin" ? 16 : 0,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="overflow-hidden flex items-center whitespace-nowrap"
          >
            <a
              href={siteContent.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-mono-custom text-[#EDEDEA] flex items-center gap-1.5 hover:underline"
            >
              <span>linkedin.com/in/adarsh-verma-exorcist09</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </a>
          </motion.div>
        </motion.div>

        {/* GitHub Pill - Compact 44px circle when closed */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          onMouseEnter={() => setActivePill("github")}
          onClick={() => setActivePill("github")}
          className={`h-11 rounded-full border border-white/[0.1] bg-[#0E0E0E] hover:bg-[#161616] hover:border-white/20 flex items-center overflow-hidden cursor-pointer select-none transition-colors duration-200 ${
            activePill === "github" ? "shadow-lg shadow-white/5" : ""
          }`}
        >
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            <Github className="w-4 h-4 text-white" />
          </div>

          <motion.div
            initial={false}
            animate={{
              width: activePill === "github" ? "auto" : 0,
              opacity: activePill === "github" ? 1 : 0,
              paddingRight: activePill === "github" ? 16 : 0,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="overflow-hidden flex items-center whitespace-nowrap"
          >
            <a
              href={siteContent.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-mono-custom text-[#EDEDEA] flex items-center gap-1.5 hover:underline"
            >
              <span>github.com/exorcist09</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/[0.06] text-xs font-mono-custom text-[#8A8A85]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#8A8A85]" />
          <span>{siteContent.location}</span>
        </div>

        <div>
          <span>{siteContent.footerNotes}</span>
        </div>

        <div className="uppercase tracking-wider">
          <span>© 2026</span>
        </div>
      </footer>
    </section>
  );
}
