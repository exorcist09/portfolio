"use client";

import React from "react";

export default function PlusFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[760px] mx-auto">
      {/* ============================================================== */}
      {/* TOP HORIZONTAL LINE                                            */}
      {/* Overshoots past left & right vertical lines, fading on ends   */}
      {/* Hidden on mobile screen (hash top line removed), kept on sm+  */}
      {/* ============================================================== */}
      <div
        className="hidden sm:block pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 sm:w-[calc(100%+260px)] md:w-[calc(100%+360px)] h-[1px] bg-white/[0.12] z-20"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* BOTTOM HORIZONTAL LINE                                         */}
      {/* Overshoots past left & right vertical lines, fading on ends   */}
      {/* Hidden on mobile screen (hash bottom line removed), kept on sm+ */}
      {/* ============================================================== */}
      <div
        className="hidden sm:block pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 sm:w-[calc(100%+260px)] md:w-[calc(100%+360px)] h-[1px] bg-white/[0.12] z-20"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* LEFT VERTICAL LINE                                             */}
      {/* Overshoots up into Hero and down into Contact, fading on ends  */}
      {/* ============================================================== */}
      <div
        className="pointer-events-none absolute left-0 -top-48 sm:-top-64 md:-top-72 -bottom-48 sm:-bottom-64 md:-bottom-72 w-[1px] bg-white/[0.12] z-20"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* RIGHT VERTICAL LINE                                            */}
      {/* Overshoots up into Hero and down into Contact, fading on ends  */}
      {/* ============================================================== */}
      <div
        className="pointer-events-none absolute right-0 -top-48 sm:-top-64 md:-top-72 -bottom-48 sm:-bottom-64 md:-bottom-72 w-[1px] bg-white/[0.12] z-20"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* ENCLOSED CONTENT: Projects, Experience, Skills                 */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
