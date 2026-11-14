export interface SiteContent {
  name: string;
  role: string;
  handle: string;
  alternateHandle: string;
  avatarUrl: string;
  location: string;
  countryFlag: string;
  timeZone: string;
  weatherPlaceholder: {
    temp: string;
    condition: string;
  };
  bioParagraph1: string;
  bioParagraph2: string;
  email: string;
  calUrl?: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  agentPrompt: string;
  footerNotes: string;
}

export const siteContent: SiteContent = {
  name: "Adarsh Verma",
  role: "Engineer",
  handle: "@Adarsh",
  alternateHandle: "@exorcist",
  avatarUrl: "/adarsh.png",
  location: "India",
  countryFlag: "🇮🇳",
  timeZone: "Asia/Kolkata",
  weatherPlaceholder: {
    temp: "24°C",
    condition: "☁",
  },
  bioParagraph1:
    "Software Engineer focused on building reliable, scalable products and solving complex problems through thoughtful engineering. I enjoy working across the stack, turning ideas into well-architected systems, meaningful features, and seamless user experiences.",
  bioParagraph2:
    "Currently exploring distributed systems, cloud infrastructure, and AI-powered applications while continuously refining my approach to building software. Driven by curiosity, a passion for learning, and the ambition to build products that make a difference.",
  email: "vermaadarsh1024@gmail.com",
  calUrl: "https://cal.com/adarsh-verma/intro",
  githubUrl: "https://github.com/exorcist09",
  linkedinUrl: "https://www.linkedin.com/in/adarsh-verma-exorcist09/",
  resumeUrl: "/AdarshVermaResume.pdf",
  agentPrompt:
    "Hi there! I'm Adarsh's AI assistant. Ask me anything about his projects (Kairo, Fyn, Caseflow, etc.), tech stack, or engineering background.",
  footerNotes: "",
};
