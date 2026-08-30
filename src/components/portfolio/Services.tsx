import { useState, useRef } from "react";
import { Terminal, AppWindow, Zap, BrainCircuit } from "lucide-react";

const services = [
  {
    title: "Backend Development",
    desc: "Building robust, scalable and secure APIs and microservices using Node.js and PostgreSQL.",
    icon: Terminal,
  },
  {
    title: "Frontend Development",
    desc: "Crafting beautiful, responsive and interactive UI with modern frameworks like React and Next.js.",
    icon: AppWindow,
  },
  {
    title: "SaaS MVP Development",
    desc: "Rapidly building and launching end-to-end scalable SaaS products from zero to one.",
    icon: Zap,
  },
  {
    title: "AI Integration",
    desc: "Empowering applications with modern AI capabilities, RAG pipelines, and intelligent agents.",
    icon: BrainCircuit,
  }
];

function ServiceCard({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-1 overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1 group/svc"
    >
      <div className="absolute inset-0 bg-border/50 transition-opacity duration-300 group-hover/svc:opacity-20" />
      {/* Outer glow (Border illumination) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in oklab, var(--primary) 40%, transparent), transparent 60%)`,
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Inner card content */}
      <div className="relative z-10 h-full w-full rounded-2xl glass border-0 p-6 text-left flex flex-col items-start gap-4">

        {/* Hover inner glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-out rounded-2xl"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in oklab, var(--primary) 5%, transparent), transparent 100%)`,
            opacity: isHovered ? 1 : 0
          }}
        />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover/svc:scale-110">
          <Icon className="h-5 w-5 relative z-10" />
        </div>
        <div className="relative z-10">
          <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative px-6 py-20 z-0 overflow-hidden">
      {/* Center gradient */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-3xl opacity-40 -z-10"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)" }} />

      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 text-xs tracking-widest text-muted-foreground">— FREELANCE —</p>
        <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">Where I pick my gear</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(s => <ServiceCard key={s.title} {...s} />)}
        </div>
      </div>
    </section>
  );
}
