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
      title: "Rapid MVP & Product Builds",
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
        "Building accessible, token-driven component libraries that bridge Figma with code. Fast, responsive interfaces your engineers love shipping with.",
      timeline: "1–3 weeks",
      deliverables: ["Token Architecture", "Accessible Components", "Framer Motion Polish", "Storybook Documentation"],
    },
    {
      id: "ai",
      category: "Artificial Intelligence",
      title: "AI Integrations And Machine Learning",
      description:
        "Spatial web storytelling, fluid micro-interactions, and LLM agent pipelines that turn standard websites into memorable product experiences.",
      timeline: "1–2 weeks",
      deliverables: ["Micro-interactions & Motion", "Custom LLM Agents & RAG", "Interactive 3D / WebGL", "High-conversion Landers"],
    },
  ],
};

