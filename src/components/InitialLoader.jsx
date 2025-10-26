"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlameIcon } from "lucide-react";
import { HashLoader } from "react-spinners";

export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasNetworkIssue, setHasNetworkIssue] = useState(false);

  useEffect(() => {
    // Check if this is the initial load
    const isInitialLoad = sessionStorage.getItem("hasVisited") !== "true";

    // Set session storage to mark that user has visited
    if (isInitialLoad) {
      sessionStorage.setItem("hasVisited", "true");
    } else {
      // If not initial load, hide loader immediately
      setIsVisible(false);
    }

    // Listen for network status changes
    const handleOnline = () => setHasNetworkIssue(false);
    const handleOffline = () => setHasNetworkIssue(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Hide loader after a delay if it's initial load
    let timeout;
    if (isInitialLoad) {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // Show for 2 seconds on initial load
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(timeout);
    };
  }, []);

  // Keep loader visible if there's a network issue
  useEffect(() => {
    if (hasNetworkIssue) {
      setIsVisible(true);
    }
  }, [hasNetworkIssue]);

  if (!isVisible && !hasNetworkIssue) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white flex items-center justify-center z-[9999]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        if (!isVisible && !hasNetworkIssue) {
          // Add additional class to hide it from screen readers and interaction
          document.body.style.overflow = "auto";
        } else {
          document.body.style.overflow = "hidden";
        }
      }}
    >
      <div className="relative">
        {/* Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            {/* <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center"
            > */}
            <HashLoader />
            {/* <FlameIcon className="w-6 h-6 text-white" /> */}
            {/* </motion.div> */}
          </div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p
            className="text-sm font-medium tracking-wider uppercase"
            style={{ fontFamily: "var(--font-dela-gothic)" }}
          >
            {hasNetworkIssue ? "Reconnecting..." : "Loading"}
          </p>

          {hasNetworkIssue && (
            <p className="text-xs text-gray-600 mt-2">
              Check your internet connection
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
