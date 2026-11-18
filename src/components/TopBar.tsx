"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteContent } from "@/data/content";

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(false);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          key="topbar-header"
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
              {/* Work Navigation Link (redirects to /work) */}
              <nav className="flex items-center">
                <Link
                  href="/work"
                  className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-inter text-[#8A8A85] hover:text-[#EDEDEA] hover:bg-white/[0.08] transition-all cursor-pointer"
                  aria-label="Go to Work page"
                >
                  Work
                </Link>
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

                {/* Mail Icon: Smooth scroll to Contact section */}
                <button
                  type="button"
                  onClick={() => scrollTo("contact")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="Scroll to Contact"
                  title="Contact"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </button>

                {/* <Link
                  href="/work-together?from=home"
                  className="ml-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-inter font-medium bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 hover:border-white/20 text-[#EDEDEA] hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
                >
                  Schedule a call
                </Link> */}
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
