// Projects data
// 2 Featured macOS-style folder cards + secondary card list with tech stacks

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description?: string;
  href: string;
  featured: boolean;
  techStack?: string[];
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
    id: "blade-design-system",
    title: "Blade Design System",
    category: "DESIGN SYSTEMS",
    tagline: "The multi-brand system powering Razorpay",
    description: "Multi-brand design system with strict accessibility, token pipelines, and production components.",
    href: "https://blade.razorpay.com",
    featured: true,
    techStack: ["React", "TypeScript", "Tailwind", "Storybook", "Figma Tokens"],
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
    id: "planet-under-pressure",
    title: "Planet under Pressure",
    category: "CREATIVE ENGINEERING",
    tagline: "Interactive storytelling tools with spatial data",
    description: "Audio-visual installation and real-time interactive mapping engine exploring climate metrics.",
    href: "https://example.com/planet-under-pressure",
    featured: true,
    techStack: ["Next.js", "WebGL", "Three.js", "WebAudio", "Tailwind"],
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
    id: "ingo-mmt-host-app",
    title: "ingo-MMT Host App",
    category: "PRODUCT DESIGN",
    tagline: "Hospitality workflow platform for property hosts",
    description: "Full-scale mobile management app enabling hosts to manage multi-property bookings and analytics.",
    href: "https://example.com/ingo-mmt",
    featured: false,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Radix UI"],
  },
  {
    id: "pen-plotter-experiments",
    title: "Pen Plotter Experiments",
    category: "GENERATIVE ART",
    tagline: "Algorithmic vector generative art pipelines on paper",
    description: "Computational geometry algorithms generating physical ink drawings using an AxiDraw pen plotter.",
    href: "https://example.com/pen-plotter",
    featured: false,
    techStack: ["Python", "Canvas API", "G-Code", "SVG", "WebGL"],
  },
  {
    id: "synth-daw-core",
    title: "Synthesizer DAW Core",
    category: "AUDIO ENGINEERING",
    tagline: "Modular web-based synth and DSP sound engine",
    description: "Real-time polyphonic synthesizer with custom wavetable oscillators and zero-latency effects.",
    href: "https://example.com/synth",
    featured: false,
    techStack: ["Web Audio API", "WebAssembly", "TypeScript", "React"],
  },
];
