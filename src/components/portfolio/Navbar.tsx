import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, FileText, Moon, Sun, ArrowUpRight, Settings, MousePointer2, Wand2, Contrast, Navigation, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, ACCENTS, type Accent } from "./ThemeContext";

interface NavbarProps {
  onOpenResume?: () => void;
}

export function Navbar({ onOpenResume }: NavbarProps) {
  const { mode, setMode, accent, setAccent, cursorMode, setCursorMode, pufferEnabled, setPufferEnabled } = useTheme();
  const [open, setOpen] = useState(false);
  const [accentOpen, setAccentOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const ddRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setOpen(false);
      setAccentOpen(false);
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
      if (isBottom) current = "experience";
      setActiveSection(current);

      last = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !accentOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (open && !ddRef.current?.contains(e.target as Node)) setOpen(false);
      if (accentOpen && !accentRef.current?.contains(e.target as Node)) setAccentOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, accentOpen]);

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
        <nav className={`relative flex w-full max-w-4xl items-center justify-between gap-1 md:gap-3 rounded-full transition-all duration-500 ${scrolled ? 'px-2 py-1' : ''}`}>

          {scrolled && (
            <motion.div
              layoutId="nav-glass"
              className="absolute inset-0 glass rounded-full -z-10 shadow-lg"
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
          )}

          <div className="relative flex items-center justify-between w-full md:w-auto gap-12 md:gap-24 px-2 md:px-4 py-1.5">
            {!scrolled && (
              <motion.div
                layoutId="nav-glass"
                className="absolute inset-0 glass rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
              />
            )}

            {/* Logo */}
            <a href="#home" className="font-hero pl-2 pr-1 text-sm tracking-tight">
              adarsh<span className="text-primary">.</span>
            </a>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-foreground/10 px-3 py-1.5 text-xs font-medium transition-colors hover:text-background"
              >
                <span className="absolute left-1/2 top-1/2 z-0 h-32 w-32 -translate-x-[120%] translate-y-[80%] rounded-full bg-foreground transition-transform duration-500 ease-out group-hover:-translate-x-1/2 group-hover:-translate-y-1/2" />
                <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                  Let's Chat
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>

              <a href="https://www.linkedin.com/in/adarsh-verma-exorcist09/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-8 w-8 place-items-center rounded-full bg-foreground/10 text-foreground transition hover:bg-foreground hover:text-background md:hidden">
                <Linkedin className="h-4 w-4" />
              </a>

              <a href="https://github.com/exorcist09" target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-8 w-8 place-items-center rounded-full bg-foreground/10 text-foreground transition hover:bg-foreground hover:text-background md:hidden">
                <Github className="h-4 w-4" />
              </a>

              {/* Direct Accent Selector Button */}
              <div ref={accentRef} className="relative">
                <button
                  onClick={() => {
                    setAccentOpen((o) => !o);
                    setOpen(false);
                  }}
                  aria-label="Accent Color"
                  title="Choose Accent Color"
                  className={`relative grid h-8 w-8 place-items-center rounded-full transition hover:bg-foreground hover:text-background ${
                    accentOpen ? "bg-foreground text-background shadow-md" : "bg-foreground/10 text-foreground"
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  {/* Current Accent Dot Indicator */}
                  <span
                    className="absolute bottom-1 right-1 h-2 w-2 rounded-full border border-background"
                    style={{ backgroundColor: ACCENTS[accent]?.swatch || "currentColor" }}
                  />
                </button>

                <AnimatePresence>
                  {accentOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="glass absolute right-0 md:right-auto md:left-0 top-11 z-50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl border border-white/10"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        {(Object.keys(ACCENTS) as Accent[]).map((k) => (
                          <button
                            key={k}
                            onClick={() => {
                              setAccent(k);
                              setAccentOpen(false);
                            }}
                            aria-label={ACCENTS[k].name}
                            title={ACCENTS[k].name}
                            className={`group relative grid h-7 w-7 place-items-center rounded-full transition-transform hover:scale-110 ${
                              accent === k ? "ring-2 ring-offset-2 ring-offset-background" : ""
                            }`}
                            style={{
                              background: ACCENTS[k].swatch,
                              ["--tw-ring-color" as string]: ACCENTS[k].swatch,
                            }}
                          >
                            {accent === k && <span className="h-1.5 w-1.5 rounded-full bg-white shadow" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings Button */}
              <div ref={ddRef} className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setOpen((o) => !o);
                    setAccentOpen(false);
                  }}
                  aria-label="Settings"
                  title="Settings"
                  className={`grid h-8 w-8 place-items-center rounded-full transition hover:bg-foreground hover:text-background ${open ? "bg-foreground text-background" : "bg-foreground/10"}`}
                >
                  <Settings className="h-4 w-4" />
                </button>
                {open && (
                  <div className="glass absolute right-0 md:right-auto md:left-0 top-11 z-50 w-56 rounded-2xl p-3 shadow-2xl">
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

                    <p className="mb-2 mt-4 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Interactions</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-muted-foreground px-1 leading-relaxed md:hidden">
                        Switch to a mouse-based screen in order to use cursor modes.
                      </p>
                      <div className="hidden md:flex flex-col gap-1">
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
                      </div>
                    </div>

                    <p className="mb-2 mt-4 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Companion</p>
                    <div className="flex items-center justify-between px-1 py-0.5">
                      <span className="text-xs text-foreground/80 font-medium">Puffer</span>
                      <div className="relative flex rounded-full bg-secondary/50 p-0.5">
                        <button
                          onClick={() => setPufferEnabled(true)}
                          className={`relative z-10 px-2.5 py-1 text-xs transition-colors duration-300 ${pufferEnabled ? "text-background font-medium" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          ON
                          {pufferEnabled && (
                            <motion.div layoutId="puffer-tab" className="absolute inset-0 -z-10 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                          )}
                        </button>
                        <button
                          onClick={() => setPufferEnabled(false)}
                          className={`relative z-10 px-2.5 py-1 text-xs transition-colors duration-300 ${!pufferEnabled ? "text-background font-medium" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          OFF
                          {!pufferEnabled && (
                            <motion.div layoutId="puffer-tab" className="absolute inset-0 -z-10 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                          )}
                        </button>
                      </div>
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
              <button
                onClick={() => {
                  if (onOpenResume) onOpenResume();
                  else if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-resume-modal"));
                  }
                }}
                aria-label="AdarshVermaResume"
                title="View Resume"
                className="hover:text-foreground transition cursor-pointer"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
