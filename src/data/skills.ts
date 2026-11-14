// Skills data with SimpleIcons slugs for authentic logos
// Supports both home page marquee and the comprehensive /skills 3-column page

export interface SkillItem {
  id: string;
  name: string;
  slug?: string;
  iconName?: string;
  proficiency?: string;
  note?: string;
}

export interface SkillRow {
  id: string;
  direction: "left" | "right";
  speedClass: string;
  items: SkillItem[];
}

export interface TopTool {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  slug?: string;
  badge: string;
}

export interface SkillColumn {
  id: string;
  title: string;
  description: string;
  items: SkillItem[];
}

// Top tools explicitly requested by the user:
// "mention the top things I use -> typescript, codex, cursor, and other ai agent skills"
export const topTools: TopTool[] = [
  {
    id: "typescript",
    name: "TypeScript",
    category: "PRIMARY LANGUAGE",
    tagline: "End-to-end type safety & scalable architectures",
    description:
      "Core language for full-stack engineering across Next.js, Node.js, and distributed microservices. Strict type checking, zero-runtime overhead contracts, and resilient domain modeling.",
    slug: "typescript",
    badge: "Daily Driver",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "AI-FIRST DEVELOPMENT",
    tagline: "AI-native IDE for speculative coding & codebases",
    description:
      "Primary coding environment leveraging codebase embeddings, semantic indexing, Composer agents, and multi-file reasoning to build and ship production features rapidly.",
    slug: "cursor",
    badge: "Primary IDE",
  },
  {
    id: "codex",
    name: "Codex & LLMs",
    category: "CODE INTELLIGENCE",
    tagline: "OpenAI Codex, Claude 3.7 & frontier reasoning models",
    description:
      "Deep algorithmic synthesis, automated unit test suites, complex refactorings, and AST-aware code transformation pipelines powered by state-of-the-art LLMs.",
    slug: "openai",
    badge: "Engine",
  },
  {
    id: "ai-agents",
    name: "AI Agent Skills",
    category: "AUTONOMOUS SYSTEMS",
    tagline: "Tool calling, Model Context Protocol (MCP) & LangGraph",
    description:
      "Designing stateful autonomous agent loops, custom MCP tools, dynamic graph execution (LangGraph), multi-agent consensus, memory persistence, and sandbox evaluation.",
    slug: "langchain",
    badge: "Core Focus",
  },
];

// Three technical skill columns explicitly requested:
// "adn then in three columsn the tech skill with name are writtein ok"
export const skillColumns: SkillColumn[] = [
  {
    id: "frontend-languages",
    title: "Frontend & Languages",
    description: "Interfaces, state machines & type systems",
    items: [
      { id: "ts", name: "TypeScript", slug: "typescript", proficiency: "Expert" },
      { id: "js", name: "JavaScript (ESNext)", slug: "javascript", proficiency: "Expert" },
      { id: "python", name: "Python", slug: "python", proficiency: "Advanced" },
      { id: "java", name: "Java", slug: "java", proficiency: "Proficient" },
      { id: "next", name: "Next.js (App Router)", slug: "nextdotjs", proficiency: "Expert" },
      { id: "react", name: "React 19 / React.js", slug: "react", proficiency: "Expert" },
      { id: "tailwind", name: "Tailwind CSS v4", slug: "tailwindcss", proficiency: "Expert" },
      { id: "zustand", name: "Zustand", slug: "zustand", proficiency: "Advanced" },
      { id: "redux", name: "Redux Toolkit", slug: "redux", proficiency: "Proficient" },
      { id: "tanstack", name: "TanStack Query", slug: "reactquery", proficiency: "Advanced" },
      { id: "htmlcss", name: "HTML5 / Modern CSS", slug: "html5", proficiency: "Expert" },
    ],
  },
  {
    id: "backend-systems",
    title: "Backend & Systems",
    description: "Distributed APIs, databases & concurrency",
    items: [
      { id: "node", name: "Node.js", slug: "nodedotjs", proficiency: "Expert" },
      { id: "express", name: "Express.js", slug: "express", proficiency: "Expert" },
      { id: "springboot", name: "Spring Boot", slug: "springboot", proficiency: "Proficient" },
      { id: "postgres", name: "PostgreSQL", slug: "postgresql", proficiency: "Advanced" },
      { id: "mongodb", name: "MongoDB", slug: "mongodb", proficiency: "Advanced" },
      { id: "redis", name: "Redis", slug: "redis", proficiency: "Advanced" },
      { id: "mysql", name: "MySQL", slug: "mysql", proficiency: "Proficient" },
      { id: "websockets", name: "WebSockets", slug: "socketdotio", proficiency: "Advanced" },
      { id: "prisma", name: "Prisma ORM", slug: "prisma", proficiency: "Advanced" },
      { id: "supabase", name: "Supabase", slug: "supabase", proficiency: "Advanced" },
      { id: "rest-graphql", name: "REST & GraphQL", slug: "graphql", proficiency: "Advanced" },
    ],
  },
  {
    id: "ai-cloud-devops",
    title: "AI, Cloud & DevOps",
    description: "Agentic pipelines, orchestration & infra",
    items: [
      { id: "cursor-tool", name: "Cursor & Codex", slug: "cursor", proficiency: "Core Tool" },
      { id: "agentic-ai", name: "Agentic AI & MCP", slug: "dependabot", proficiency: "Specialist" },
      { id: "langchain-tool", name: "LangChain / LangGraph", slug: "langchain", proficiency: "Advanced" },
      { id: "huggingface", name: "Hugging Face Models", slug: "huggingface", proficiency: "Proficient" },
      { id: "docker", name: "Docker", slug: "docker", proficiency: "Advanced" },
      { id: "aws", name: "AWS (S3, EC2, ECS)", slug: "aws", proficiency: "Proficient" },
      { id: "linux", name: "Linux / Shell Scripting", slug: "linux", proficiency: "Advanced" },
      { id: "nginx", name: "Nginx", slug: "nginx", proficiency: "Proficient" },
      { id: "git", name: "Git & GitHub Actions", slug: "git", proficiency: "Expert" },
      { id: "rabbitmq", name: "RabbitMQ", slug: "rabbitmq", proficiency: "Proficient" },
      { id: "vectordb", name: "Vector Databases", slug: "opensearch", proficiency: "Advanced" },
    ],
  },
];

// Marquee rows used by the home page Stack component
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
      { id: "websockets", name: "WebSockets", slug: "websockets" },
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
      { id: "cursor", name: "Cursor", slug: "cursor" },
      { id: "claude", name: "Claude", slug: "claude" },
      { id: "agentic", name: "Agentic AI", slug: "agentic-ai" },
      { id: "langchain", name: "LangChain", slug: "langchain" },
      { id: "aws", name: "AWS", slug: "aws" },
      { id: "docker", name: "Docker", slug: "docker" },
      { id: "nginx", name: "Nginx", slug: "nginx" },
      { id: "linux", name: "Linux", slug: "linux" },
      { id: "git", name: "Git", slug: "git" },
      { id: "graphql", name: "GraphQL", slug: "graphql" },
    ],
  },
];
