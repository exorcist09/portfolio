import { FileText } from "lucide-react";

export function Hero() {
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
          <div className="mt-7 flex items-center gap-2">
            <a className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition hover:bg-gradient-to-tr hover:from-primary/10 hover:to-transparent hover:text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Open to contribute
            </a>
            <a
              href="/AdarshVermaResume.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="AdarshVermaResume"
              className="glass grid h-9 w-9 place-items-center rounded-full transition hover:bg-gradient-to-tr hover:from-primary/10 hover:to-transparent hover:text-primary"
            >
              <FileText className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="text-xs leading-relaxed text-muted-foreground sm:text-sm"  >
          <p>
           Software Engineer focused on building reliable, scalable products. I work across the full stack — designing systems, developing features, and crafting intuitive user experiences.
          </p>
          <p className="mt-3">
            Currently exploring distributed systems, cloud infrastructure, and AI-powered applications. Always learning, building, and refining my craft as an engineer.
          </p>
        </div>
      </div>
    </section>
  );
}
