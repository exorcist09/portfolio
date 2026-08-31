import { FileText } from "lucide-react";

function PufferIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Round puffer body */}
      <ellipse cx="11.5" cy="12" rx="7.5" ry="6.5" />
      {/* Eye */}
      <circle cx="8" cy="10.5" r="1.2" fill="currentColor" />
      {/* Spikes around body */}
      <path d="M11.5 5.5V3 M11.5 21v-2.5 M4 12H2 M19 12h2 M6.5 7.5L5 6 M16.5 16.5L18 18 M6.5 16.5L5 18 M16.5 7.5L18 6" />
      {/* Tail Fin */}
      <path d="M19 12l3.5-3v6z" fill="currentColor" fillOpacity="0.3" />
      {/* Pectoral Fin */}
      <path d="M12 13.5c1.5 0 2.5 1 2 2" />
    </svg>
  );
}

interface HeroProps {
  onOpenResume?: () => void;
}

export function Hero({ onOpenResume }: HeroProps) {
  const handleTalkWithPuffer = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("talk-with-puffer"));
    }
  };

  const handleOpenResume = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenResume) {
      onOpenResume();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-resume-modal"));
    }
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28">
      {/* Green gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)" }} />

      <div className="relative z-10 mx-auto grid w-full max-w-3xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-3 text-xs tracking-widest text-muted-foreground">Hi, I'm</p>
          <h1 className="font-hero leading-[1] tracking-tight">
            <span className="block text-4xl sm:text-5xl">Adarsh</span>
            <span className="block text-5xl text-gradient-green sm:text-6xl md:text-7xl">Verma</span>
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTalkWithPuffer}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition hover:bg-gradient-to-tr hover:from-primary/10 hover:to-transparent hover:text-primary group cursor-pointer"
            >
              <PufferIcon className="h-4 w-4 -scale-x-100 text-primary transition-transform duration-300 group-hover:scale-125" />
              <span>Talk to Puffer</span>
            </button>

            <button
              onClick={handleOpenResume}
              aria-label="View Resume"
              title="View Resume"
              className="glass grid h-9 w-9 place-items-center rounded-full transition hover:bg-gradient-to-tr hover:from-primary/10 hover:to-transparent hover:text-primary cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          <p>
            Software Engineer building reliable, scalable products across the stack. I enjoy turning complex problems into well-designed systems, thoughtful features, and intuitive experiences.
          </p>
          <p className="mt-3">
            Currently diving deeper into distributed systems, cloud infrastructure, and AI-powered applications. Always learning, building, and refining how I engineer.
          </p>
        </div>
      </div>
    </section>
  );
}
