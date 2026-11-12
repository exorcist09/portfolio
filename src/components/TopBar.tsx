"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar({ name = "Adarsh" }: { name?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar appears only after scrolling past home/hero top area
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-center bg-black/70 backdrop-blur-md border-b border-white/[0.08]"
        >
          <button
            onClick={scrollToTop}
            className="px-4 py-1.5 text-sm tracking-wide text-[#EDEDEA]/80 hover:text-white transition-colors duration-200 cursor-pointer font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F5A623] rounded-full"
            aria-label="Scroll to top"
          >
            {name}
          </button>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
