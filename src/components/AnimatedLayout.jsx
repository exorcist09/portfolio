"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Smoother page transition variants
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Overlay transition variants
const overlayVariants = {
  initial: {
    scaleY: 1,
  },
  animate: {
    scaleY: 0,
    transition: {
      duration: 0.9,
      ease: [0.76, 0, 0.24, 1], // More pronounced easing
    },
  },
  exit: {
    scaleY: 1,
    transition: {
      duration: 0.9,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// Gradient overlay variants
const gradientVariants = {
  initial: {
    opacity: 0.2,
  },
  animate: {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0.2,
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export default function AnimatedLayout({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        {/* Primary wipe overlay effect */}
        <motion.div
          key={`overlay-${pathname}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          className="fixed inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none z-[9999]"
          style={{ transformOrigin: "top" }}
        />

        {/* Secondary gradient overlay for smoother blending */}
        <motion.div
          key={`gradient-${pathname}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={gradientVariants}
          className="fixed inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white/5 pointer-events-none z-[9998]"
        />

        {/* Content */}
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
