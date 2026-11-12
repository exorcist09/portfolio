// Projects data from portfolio-v3
// 2 Featured macOS-style folder cards (Kairo, Fyn) + secondary card list with tech stacks

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
    tagline: "Visual workflow automation platform for processes",
    description:
      "Visual workflow automation platform for automating processes through an interactive visual interface. Built with a focus on scalability, reliability, and user experience.",
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
    category: "Agentic AI",
    tagline: "NLP understanding agent",
    description:
      "Finance management webapp that helps users track expenses, monitor spending habits, and manage budgets through a simple, intuitive interface.",
    href: "https://fynmanager.netlify.app",
    github: "https://github.com/exorcist09/fyn",
    image: "/fyn.png",
    featured: true,
    techStack: ["Springboot", "MySQL", "JPA", "Git"],
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
      "Finance management webapp that helps users track expenses, monitor spending habits, and manage budgets through a simple, intuitive interface.",
    href: "https://fynmanager.netlify.app",
    github: "https://github.com/exorcist09/fyn",
    image: "/fyn.png",
    featured:false,
    techStack: ["Springboot", "MySQL", "JPA", "Git"],
  },
  {
    id: "caseflow",
    title: "Caseflow",
    category: "DATA PLATFORM",
    tagline: "High-performance bulk case management platform",
    description:
      "High-performance case management platform enabling teams to import, validate, edit, clean, and bulk-create cases from large CSV datasets.",
    href: "https://caseflow-validate.vercel.app",
    github: "https://github.com/exorcist09/caseflow",
    image: "/caseflow.png",
    featured: false,
    techStack: ["React.js", "Express.js", "PostgreSQL", "Playwright"],
  },
  {
    id: "natter",
    title: "Natter",
    category: "REAL-TIME CHAT",
    tagline: "Instant messaging and live presence via WebSockets",
    description:
      "Real-time chat platform supporting instant messaging, media sharing, and live user presence through WebSockets and modern web technologies.",
    href: "https://natter-kvvj.onrender.com",
    github: "https://github.com/exorcist09/Natter",
    image: "/natter.png",
    featured: false,
    techStack: ["React.js", "Node.js", "WebSockets", "Zustand", "MongoDB"],
  },
];
