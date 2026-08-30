import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { TechStack } from "@/components/portfolio/TechStack";
import { Projects } from "@/components/portfolio/Projects";
import { Services } from "@/components/portfolio/Services";
import { Experience } from "@/components/portfolio/Experience";
import { Contact } from "@/components/portfolio/Contact";
import { Loader } from "@/components/portfolio/Loader";
import { ThemeProvider } from "@/components/portfolio/ThemeContext";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { PufferCompanion } from "@/components/puffer/Puffer";
import { DeepSeaAmbience } from "@/components/portfolio/DeepSeaAmbience";
import { ResumeModal } from "@/components/portfolio/ResumeModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adarsh Verma" },
      { name: "description", content: "Portfolio of Adarsh Verma" },
    ],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsResumeOpen(true);
    window.addEventListener("open-resume-modal", handleOpen);
    return () => window.removeEventListener("open-resume-modal", handleOpen);
  }, []);

  return (
    <ThemeProvider>
      <CustomCursor />
      {!loaded && (
        <Loader
          onProgress={(p) => setLoadProgress(p)}
          onDone={() => {
            setLoadProgress(100);
            setLoaded(true);
          }}
        />
      )}
      <PufferCompanion loading={!loaded} progress={loadProgress} />
      
      {/* Resume Modal View */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      <main className="relative min-h-screen bg-background text-foreground" style={{ overflowX: "clip" }}>
        {/* Deep sea floating margins (bioluminescent jellyfish, marine snow, micro-bubbles) */}
        <DeepSeaAmbience />

        <Navbar onOpenResume={() => setIsResumeOpen(true)} />
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <TechStack />
        <Projects />
        <Services />
        <Experience />
        <Contact />

      </main>
    </ThemeProvider>
  );
}
