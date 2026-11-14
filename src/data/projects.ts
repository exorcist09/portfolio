// Projects data for portfolio
// Featured macOS-style folder cards (Kairo, KAI) + comprehensive project roster from portfolio-v3

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  href?: string;
  live?: string;
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
    live: "https://kairoworkflow-landing.vercel.app/",
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
    href: "https://github.com/exorcist09/fyn",
    github: "https://github.com/exorcist09/fyn",
    // No live link, no image as of now per user request
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
      "Finance management web application that helps users track expenses, monitor spending habits, and manage budgets through a simple, intuitive interface.",
    href: "https://fynmanager.netlify.app",
    live: "https://fynmanager.netlify.app",
    github: "https://github.com/exorcist09/fyn",
    image: "/fyn.png",
    featured: false,
    techStack: ["Spring Boot", "MySQL", "JPA", "Git"],
  },
  {
    id: "caseflow",
    title: "Caseflow",
    category: "DATA PLATFORM",
    tagline: "High-performance bulk case management & ETL platform",
    description:
      "High-performance case management platform that enables teams to import, validate, edit, clean, and bulk-create cases from large CSV datasets.",
    href: "https://caseflow-validate.vercel.app",
    live: "https://caseflow-validate.vercel.app",
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
    live: "https://natter-kvvj.onrender.com",
    github: "https://github.com/exorcist09/Natter",
    image: "/natter.png",
    featured: false,
    techStack: ["React.js", "Node.js", "WebSockets", "Zustand", "MongoDB"],
  },
  {
    id: "credit-approval",
    title: "Credit Approval System",
    category: "FINTECH & BACKEND",
    tagline: "Rule-based credit assessment & automated risk scoring",
    description:
      "Rule-based credit assessment engine that calculates creditworthiness from user purchase behavior and approves loans accordingly.",
    href: "https://github.com/exorcist09/credit-approval-system",
    github: "https://github.com/exorcist09/credit-approval-system",
    image: "/creditApprovalsystem.png",
    featured: false,
    techStack: ["Python", "Django/DRF", "Redis", "Celery", "Pandas"],
  },
  {
    id: "onebox",
    title: "Onebox - Email",
    category: "AI & PRODUCTIVITY",
    tagline: "Unified multi-account email aggregator with AI search",
    description:
      "Unified email management platform that aggregates emails from multiple accounts, provides synchronization, and supports AI-powered search and email categorization.",
    href: "https://github.com/exorcist09/onebox-email",
    github: "https://github.com/exorcist09/onebox-email",
    image: "/onebox.png",
    featured: false,
    techStack: ["Node.js", "Docker", "OpenAI"],
  },
  {
    id: "ovor",
    title: "OVOR",
    category: "CIVIC TECH",
    tagline: "Multilingual civic engagement & participatory platform",
    description:
      "Civic engagement platform that empowers citizens through multilingual access, inclusive design, and community participation.",
    href: "https://github.com/exorcist09/our-voice-our-rights",
    github: "https://github.com/exorcist09/our-voice-our-rights",
    image: "/ovor.png",
    featured: false,
    techStack: ["React.js", "Tailwind CSS", "Localization"],
  },
  {
    id: "streampod",
    title: "Streampod",
    category: "MEDIA & STREAMING",
    tagline: "Smooth video streaming & entertainment portal",
    description:
      "Video streaming platform that enables users to watch movies, web series through a seamless and responsive viewing experience.",
    href: "https://streampod-black.vercel.app/",
    live: "https://streampod-black.vercel.app/",
    github: "https://github.com/exorcist09/Stream-pod",
    image: "/streampod.png",
    featured: false,
    techStack: ["React.js", "Redux", "TailwindCSS", "MUI", "Sass"],
  },
  {
    id: "cruzo",
    title: "Cruzo",
    category: "MOBILITY & RIDE-HAILING",
    tagline: "Real-time dispatch & passenger-driver booking system",
    description:
      "Ride-hailing platform that connects passengers with nearby drivers, enabling real-time ride booking, and secure trip management.",
    href: "https://github.com/exorcist09/Cruzo",
    github: "https://github.com/exorcist09/Cruzo",
    image: "/cruzo.png",
    featured: false,
    techStack: ["Node.js", "MongoDB", "React.js", "MUI"],
  },
  {
    id: "nimonic",
    title: "Nimonic ML",
    category: "MACHINE LEARNING",
    tagline: "Machining performance prediction using experimental simulation",
    description:
      "ML system that predicts machining performance for Nimonic 263 alloy using simulation and experimental data, enabling faster process optimization and decision-making.",
    href: "https://github.com/exorcist09/nimonic_ml",
    github: "https://github.com/exorcist09/nimonic_ml",
    image: "/nimonic.png",
    featured: false,
    techStack: ["Pandas", "NumPy", "Scikit-learn", "Jupyter Notebook"],
  },
];
