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
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  agentPrompt: string;
  footerNotes: string;
}

export const siteContent: SiteContent = {
  name: "Adarsh Verma",
  role: "Software Engineer",
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
    "Software Engineer building reliable, scalable products across the stack. I enjoy turning complex problems into well-designed systems, thoughtful features, and intuitive experiences.",
  bioParagraph2:
    "Currently diving deeper into distributed systems, cloud infrastructure, and AI-powered applications. Always learning, building, and refining how I engineer.",
  email: "vermaadarsh1024@gmail.com",
  githubUrl: "https://github.com/exorcist09",
  linkedinUrl: "https://www.linkedin.com/in/adarsh-verma-exorcist09/",
  resumeUrl: "/AdarshVermaResume.pdf",
  agentPrompt:
    "Hi there! I'm Adarsh's AI assistant. Ask me anything about his projects (Kairo, Fyn, Caseflow, etc.), tech stack, or engineering background.",
  footerNotes: "",
};
