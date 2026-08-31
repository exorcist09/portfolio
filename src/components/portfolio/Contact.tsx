import { useState } from "react";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

type Key = "mail" | "linkedin" | "github";

const items: { key: Key; icon: typeof Mail; label: string; value: string; href: string }[] = [
  { key: "mail", icon: Mail, label: "Email", value: "vermaadarsh1024@gmail.com", href: "mailto:vermaadarsh1024@gmail.com" },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/adarsh-verma-exorcist09", href: "https://www.linkedin.com/in/adarsh-verma-exorcist09/" },
  { key: "github", icon: Github, label: "GitHub", value: "github.com/exorcist09", href: "https://github.com/exorcist09" },
];

// Aesthetic bubbles surrounding the badge
const BUBBLES = [
  { id: 1, x: "12%", y: "45%", size: 28, delay: "0s", duration: "4.2s", opacity: 0.75 },
  { id: 2, x: "22%", y: "25%", size: 18, delay: "0.8s", duration: "5.1s", opacity: 0.6 },
  { id: 3, x: "32%", y: "65%", size: 24, delay: "1.4s", duration: "4.6s", opacity: 0.8 },
  { id: 4, x: "38%", y: "20%", size: 14, delay: "0.3s", duration: "3.8s", opacity: 0.5 },
  { id: 5, x: "44%", y: "78%", size: 20, delay: "2.1s", duration: "4.9s", opacity: 0.7 },
  { id: 6, x: "56%", y: "15%", size: 22, delay: "1.0s", duration: "5.4s", opacity: 0.7 },
  { id: 7, x: "62%", y: "75%", size: 16, delay: "0.5s", duration: "3.9s", opacity: 0.6 },
  { id: 8, x: "68%", y: "28%", size: 26, delay: "1.8s", duration: "4.8s", opacity: 0.85 },
  { id: 9, x: "78%", y: "60%", size: 18, delay: "0.2s", duration: "4.3s", opacity: 0.65 },
  { id: 10, x: "86%", y: "38%", size: 32, delay: "1.2s", duration: "5.6s", opacity: 0.8 },
  { id: 11, x: "28%", y: "40%", size: 12, delay: "0.7s", duration: "3.5s", opacity: 0.5 },
  { id: 12, x: "72%", y: "45%", size: 14, delay: "1.6s", duration: "4.1s", opacity: 0.55 },
];

export function Contact() {
  const [hovered, setHovered] = useState<Key | null>(null);
  const expanded: Key = hovered ?? "mail";

  return (
    <section id="contact" className="relative overflow-hidden px-6 pt-40 sm:pt-48 pb-12">
      <div className="mx-auto max-w-4xl">

        {/* Floating Bubbles Halo around adarshverma.xyz */}
        <div className="relative mx-auto mb-28 sm:mb-36 h-48 w-full max-w-3xl flex items-center justify-center">
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-80 rounded-full blur-2xl opacity-30"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 60%, transparent), transparent 70%)" }}
          />

          {/* Encompassing Animated Bubbles */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {BUBBLES.map((b) => (
              <div
                key={b.id}
                className="absolute rounded-full border border-primary/40 bg-gradient-to-tr from-primary/20 to-sky-400/20 backdrop-blur-[2px] shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                style={{
                  left: b.x,
                  top: b.y,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  opacity: b.opacity,
                  animation: `contactBubbleFloat ${b.duration} ease-in-out ${b.delay} infinite alternate`,
                }}
              >
                {/* Specular Highlight */}
                <div className="absolute top-1 left-1.5 h-1.5 w-1.5 rounded-full bg-white/70" />
              </div>
            ))}
          </div>

          {/* Central adarshverma.xyz Badge */}
          <div className="relative z-10 scale-110">
            <div className="glass rounded-full px-5 py-2 text-sm font-medium shadow-xl border border-primary/20 backdrop-blur-md transition-transform duration-300 hover:scale-105">
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

        <footer className="mt-32 flex items-center justify-between border-t border-border pt-6 text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} Adarsh Verma</span>
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              document.documentElement.style.scrollBehavior = "auto";
              
              const startY = window.scrollY;
              const duration = 700;
              const startTime = performance.now();

              const animateScroll = (currentTime: number) => {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
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
        @keyframes contactBubbleFloat {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.08);
          }
          100% {
            transform: translateY(-24px) scale(0.96);
          }
        }
      `}</style>
    </section>
  );
}
