import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

type Project = {
  title: string;
  image: string;
  description: string;
  tags: string[];
  live?: string;
  github?: string;
};

const projects: Project[] = [
  {
    title: "Kairo",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    description: "A scalable task & workflow platform with real-time sync, queues and role based access.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "AWS", "Docker", "Redis"],
    live: "https://example.com",
    github: "https://github.com/exorcist09/kairo-v2",
  },
  {
    title: "Fyn",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    description: "Personal finance tracker with budgeting, categorisation and clean analytics.",
    tags: ["Springboot", "MySQL", "JPA", "Git"],
    live: "https://example.com",
    github: "https://github.com/exorcist09/fyn",
  },
  {
    title: "Caseflow",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80",
    description: "Legal case management with automated document flows and end-to-end tests.",
    tags: ["React.js", "Express.js", "PostgreSQL", "Playwright"],
    live: "https://example.com",
    github: "https://github.com/exorcist09/caseflow",
  },
  {
    title: "Natter",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    description: "Realtime chat app with websockets, presence and lightweight state.",
    tags: ["React.js", "Node.js", "WebSockets", "Zustand", "MongoDB"],
    live: "https://example.com",
    github: "https://github.com/exorcist09/Natter",
  },
  {
    title: "Credit Approval System",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&q=80",
    description: "Rule based credit scoring engine with async ingestion and background jobs.",
    tags: ["Python", "Django/DRF", "Redis", "Celery", "Pandas"],
    live: "https://github.com/exorcist09/credit-approval-system",
  },
  {
    title: "Onebox - Email",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    description: "Unified email inbox with AI categorisation and smart suggested replies.",
    tags: ["Node.js", "Docker", "OpenAI"],
    github: "https://github.com/exorcist09/onebox-email",
  },
  {
    title: "OVOR",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    description: "Civic awareness platform with multi language localisation and accessibility.",
    tags: ["React.js", "Tailwind CSS", "Localization"],
    live: "https://github.com/exorcist09/our-voice-our-rights",
  },
  {
    title: "Cruzo",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=1200&q=80",
    description: "Travel companion app to plan, share and split trips with friends.",
    tags: ["Node.js", "MongoDB", "React.js", "MUI"],
    github: "https://github.com/exorcist09/Cruzo",
  },
  {
    title: "Nimonic ML",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=1200&q=80",
    description: "Exploratory ML notebooks predicting alloy properties from compositional data.",
    tags: ["Pandas", "Numpy", "Scikit-learn", "Jupyter Notebook/"],
    github: "https://github.com/exorcist09/nimonic_ml",
  }
];

const VIEWPORT_HEIGHT = 600;

export function Projects() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [listOverflow, setListOverflow] = useState(0);

  const [cardHover, setCardHover] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (listRef.current) {
        const totalH = listRef.current.scrollHeight;
        setListOverflow(Math.max(0, totalH - VIEWPORT_HEIGHT));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const listY = useTransform(smoothProgress, [0, 1], [0, -listOverflow]);

  const active = hoveredIdx !== null ? projects[hoveredIdx] : null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${listOverflow + VIEWPORT_HEIGHT}px)` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute right-0 top-1/2 h-[800px] w-[55%] -translate-y-1/2 blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at right, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-5xl items-center gap-12 px-6" style={{ height: VIEWPORT_HEIGHT }}>

          <div className="flex shrink-0 flex-col items-center justify-center z-30">
            <h2
              className="font-display text-6xl font-bold leading-none text-foreground sm:text-7xl md:text-8xl"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Projects
            </h2>
          </div>

          <div className="relative flex h-full flex-1 justify-end">
            {/* Fixed preview card — near the left of the list area, close to heading */}
            <AnimatePresence>
              {active && (
                <motion.div
                  key="preview-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-auto absolute left-4 top-1/2 z-30 w-[260px] -translate-y-1/2 overflow-hidden rounded-xl glass border border-primary/30 shadow-2xl"
                  onMouseEnter={() => setCardHover(true)}
                  onMouseLeave={() => setCardHover(false)}
                  style={{
                    boxShadow: cardHover
                      ? "0 20px 60px -10px color-mix(in oklab, var(--primary) 40%, transparent)"
                      : undefined,
                  }}
                >
                  <div className="overflow-hidden border-b border-primary/20">
                    <motion.img
                      key={active.image}
                      src={active.image}
                      alt=""
                      className="h-36 w-full object-cover"
                      initial={{ scale: 1.05 }}
                      animate={{ scale: cardHover ? 1.08 : 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      {active.description}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {active.live && (
                        <a
                          href={active.live}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary/15 px-2 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <ExternalLink className="h-3 w-3" /> Live
                        </a>
                      )}
                      {active.github && (
                        <a
                          href={active.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground/10 px-2 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                          <Github className="h-3 w-3" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <motion.div
                ref={listRef}
                className="flex w-full flex-col z-10"
                style={{ y: listY, paddingTop: VIEWPORT_HEIGHT / 2, paddingBottom: VIEWPORT_HEIGHT / 2 }}
              >
                {projects.map((p, i) => {
                  const isHovered = hoveredIdx === i;
                  const isOtherHovered =
                    hoveredIdx !== null && hoveredIdx !== i;

                  return (
                    <div
                      key={p.title}
                      className={`group relative flex w-full shrink-0 cursor-pointer flex-col justify-center py-8 text-right transition-all duration-500 ${isOtherHovered
                        ? "opacity-20 grayscale"
                        : "opacity-100"
                        }`}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {i !== projects.length - 1 && (
                        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent to-foreground/10" />
                      )}

                      <div className="flex w-full items-center justify-end gap-6">
                        <h3
                          className={`font-hero text-lg font-bold leading-tight transition-colors duration-300 sm:text-xl md:text-2xl ${isHovered ? "text-primary" : "text-foreground"
                            }`}
                        >
                          {p.title}
                        </h3>

                        <span className="font-hero text-sm text-muted-foreground/30">
                          _{String(i + 1).padStart(2, "0")}.
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap justify-end gap-3 pr-14">
                        {p.tags.map((t, ti) => (
                          <span
                            key={t}
                            className="flex items-center gap-3 text-[10px] text-muted-foreground/50"
                          >
                            {ti > 0 && (
                              <span className="inline-block h-1 w-1 rounded-full bg-primary/40" />
                            )}
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
