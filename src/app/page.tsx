"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import Freelance from "@/components/Freelance";
import Contact from "@/components/Contact";
import SectionDivider from "@/components/SectionDivider";
import PlusFrame from "@/components/PlusFrame";
import { siteContent } from "@/data/content";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-[#EDEDEA] overflow-x-hidden selection:bg-[#EA580C]/25 selection:text-[#EA580C]">
      {/* Cursive Name Intro Loader */}
      <Loader onComplete={() => setLoadingComplete(true)} />

      {/* Floating Top Navigation Bar */}
      <TopBar />

      {/* Main Portfolio Sections */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Section 1: Hero / About */}
        <Hero />

        {/* Plus Divider Frame holding Work, Experience, Stack, and Freelance */}
        <PlusFrame>
          {/* Section 2: Work / Projects */}
          <Work />

          {/* Dotted Grid Matrix Divider with Edge Plus Markers */}
          <SectionDivider />

          {/* Section 3: Experience & Education (List + Drag Timeline) */}
          <Experience />

          {/* Dotted Grid Matrix Divider with Edge Plus Markers */}
          <SectionDivider />

          {/* Section 4: Skills / Stack */}
          <Stack />

          {/* Dotted Grid Matrix Divider with Edge Plus Markers */}
          <SectionDivider />

          {/* Section 5: Freelance & Advisory */}
          <Freelance />
        </PlusFrame>

        {/* Section 6: Contact & Wordmark Type-Erase */}
        <Contact />
      </main>
    </div>
  );
}
