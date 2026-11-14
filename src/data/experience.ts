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
  image?: string; // Custom logo image URL from /public
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
    period: "Dec 2025 — Present",
    startYear: 2025.12,
    endYear: 2027.0,
    lane: 1,
    active: true,
    image: "/skyclad_ventures.jpg",
    description:
      "",
    bullets: [
      "Owned the entire frontend from scratch (Next.js, Zustand), including payer-facing interfaces.",
      "Built the filing verification and management Frontend contract for the court E-Filing platform, working with another developer on the backend.",
      "Developed filing verification and case management workflows, streamlining document review, filing status tracking, and administrative operations across the platform.",
      "Developed 30+ reusable React and TypeScript components for Payment Center, reducing repeated frontend effort and cutting integration issues by about 40% through standardized API contracts, validation rules, and error handling.",
    ],
    logoText: "SV",
    logoBg: "#0F281E",
    logoColor: "#10B981",
  },
  {
    id: "bloop",
    company: "Bloop",
    role: "Software Engineering Intern",
    period: "Jun 2025 — Aug 2025",
    startYear: 2025.5,
    endYear: 2025.67,
    lane: 1,
    description:
      "",
    bullets: [
      "Backend development for credit-based reward systems and high-throughput RESTful services using Python and FastAPI.",
      "Redesigned credit accrual and redemption workflows to improve transaction transparency, strengthen fraud prevention, and support user engagement and retention.",
      "Improved frontend page load performance by 15% by optimizing API integration and reducing unnecessary data processing, while improving code maintainability.",
    ],
    logoText: "BL",
    logoBg: "#2A124D",
    logoColor: "#A855F7",
  },
  {
    id: "meteorite",
    company: "Meteorite Labs",
    role: "Frontend Engineer Intern",
    period: "Jan 2025 — Feb 2025",
    startYear: 2025.08,
    endYear: 2025.17,
    lane: 1,
    image: "/meteorite.jpg",
    description:
      "",
    bullets: [
      "Frontend development and MVP acceleration using Next.js, building reusable UI components and production landing pages",
      "Developed reusable dashboard components and worked with senior engineers to resolve cross-browser issues and improve frontend performance.",
    ],
    logoText: "ML",
    logoBg: "#1C1C1E",
    logoColor: "#EDEDEA",
  },
  {
    id: "iiit",
    company: "Indian Institute of Information Technology, Jabalpur",
    role: "Bachelor of Technology",
    period: "2022 — 2026",
    startYear: 2022.0,
    endYear: 2026.4,
    lane: 2,
    isTileOnly: true,
    image: "/iiitdmj.jpg",
    description: "",
    bullets: [
      "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur",
    ],
    logoText: "IIIT",
    logoBg: "#083337",
    logoColor: "#06B6D4",
  },
];
