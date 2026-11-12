// Skills data with SimpleIcons slugs for authentic logos

export interface SkillItem {
  id: string;
  name: string;
  slug?: string;
  iconName?: string;
}

export interface SkillRow {
  id: string;
  direction: "left" | "right";
  speedClass: string;
  items: SkillItem[];
}

export const skillRows: SkillRow[] = [
  {
    id: "row-1",
    direction: "left",
    speedClass: "animate-marquee-slow-left",
    items: [
      { id: "next", name: "Next.js", slug: "nextdotjs" },
      { id: "react", name: "React.js", slug: "react" },
      { id: "ts", name: "TypeScript", slug: "typescript" },
      { id: "python", name: "Python", slug: "python" },
      { id: "java", name: "Java", slug: "java" },
      { id: "tailwind", name: "TailwindCSS", slug: "tailwindcss" },
      { id: "zustand", name: "Zustand", slug: "zustand" },
      { id: "redux", name: "Redux Toolkit", slug: "redux" },
      { id: "tanstack", name: "TanStack Query", slug: "reactquery" },
    ],
  },
  {
    id: "row-2",
    direction: "right",
    speedClass: "animate-marquee-slow-right",
    items: [
      { id: "node", name: "Node.js", slug: "nodedotjs" },
      { id: "express", name: "Express.js", slug: "express" },
      { id: "postgres", name: "PostgreSQL", slug: "postgresql" },
      { id: "redis", name: "Redis", slug: "redis" },
      { id: "rabbitmq", name: "RabbitMQ", slug: "rabbitmq" },
      { id: "websockets", name: "WebSockets", slug: "socketdotio" },
      { id: "mysql", name: "MySQL", slug: "mysql" },
      { id: "mongodb", name: "MongoDB", slug: "mongodb" },
      { id: "prisma", name: "Prisma ORM", slug: "prisma" },
      { id: "supabase", name: "Supabase", slug: "supabase" },
    ],
  },
  {
    id: "row-3",
    direction: "left",
    speedClass: "animate-marquee-slow-left",
    items: [
      { id: "aws", name: "AWS", slug: "aws" },
      { id: "docker", name: "Docker", slug: "docker" },
      { id: "nginx", name: "Nginx", slug: "nginx" },
      { id: "linux", name: "Linux", slug: "linux" },
      { id: "langchain", name: "LangChain", slug: "langchain" },
      { id: "langgraph", name: "LangGraph", slug: "langgraph" },
      { id: "huggingface", name: "Hugging Face", slug: "huggingface" },
      { id: "graphql", name: "GraphQL", slug: "graphql" },
      { id: "agentic", name: "Agentic AI", slug: "dependabot" },
    ],
  },
];
