// Projects data for portfolio
// Featured macOS-style folder cards (Kairo, KAI) + comprehensive project roster

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  href: string;
  github?: string;
  image?: string;
  featured: boolean;
  techStack: string[];
  gradientTheme?: {
    tabFrom: string;
    tabTo: string;
    bodyFrom: string;
    bodyVia: string;
    bodyTo: string;
    accentGlow: string;
  };
}

export const projects: Project[] = [
  {
    id: "kairo",
    title: "Kairo",
    category: "WORKFLOW AUTOMATION",
    tagline: "Visual workflow automation platform for distributed processes",
    description:
      "Visual workflow automation platform for automating business and engineering processes through an interactive DAG visual interface. Built with real-time state machines, reliable webhook consumers, and fault-tolerant retry loops.",
    href: "https://kairoworkflow-landing.vercel.app/",
    github: "https://github.com/exorcist09/kairo-v2",
    image: "/kairo.png",
    featured: true,
    techStack: ["Next.js", "Node.js", "PostgreSQL", "AWS", "Docker", "Redis"],
    gradientTheme: {
      tabFrom: "#1E344F",
      tabTo: "#152538",
      bodyFrom: "#1E344F",
      bodyVia: "#16273B",
      bodyTo: "#0F1A28",
      accentGlow: "rgba(30, 52, 79, 0.15)",
    },
  },
  {
    id: "kai",
    title: "KAI",
    category: "AGENTIC AI",
    tagline: "Multi-modal NLP reasoning agent & tool-orchestration engine",
    description:
      "Autonomous AI assistant capable of multi-step tool execution, semantic document indexing, contextual memory retrieval, and natural language database querying.",
    href: "https://fynmanager.netlify.app",
    github: "https://github.com/exorcist09/fyn",
    image: "/fyn.png",
    featured: true,
    techStack: ["Spring Boot", "Python", "LangGraph", "OpenAI / Claude", "PostgreSQL", "Redis"],
    gradientTheme: {
      tabFrom: "#1A3644",
      tabTo: "#122530",
      bodyFrom: "#1A3644",
      bodyVia: "#122631",
      bodyTo: "#0C1921",
      accentGlow: "rgba(26, 54, 68, 0.15)",
    },
  },
  {
    id: "fyn",
    title: "Fyn",
    category: "FINTECH & BUDGETING",
    tagline: "Personal finance management & budget analytics",
    description:
      "Finance management web application that helps users track expenses, monitor spending patterns across categories, and manage monthly budgets through a simple, intuitive interface.",
    href: "https://fynmanager.netlify.app",
    github: "https://github.com/exorcist09/fyn",
    image: "/fyn.png",
    featured: false,
    techStack: ["Spring Boot", "MySQL", "JPA", "React", "Chart.js"],
  },
  {
    id: "caseflow",
    title: "Caseflow",
    category: "DATA PLATFORM",
    tagline: "High-performance bulk case management & ETL platform",
    description:
      "High-performance case management platform enabling operations teams to import, validate, sanitize, edit, and bulk-create legal and enterprise cases from large CSV datasets with automated rollback support.",
    href: "https://caseflow-validate.vercel.app",
    github: "https://github.com/exorcist09/caseflow",
    image: "/caseflow.png",
    featured: false,
    techStack: ["React.js", "Express.js", "PostgreSQL", "Playwright", "TailwindCSS"],
  },
  {
    id: "natter",
    title: "Natter",
    category: "REAL-TIME CHAT",
    tagline: "Instant messaging and live presence via WebSockets",
    description:
      "Real-time chat platform supporting instant messaging, media sharing, channel rooms, and live user presence through WebSockets and optimized event loops.",
    href: "https://natter-kvvj.onrender.com",
    github: "https://github.com/exorcist09/Natter",
    image: "/natter.png",
    featured: false,
    techStack: ["React.js", "Node.js", "WebSockets", "Zustand", "MongoDB"],
  },
];
