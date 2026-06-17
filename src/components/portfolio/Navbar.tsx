import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, FileText, Moon, Sun, ArrowUpRight, Settings, MousePointer2, Wand2, Contrast, Search, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme, ACCENTS, type Accent } from "./ThemeContext";

export function Navbar() {
  const { mode, setMode, accent, setAccent, cursorMode, setCursorMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setOpen(false);
      setScrolled(cur > 20);
      if (cur > last && cur > 80) setHidden(true);
      else setHidden(false);

      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      setAtBottom(isBottom);

      // Active section tracking
      const sections = ["home", "projects", "experience"];
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.6) {
            current = id;
          }
        }
      }
      // If we are at the very bottom, highlight experience
      if (isBottom) current = "experience";
      setActiveSection(current);

      last = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once to initialize correctly
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ddRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <>
      {/* Top edge blur to hide content scrolling under the gap above the navbar */}
      <div
        className="fixed inset-x-0 top-0 h-16 z-40 pointer-events-none"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />
      {/* Bottom edge blur to smoothly fade out content at the bottom */}
      <div
        className={`fixed inset-x-0 bottom-0 h-16 z-40 pointer-events-none transition-opacity duration-500 ${atBottom ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
        }}
      />
      <header
        className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-transform duration-300 ${hidden ? "-translate-y-32" : "translate-y-0"}`}
      >
        <nav className={`relative flex w-full max-w-4xl items-center justify-between gap-3 rounded-full transition-all duration-500 ${scrolled ? 'px-2 py-1' : ''}`}>

          {scrolled && (
            <motion.div
              layoutId="nav-glass"
              className="absolute inset-0 glass rounded-full -z-10 shadow-lg"
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
          )}

          {/* Left: logo + Let's Chat + theme toggle */}
          <div className="relative flex items-center gap-24 px-4 py-1.5">
            {!scrolled && (
              <motion.div
                layoutId="nav-glass"
                className="absolute inset-0 glass rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
              />
            )}
            <a href="#home" className="font-hero pl-2 pr-1 text-sm tracking-tight">
              adarsh<span className="text-primary">.</span>
            </a>
            <div className="flex items-center gap-1.5">
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-foreground/10 px-3 py-1.5 text-xs font-medium transition-colors hover:text-background"
              >
                <span className="absolute left-1/2 top-1/2 z-0 h-32 w-32 -translate-x-[120%] translate-y-[80%] rounded-full bg-foreground transition-transform duration-500 ease-out group-hover:-translate-x-1/2 group-hover:-translate-y-1/2" />
                <span className="relative z-10 flex items-center gap-1.5">
                  Let's Chat
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  aria-label="Settings"
                  className={`grid h-8 w-8 place-items-center rounded-full transition hover:bg-foreground hover:text-background ${open ? "bg-foreground text-background" : "bg-foreground/10"}`}
                >
                  <Settings className="h-4 w-4" />
                </button>
                {open && (
                  <div className="glass absolute left-0 top-11 z-50 w-56 rounded-2xl p-3 shadow-2xl">
                    <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Theme</p>
                    <div className="relative flex w-full rounded-full bg-secondary/50 p-1">
                      <button onClick={() => setMode("dark")}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs transition-colors duration-300 ${mode === "dark" ? "text-background" : "text-muted-foreground hover:text-foreground"}`}>
                        <Moon className="h-3 w-3" /> Dark
                        {mode === "dark" && (
                          <motion.div layoutId="theme-tab" className="absolute inset-0 -z-10 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                      </button>
                      <button onClick={() => setMode("light")}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs transition-colors duration-300 ${mode === "light" ? "text-background" : "text-muted-foreground hover:text-foreground"}`}>
                        <Sun className="h-3 w-3" /> Light
                        {mode === "light" && (
                          <motion.div layoutId="theme-tab" className="absolute inset-0 -z-10 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                      </button>
                    </div>
                    <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Accent</p>
                    <div className="flex items-center justify-between gap-1">
                      {(Object.keys(ACCENTS) as Accent[]).map((k) => (
                        <button key={k} onClick={() => setAccent(k)} aria-label={ACCENTS[k].name}
                          className={`grid h-7 w-7 place-items-center rounded-full transition ${accent === k ? "ring-2 ring-offset-2 ring-offset-background" : ""}`}
                          style={{ background: ACCENTS[k].swatch, ["--tw-ring-color" as string]: ACCENTS[k].swatch }}>
                          {accent === k && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </button>
                      ))}
                    </div>

                    <p className="mb-2 mt-4 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Cursor</p>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => setCursorMode("normal")}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${cursorMode === "normal" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}>
                        <MousePointer2 className="h-3 w-3" /> Normal Mode
                      </button>
                      <button onClick={() => setCursorMode("trail")}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${cursorMode === "trail" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}>
                        <Wand2 className="h-3 w-3" /> Trail Mode
                      </button>
                      <button onClick={() => setCursorMode("follower")}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${cursorMode === "follower" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}>
                        <Navigation className="h-3 w-3" /> Follower Mode
                      </button>
                      <button onClick={() => setCursorMode("invert")}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${cursorMode === "invert" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}>
                        <Contrast className="h-3 w-3" /> Invert Color Mode
                      </button>
                      <button onClick={() => setCursorMode("magnifying")}
                        className={`group relative flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${cursorMode === "magnifying" ? "bg-foreground text-background" : "hover:bg-foreground/10"}`}>
                        <Search className="h-3 w-3" /> 
                        <span className="block group-hover:hidden">Magnifying Mode</span>
                        <span className="hidden group-hover:block text-muted-foreground">Under Development</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Home, Project, Connect | socials + CV */}
          <div className={`hidden items-center gap-4 rounded-full px-4 py-2 md:flex transition-transform duration-500 ${scrolled ? 'translate-x-0' : 'translate-x-8'}`}>
            <div className="flex items-center gap-4 text-xs font-medium">
              <a href="#home" className={`transition ${activeSection === "home" ? "text-primary" : "hover:text-primary"}`}>Home</a>
              <a href="#projects" className={`transition ${activeSection === "projects" ? "text-primary" : "hover:text-primary"}`}>Projects</a>
              <a href="#experience" className={`transition ${activeSection === "experience" ? "text-primary" : "hover:text-primary"}`}>Experience</a>
            </div>

            <div className="h-4 w-[1px] bg-border" />

            <div className="flex items-center gap-3 text-muted-foreground">
              <a href="https://www.linkedin.com/in/adarsh-verma-exorcist09/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://github.com/exorcist09" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground transition">
                <Github className="h-4 w-4" />
              </a>
              <a href="/AdarshVermaResume.pdf" target="_blank" rel="noreferrer" aria-label="AdarshVermaResume" className="hover:text-foreground transition">
                <FileText className="h-4 w-4" />
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
