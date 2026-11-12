import { Cloud, Database, Coffee } from "lucide-react";
import { motion } from "framer-motion";

type Tech = {
  name: string;
  slug: string;
  color?: string;
  alwaysWhite?: boolean;
  colorUrlOverride?: string;
  icon?: React.ElementType;
};

const ApiIcon = ({ className, color }: { className?: string; color?: string }) => (
  <div
    className={`flex items-center justify-center font-black text-[10px] ${className}`}
    style={{ color }}
  >
    API
  </div>
);

const BearIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={color || "currentColor"}>
    <circle cx="6" cy="7" r="3.2" />
    <circle cx="18" cy="7" r="3.2" />
    <circle cx="12" cy="13" r="7.5" />
    <circle cx="6" cy="7" r="1.6" fill="rgba(0,0,0,0.3)" />
    <circle cx="18" cy="7" r="1.6" fill="rgba(0,0,0,0.3)" />
    <ellipse cx="12" cy="14.8" rx="3.5" ry="2.6" fill="rgba(255,255,255,0.85)" />
    <ellipse cx="12" cy="13.8" rx="1.2" ry="0.8" fill="#18181b" />
    <circle cx="9.2" cy="11.2" r="1.1" fill="#18181b" />
    <circle cx="14.8" cy="11.2" r="1.1" fill="#18181b" />
  </svg>
);

const PythonIcon = ({ className, color }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 110 110"
    className={className}
    fill={color || "currentColor"}
  >
    <path d="M54.5 5.5c-27 0-25.3 11.7-25.3 11.7l.1 12.1h25.8v3.6H17.8C7 32.9 0 39.4 0 54.5c0 15 6.3 22.8 15.3 22.8h8.8v-12.7c0-14.7 12.8-15.3 15.3-15.3h25.7c2.6 0 15.3-.6 15.3-15.3V17.2S81.5 5.5 54.5 5.5zM41.7 13.7a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6z" />
    <path d="M55.5 104.5c27 0 25.3-11.7 25.3-11.7l-.1-12.1H54.9v-3.6h37.3c10.8 0 17.8-6.5 17.8-21.6 0-15-6.3-22.8-15.3-22.8h-8.8v12.7c0 14.7-12.8 15.3-15.3 15.3H44.9c-2.6 0-15.3.6-15.3 15.3v16.9s-1.1 11.7 25.9 11.7zm12.8-8.2a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z" />
  </svg>
);

const groups: { label: string; items: Tech[] }[] = [
  {
    label: "Languages",
    items: [
      { name: "Java", slug: "java", icon: Coffee, color: "#FF0000" },
      { name: "Python", slug: "python", icon: PythonIcon, alwaysWhite: true },
      { name: "TypeScript", slug: "typescript", color: "#3178C6" },
      { name: "SQL", slug: "postgresql", color: "#4169E1" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "Next.js", slug: "nextdotjs", alwaysWhite: true },
      { name: "React.js", slug: "react", color: "#61DAFB" },
      { name: "Zustand", slug: "zustand", icon: BearIcon, color: "#854d0e" },
      { name: "TailwindCSS", slug: "tailwindcss", color: "#06B6D4" },
      { name: "Redux Toolkit", slug: "redux", color: "#764ABC" },
      { name: "TanStack Query", slug: "reactquery", color: "#FF4154" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
      { name: "Express.js", slug: "express", alwaysWhite: true },
      { name: "REST APIs", slug: "api", icon: ApiIcon, color: "#009688" },
      { name: "GraphQL", slug: "graphql", color: "#E10098" },
      { name: "WebSockets", slug: "socketdotio", alwaysWhite: true },
      { name: "JWT / OAuth 2.0", slug: "jsonwebtokens", alwaysWhite: true },
      { name: "Redis", slug: "redis", color: "#FF4438" },
      { name: "RabbitMQ", slug: "rabbitmq", color: "#FF6600" },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
      { name: "MySQL", slug: "mysql", color: "#4479A1" },
      { name: "MongoDB", slug: "mongodb", color: "#47A248" },
      { name: "Prisma ORM", slug: "prisma", color: "#2D3748" },
      { name: "Supabase", slug: "supabase", color: "#3ECF8E" },
    ],
  },
  {
    label: "DevOps & Cloud",
    items: [
      { name: "AWS", slug: "aws", icon: Cloud, color: "#E34F26" },
      { name: "Docker", slug: "docker", color: "#2496ED" },
      { name: "Nginx", slug: "nginx", color: "#009639" },
      { name: "Linux", slug: "linux", color: "#FCC624" },
    ],
  },
  {
    label: "AI / LLM",
    items: [
      { name: "LangChain", slug: "langchain", color: "#1C3C3C" },
      { name: "LangGraph", slug: "langgraph", color: "#1C3C3C" },
      { name: "Hugging Face", slug: "huggingface", color: "#FFD21E" },
      { name: "RAG", slug: "flickr", alwaysWhite: true },
      { name: "Vector DBs", slug: "vectordb", icon: Database, color: "#009639" },
      { name: "Agentic AI", slug: "dependabot", color: "#0366D6" },
    ],
  },
];

function Pill({ t }: { t: Tech }) {
  const whiteUrl = `https://cdn.simpleicons.org/${t.slug}/ffffff`;
  const colorUrl = t.colorUrlOverride
    ? t.colorUrlOverride
    : t.alwaysWhite
      ? whiteUrl
      : `https://cdn.simpleicons.org/${t.slug}`;

  return (
    <div className="glass group relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition hover:-translate-y-0.5">
      <span className="relative grid h-3.5 w-3.5 place-items-center">
        {t.icon ? (
          <>
            <t.icon className="h-3.5 w-3.5 transition group-hover:opacity-0 text-foreground" />
            <t.icon
              className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 text-foreground"
              color={t.alwaysWhite ? "currentColor" : t.color || "currentColor"}
            />
          </>
        ) : (
          <>
            <img
              src={whiteUrl}
              alt=""
              className="h-3.5 w-3.5 transition group-hover:opacity-0 invert dark:invert-0"
              loading="lazy"
            />
            <img
              src={colorUrl}
              alt=""
              className={`absolute inset-0 h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 ${t.alwaysWhite ? "invert dark:invert-0" : ""}`}
              loading="lazy"
            />
          </>
        )}
      </span>
      <span className="text-foreground/80 transition group-hover:text-foreground whitespace-nowrap">
        {t.name}
      </span>
      <span
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition group-hover:opacity-100"
        style={{
          boxShadow: t.alwaysWhite
            ? `0 0 24px -6px color-mix(in oklab, var(--foreground) 40%, transparent)`
            : `0 0 24px -6px ${t.color || "#ffffff"}66`,
        }}
      />
    </div>
  );
}

export function TechStack() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-32 z-0">
      {/* Center gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-3xl opacity-40 -z-10"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs tracking-widest text-muted-foreground">— TECH —</p>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Dive Gear</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          The tools I take into the deep.
        </p>

        {/* Desktop View */}
        <div className="mt-12 hidden md:block space-y-5">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {g.label}
              </span>
              {g.items.map((t) =>
                t.name === "Agentic AI" ? (
                  <span key={g.label + t.name} className="contents">
                    <div className="w-full" />
                    <Pill t={t} />
                  </span>
                ) : (
                  <Pill key={g.label + t.name} t={t} />
                ),
              )}
            </div>
          ))}
        </div>

        {/* Mobile View: Marquee */}
        <div className="mt-12 flex flex-col gap-6 md:hidden">
          {groups.map((g, groupIndex) => {
            const direction = groupIndex % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"];
            return (
              <div key={g.label} className="flex flex-col items-center">
                <span className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {g.label}
                </span>
                <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <motion.div
                    className="flex w-max shrink-0 gap-3 px-1.5 hover:[animation-play-state:paused]"
                    animate={{ x: direction }}
                    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                  >
                    {[...g.items, ...g.items, ...g.items, ...g.items].map((t, i) => (
                      <Pill key={g.label + t.name + i} t={t} />
                    ))}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
