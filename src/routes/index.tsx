import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  return (
    <ThemeProvider>
      <CustomCursor />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <PufferCompanion loading={!loaded} />
      <main className="relative min-h-screen bg-background text-foreground" style={{ overflowX: "clip" }}>
        {/* Global side dot flows */}
        <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 z-0 w-28 opacity-[0.10] sm:w-40">
          <div className="dot-flow h-full w-full" />
        </div>
        <div aria-hidden className="pointer-events-none fixed inset-y-0 right-0 z-0 w-28 opacity-[0.10] sm:w-40">
          <div className="dot-flow h-full w-full" />
        </div>

        <Navbar />
        <Hero />
        <TechStack />
        <Projects />
        <Services />
        <Experience />
        <Contact />

      </main>
    </ThemeProvider>
  );
}
