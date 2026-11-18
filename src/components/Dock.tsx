"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  Layers,
  Send,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Check,
} from "lucide-react";
import { siteContent } from "@/data/content";

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "scroll" | "external" | "action";
  target?: string;
  action?: () => void;
}

export default function Dock() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [copied, setCopied] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Appear only after user scrolls past ~260px (Hero section start)
      if (window.scrollY > 260) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to highlight active section
  useEffect(() => {
    const sectionIds = ["hero", "work", "experience", "contact"];
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems: DockItem[] = [
    {
      id: "hero",
      label: "Home",
      icon: Home,
      type: "scroll",
      target: "hero",
    },
    {
      id: "work",
      label: "Projects",
      icon: Briefcase,
      type: "scroll",
      target: "work",
    },
    {
      id: "experience",
      label: "Experience",
      icon: Layers,
      type: "scroll",
      target: "experience",
    },
    {
      id: "contact",
      label: "Contact",
      icon: Send,
      type: "scroll",
      target: "contact",
    },
    {
      id: "github",
      label: "GitHub",
      icon: Github,
      type: "external",
      target: siteContent.githubUrl,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      type: "external",
      target: siteContent.linkedinUrl,
    },
    {
      id: "connect",
      label: copied ? "Copied Email!" : "Connect (Email)",
      icon: copied ? Check : Mail,
      type: "action",
      action: handleCopyEmail,
    },
    {
      id: "resume",
      label: "Resume (PDF)",
      icon: FileDown,
      type: "action",
      action: () => {
        const link = document.createElement("a");
        link.href = siteContent.resumeUrl;
        link.download = "Adarsh_Resume.pdf";
        link.click();
      },
    },
  ];

  return (
    <>
      <AnimatePresence>
        {visible && (
          <>
            {/* Desktop: Right-side vertical dock */}
            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 p-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              aria-label="Sidebar Navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.type === "scroll" && activeSection === item.target;

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center justify-center"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => {
                        if (item.type === "scroll" && item.target) {
                          scrollTo(item.target);
                        } else if (item.type === "external" && item.target) {
                          window.open(item.target, "_blank", "noopener,noreferrer");
                        } else if (item.action) {
                          item.action();
                        }
                      }}
                      aria-label={item.label}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        isActive
                          ? "bg-white text-black shadow-md scale-105"
                          : "text-[#EDEDEA]/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08]"
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[1.8]" />
                    </button>

                    {/* Tooltip on left */}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, x: 6, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="pointer-events-none absolute right-12 px-2.5 py-1 rounded-md text-xs font-mono-custom bg-[#1A1A1A] text-[#EDEDEA] border border-white/10 whitespace-nowrap shadow-xl z-50"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.aside>

            {/* Mobile: Bottom floating horizontal pill dock */}
            <motion.nav
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-1.5 px-3 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.1] shadow-2xl max-w-[92vw] overflow-x-auto no-scrollbar"
              aria-label="Mobile Navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.type === "scroll" && activeSection === item.target;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.type === "scroll" && item.target) {
                        scrollTo(item.target);
                      } else if (item.type === "external" && item.target) {
                        window.open(item.target, "_blank", "noopener,noreferrer");
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                    aria-label={item.label}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white text-black"
                        : "text-[#EDEDEA]/70 hover:text-white bg-white/[0.06] border border-white/[0.08]"
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </button>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Copy notification toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1A1A1A] border border-white/20 text-xs font-mono-custom text-[#EDEDEA] flex items-center gap-2 shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Email copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

