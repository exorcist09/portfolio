export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear: number;
  lane: number;
  active?: boolean;
  isTileOnly?: boolean;
  image?: string; // Optional custom logo image URL (e.g. /my-logo.png)
  description: string;
  bullets?: string[];
  logoText: string;
  logoBg: string;
  logoColor: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: "skyclad",
    company: "Skyclad Ventures",
    role: "Software Engineer Intern",
    period: "Dec 2025 — Present",
    startYear: 2025.12,
    endYear: 2027.0,
    lane: 1,
    active: true,
    description: "Scalable backend engineering and product development.",
    bullets: [
      "Building scalable backend services and high-concurrency architecture.",
      "Refining core product features and distributed system infrastructure.",
    ],
    logoText: "SV",
    logoBg: "#0F281E",
    logoColor: "#10B981",
  },
  {
    id: "bloop",
    company: "Bloop",
    role: "Software Engineer Intern",
    period: "June 2025 — Aug 2025",
    startYear: 2025.5,
    endYear: 2025.67,
    lane: 1,
    description: "Software engineering, features, and system reliability.",
    bullets: [
      "Engineered performant features across mobile web and microservices.",
      "Collaborated on system reliability, state management, and user experience.",
    ],
    logoText: "BL",
    logoBg: "#2A124D",
    logoColor: "#A855F7",
  },
  {
    id: "meteorite",
    company: "Meteorite",
    role: "Frontend Developer Intern",
    period: "Jan 2025 — Feb 2025",
    startYear: 2025.08,
    endYear: 2025.17,
    lane: 1,
    description: "Frontend development, responsive user interfaces, and component architectures.",
    bullets: [
      "Built responsive UI components and interactive web interfaces.",
      "Collaborated on frontend architecture and component design systems.",
    ],
    logoText: "ME",
    logoBg: "#1C1C1E",
    logoColor: "#EDEDEA",
  },
  {
    id: "iiit",
    company: "Indian Institute of Information Technology (IIITDMJ)",
    role: "Bachelor of Technology",
    period: "2022 — 2026",
    startYear: 2022.0,
    endYear: 2026.4,
    lane: 2,
    isTileOnly: true,
    description: "Computer Science & Engineering foundation, algorithms, systems design.",
    bullets: [
      "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur.",
      "B.Tech degree with deep focus on software engineering and distributed computing.",
    ],
    logoText: "IIIT",
    logoBg: "#083337",
    logoColor: "#06B6D4",
  },
];
