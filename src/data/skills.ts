// Skills with pure Lucide icons (white/monochrome, zero emoji/color)

export interface SkillItem {
  id: string;
  name: string;
  iconName: string;
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
      { id: "ts", name: "TypeScript", iconName: "Code2" },
      { id: "next", name: "Next.js", iconName: "Globe" },
      { id: "react", name: "React", iconName: "Layers" },
      { id: "python", name: "Python", iconName: "Terminal" },
      { id: "tailwind", name: "Tailwind CSS", iconName: "Palette" },
      { id: "framer", name: "Framer Motion", iconName: "Sparkles" },
      { id: "tanstack", name: "TanStack Query", iconName: "RefreshCw" },
      { id: "redux", name: "Redux Toolkit", iconName: "Cpu" },
    ],
  },
  {
    id: "row-2",
    direction: "right",
    speedClass: "animate-marquee-slow-right",
    items: [
      { id: "node", name: "Node.js", iconName: "Server" },
      { id: "postgres", name: "PostgreSQL", iconName: "Database" },
      { id: "redis", name: "Redis", iconName: "Zap" },
      { id: "websockets", name: "WebSockets", iconName: "Radio" },
      { id: "supabase", name: "Supabase", iconName: "ShieldCheck" },
      { id: "prisma", name: "Prisma ORM", iconName: "Blocks" },
      { id: "graphql", name: "GraphQL", iconName: "Workflow" },
      { id: "docker", name: "Docker", iconName: "Box" },
    ],
  },
  {
    id: "row-3",
    direction: "left",
    speedClass: "animate-marquee-slow-left",
    items: [
      { id: "rag", name: "RAG Systems", iconName: "Braces" },
      { id: "vectordb", name: "Vector DBs", iconName: "HardDrive" },
      { id: "agentic", name: "Agentic AI", iconName: "Bot" },
      { id: "aws", name: "AWS Cloud", iconName: "Cloud" },
      { id: "linux", name: "Linux", iconName: "Terminal" },
      { id: "nginx", name: "Nginx", iconName: "Server" },
      { id: "cloudflare", name: "Cloudflare", iconName: "Shield" },
      { id: "figma", name: "Figma", iconName: "Component" },
    ],
  },
];
