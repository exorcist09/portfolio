"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SpiderMascot from "./SpiderMascot";

/**
 * Global Spidy Mascot Wrapper
 * Mounts Spidy across ALL pages of the website, always strictly on top of all UI (z-[100]).
 */
export default function GlobalSpider() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // On subpages (/work, /skills, /book, etc.), Spidy is immediately ready!
    if (pathname !== "/") {
      setIsReady(true);
      return;
    }

    // On homepage, wait for intro loader to complete
    const handleLoaderComplete = () => {
      setIsReady(true);
    };

    window.addEventListener("portfolio:loader-complete", handleLoaderComplete);

    // Fallback: if loader was already finished or skipped
    const fallbackTimer = setTimeout(() => {
      setIsReady(true);
    }, 3500);

    return () => {
      window.removeEventListener("portfolio:loader-complete", handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return <SpiderMascot isReady={isReady} />;
}
