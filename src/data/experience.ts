export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear: number; // 2027 is 'present'
  lane: number; // Row lane for timeline view
  active?: boolean;
  isTileOnly?: boolean;
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
    role: "Software Engineering Intern",
    period: "dec 2025 to present",
    startYear: 2025.12,
    endYear: 2027.0,
    lane: 1,
    active: true,
    description: "making fixed income investing feel simple and trustworthy.",
    bullets: [
      "design across core investing journeys for a fintech trusted with real savings.",
      "recent work is under NDA, happy to walk through it on a call.",
    ],
    logoText: "WW",
    logoBg: "#0F281E",
    logoColor: "#10B981",
  },
  {
    id: "bloop",
    company: "Bloop",
    role: "Software Engineering Intern",
    period: "jun 2023 to sep 2025",
    startYear: 2023.4,
    endYear: 2025.7,
    lane: 1,
    description: "crafted international travel booking & discover experiences for 50+ global hubs.",
    bullets: [
      "optimized high-conversion checkout flows across iOS and mobile web.",
      "spearheaded local exploration feed and real-time tour booking interfaces.",
    ],
    logoText: "hd",
    logoBg: "#2A124D",
    logoColor: "#A855F7",
  },
  {
    id: "meteorite",
    company: "Meteorite",
    role: "Frontend Developer Intern",
    period: "jul 2022 to jun 2023",
    startYear: 2022.5,
    endYear: 2023.4,
    lane: 1,
    description: "designed financial education modules and video-first interactive learning.",
    bullets: [
      "built curriculum player interface with interactive code and quiz overlays.",
    ],
    logoText: "LA",
    logoBg: "#1C1C1E",
    logoColor: "#FFFFFF",
  },
  {
    id: "iiit",
    company: "IIITDMJ",
    role: "Bachelors of Technology",
    period: "2022-2026",
    startYear: 2022.0,
    endYear: 2022.4,
    lane: 2,
    isTileOnly: true,
    description: "frontend web engineering and site optimization for SMB storefronts.",
    bullets: ["assisted small business owners launching performant e-commerce sites."],
    logoText: "GD",
    logoBg: "#083337",
    logoColor: "#06B6D4",
  },
];

