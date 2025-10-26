"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function useScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll position when navigation happens
    window.scrollTo(0, 0);

    // Enable scrolling on the body
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    // Reset any overflow styles on the main container
    const pageContainer = document.querySelector("div.min-h-screen");
    if (pageContainer) {
      pageContainer.style.overflow = "visible";
      pageContainer.style.height = "auto";
    }
  }, [pathname]);

  return null;
}
