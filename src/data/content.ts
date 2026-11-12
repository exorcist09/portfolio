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
  bioParagraph1: {
    greeting: string;
    currentRole: string;
    company: string;
    companyIcon: string;
    secondaryRole: string;
    lab: string;
    labIcon: string;
    locationText: string;
  };
  bioParagraph2: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  agentPrompt: string;
  footerNotes: string;
}

export const siteContent: SiteContent = {
  // TODO: Your display name
  name: "Adarsh Verma",
  // TODO: Your primary role title
  role: "Software Engineer",
  // TODO: Handle displayed in contact section
  handle: "@Adarsh",
  // TODO: The handle that types out in the backspace animation
  alternateHandle: "@exorcist",
  // Profile photo url (in /public)
  avatarUrl: "/adarsh.png",
  location: "India",
  countryFlag: "🇮🇳",
  timeZone: "Asia/Kolkata",
  weatherPlaceholder: {
    temp: "24°C",
    condition: "☁",
  },
  bioParagraph1: {
    greeting: "Hey, I'm Adarsh.",
    currentRole: "Software Engineer",
    company: "",
    companyIcon: "",
    secondaryRole: "practicing Creative Technologist",
    lab: "Algorhythm Lab",
    labIcon: "🧪",
    locationText: "based in Bengaluru, India",
  },
  bioParagraph2:
    "I love working at the intersection of design, technology, and art, with a focus on building user-first and scalable — products, systems, and tools.",
  email: "vermaadarsh1024@gmail.com",
  githubUrl: "https://www.github.com/exorcist09",
  linkedinUrl: "https://www.linkedin.com/in/adarsh-verma-exorcist09/",
  resumeUrl: "/resume.pdf",
  agentPrompt:
    "Hi there! I'm Adarsh's AI avatar. Ask me anything about his skills, engineering background, or availability.",
  footerNotes: "",
};

