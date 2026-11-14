"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, FileDown, Mail, Check } from "lucide-react";
import { siteContent } from "@/data/content";
import ResumeModal from "./ResumeModal";

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [copied, setCopied] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Appears only after scrolling past the hero section; hidden when in hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight - 80;
        setIsVisible(window.scrollY > heroBottom);
      } else {
        setIsVisible(window.scrollY > 380);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to highlight active section on scroll
  useEffect(() => {
    const sectionIds = ["hero", "work", "experience", "freelance", "contact"];
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { id: "work", label: "Work" },
    { id: "experience", label: "Experience" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -56 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -56 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 w-full z-50 h-14 bg-black/80 backdrop-blur-md border-b border-white/[0.08] select-none"
          aria-label="Main Navigation"
        >
          <div className="max-w-[760px] mx-auto px-5 sm:px-6 h-full flex items-center justify-between">
            {/* Left: Name / Brand button (smooth scroll to top) */}
            <button
              onClick={scrollToTop}
              className="text-sm font-semibold tracking-tight text-[#EDEDEA] hover:text-white transition-colors cursor-pointer font-sans"
              aria-label="Scroll to top"
            >
              {siteContent.name}
            </button>

            {/* Right: Section Navigation + Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Section Links */}
              <nav className="flex items-center gap-0.5 sm:gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;

                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-inter transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-[#8A8A85] hover:text-[#EDEDEA] hover:bg-white/[0.05]"
                      }`}
                      aria-label={`Scroll to ${link.label}`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              {/* Hairline Divider */}
              <div className="h-4 w-px bg-white/15 mx-1 sm:mx-1.5 shrink-0" />

              {/* Quick Actions */}
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">


                <a
                  href={siteContent.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </a>

                <a
                  href={siteContent.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </a>
                
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="View Resume"
                  title="View Resume"
                >
                  <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="Copy Email"
                  title="Copy Email"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent)] stroke-[2.2]" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  )}

                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        className="pointer-events-none absolute top-full mt-2 right-0 px-2.5 py-1 rounded-md text-[10px] font-mono-custom bg-[#1A1A1A] text-[#EDEDEA] border border-white/10 whitespace-nowrap shadow-xl z-50"
                      >
                        Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Resume Preview Dialog */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={siteContent.resumeUrl}
      />
    </AnimatePresence>
  );
}
