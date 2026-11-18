export interface FreelanceService {
  id: string;
  category: string;
  title: string;
  description: string;
  timeline: string;
  deliverables: string[];
}

export interface FreelanceData {
  status: "available" | "limited" | "booked";
  statusText: string;
  tagline: string;
  description: string;
  services: FreelanceService[];
}

export const freelanceData: FreelanceData = {
  status: "available",
  statusText: "Available for select freelance contracts ",
  tagline: "from concept to production-grade deployment",
  description:
    "Let's work together and build products from MVP to Scale.",
  services: [
    {
      id: "mvp-engineering",
      category: "FULL-STACK ENGINEERING & BACKEND",
      title: "Product Engineering & MVP Development",
      description:
        "End-to-end development from zero to production. High-performance Backend architectures with clean APIs, database schemas, and rock-solid auth.",
      timeline: "2–4 weeks",
      deliverables: ["Next.js App Router", "PostgreSQL / Supabase", "Auth & Stripe billing", "CI/CD & Cloud Deploy"],
    },
    {
      id: "design-systems",
      category: "FRONTEND SYSTEMS",
      title: "Scalable UI & Design Systems",
      description:
        "Creating responsive, intuitive interfaces with thoughtful interactions, reusable components, and performance-focused frontend architecture.",
      timeline: "1–3 weeks",
      deliverables: ["Token Architecture", "Accessible Components", "Framer Motion Polish", "Storybook Documentation"],
    },
    {
      id: "ai",
      category: "Artificial Intelligence",
      title: "AI Integrations And Machine Learning",
      description:
        "Integrating LLMs, intelligent agents, and machine learning into applications to build smarter products and automate complex workflows.",
      timeline: "1–2 weeks",
      deliverables: ["Micro-interactions & Motion", "Custom LLM Agents & RAG", "Interactive 3D / WebGL", "High-conversion Landers"],
    },
  ],
};

