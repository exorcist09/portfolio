import { useState } from "react";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { CommitsGrid } from "@/components/ui/commits-grid";

type Key = "mail" | "linkedin" | "github";

const items: { key: Key; icon: typeof Mail; label: string; value: string; href: string }[] = [
  { key: "mail", icon: Mail, label: "Email", value: "vermaadarsh1024@gmail.com", href: "mailto:vermaadarsh1024@gmail.com" },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/adarsh-verma-exorcist09", href: "https://www.linkedin.com/in/adarsh-verma-exorcist09/" },
  { key: "github", icon: Github, label: "GitHub", value: "github.com/exorcist09", href: "https://github.com/exorcist09" },
];

export function Contact() {
  const [hovered, setHovered] = useState<Key | null>(null);
  const expanded: Key = hovered ?? "mail";

  return (
    <section id="contact" className="relative overflow-hidden px-6 pt-24 pb-8">
      <div className="mx-auto max-w-4xl">

        {/* Animated beams */}
        <div className="group/beam relative mx-auto mb-20 max-w-3xl">
          <svg viewBox="0 0 800 200" className="h-48 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beam" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = 30 + i * 35;
              return (
                <path
                  key={i}
                  d={`M 0 ${y} C 250 ${y}, 350 100, 400 100 C 450 100, 550 ${y}, 800 ${y}`}
                  fill="none"
                  stroke="url(#beam)"
                  strokeWidth="2.5"
                  style={{ opacity: 0.6 - i * 0.08, animation: `beamPulse 6.5s ease-in-out ${i * 0.3}s infinite` }}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-110">
            <div className="glass rounded-full px-5 py-2 text-sm font-medium">
              adarshverma<span className="text-primary">.xyz</span>
            </div>
          </div>
        </div>


        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Get In <span className="text-gradient-green">Touch</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Open to interesting projects, collaborations and full-time opportunities.
          </p>
        </div>

        <div
          className="mx-auto flex h-11 w-[320px] items-stretch gap-3"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((it) => {
            const Icon = it.icon;
            const isOpen = expanded === it.key;
            return (
              <a
                key={it.key}
                href={it.href}
                target={it.key === "mail" ? undefined : "_blank"}
                rel="noreferrer"
                onMouseEnter={() => setHovered(it.key)}
                className={`glass group flex items-center overflow-hidden rounded-full text-xs font-medium transition-all duration-500 ease-out ${
                  isOpen 
                    ? "flex-[1_0_auto] px-4 bg-primary/10 text-primary border-primary/30" 
                    : "flex-[0_0_44px] justify-center px-0 text-foreground"
                }`}
                aria-label={it.label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={`truncate transition-all duration-500 ${isOpen ? "max-w-[140px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}>
                  {it.value}
                </span>
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-w-[20px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"}`}>
                  <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Adarsh / GitHub Chart Grid */}
        {/* GitHub / Commits Grid section is temporarily disabled
        <div className="mt-24 flex w-full flex-col items-center relative z-10">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />
           <div 
             className="w-full flex justify-center pt-6 translate-y-px"
             style={{ 
               maskImage: "linear-gradient(to right, transparent 2%, black 15%, black 85%, transparent 98%)", 
               WebkitMaskImage: "linear-gradient(to right, transparent 2%, black 15%, black 85%, transparent 98%)" 
             }}
           >
             <CommitsGrid 
               text="ADARSH" 
               username="exorcist09"
               className="w-full max-w-5xl bg-transparent p-0 sm:p-0 gap-[3px] sm:gap-[4px] border-none"
               noBorders={true}
               colors={[
                 "transparent",
                 "color-mix(in srgb, var(--primary) 40%, transparent)",
                 "color-mix(in srgb, var(--primary) 60%, transparent)",
                 "color-mix(in srgb, var(--primary) 80%, transparent)",
                 "var(--primary)"
               ]}
             />
           </div>
        </div> 
        */}

        <footer className="mt-32 flex items-center justify-between border-t border-border pt-6 text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} Adarsh Verma</span>
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              // Disable native CSS smooth scroll temporarily
              document.documentElement.style.scrollBehavior = "auto";
              
              const startY = window.scrollY;
              const duration = 700; // Fast 700ms scroll regardless of height
              const startTime = performance.now();

              const animateScroll = (currentTime: number) => {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // easeInOutCubic for smooth acceleration and deceleration
                const ease = progress < 0.5 
                  ? 4 * progress * progress * progress 
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(0, startY * (1 - ease));

                if (timeElapsed < duration) {
                  requestAnimationFrame(animateScroll);
                } else {
                  document.documentElement.style.scrollBehavior = "";
                  window.history.pushState(null, "", "#home");
                }
              };

              requestAnimationFrame(animateScroll);
            }}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            Back to top <ArrowUpRight className="h-3 w-3" />
          </a>
        </footer>
      </div>

      <style>{`
        @keyframes beamPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
