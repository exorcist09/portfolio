/**
 * Curated knowledge base & personality library for Puffer
 * Adarsh's portfolio companion mascot.
 * 
 * Rules:
 * - 95% silent, 5% personality
 * - Dry, witty, slightly sarcastic, self-aware, cute
 * - Only answers questions about Adarsh and his work
 * - Prepared for future backend LLM / API integration
 */

export interface Message {
  id: string;
  sender: "puffer" | "user";
  text: string;
  timestamp: number;
}

export const INITIAL_ASSISTANT_MESSAGE: Message = {
  id: "init-welcome",
  sender: "puffer",
  text: "Hey! I'm Puffer. 🐡\n\nI can tell you about Adarsh, his work, projects, experience, and the things he likes building.\n\nWhat do you want to know?",
  timestamp: Date.now(),
};

export const SUGGESTED_QUESTIONS = [
  "What has Adarsh built?",
  "What's his tech stack?",
  "What is he currently exploring?",
  "Tell me about his experience.",
  "How can I contact him?",
];

/**
 * Curated local response engine for Puffer's personality & portfolio knowledge
 * (Used until the real AI backend LLM is plugged in)
 */
export async function getPufferResponse(query: string): Promise<string> {
  const q = query.toLowerCase().trim();

  // Simulate brief thinking time
  await new Promise((res) => setTimeout(res, 600 + Math.random() * 400));

  // 1. Out-of-Scope / Non-Adarsh questions
  if (q.includes("weather") || q.includes("temperature") || q.includes("forecast")) {
    return "I'm here to talk about Adarsh, not predict the weather. Though down here in the deep sea, it's consistently damp. 🐡";
  }

  if (q.includes("scraper") || q.includes("write code") || q.includes("generate python") || q.includes("write a script")) {
    return "Nice try. I'm Adarsh's portfolio companion, not your unpaid coding intern.";
  }

  if (q.includes("recipe") || q.includes("cook") || q.includes("food")) {
    return "I eat plankton and marine snow. You probably want Adarsh's software engineering credentials instead.";
  }

  if (q.includes("who are you") || q.includes("what are you") || q.includes("your name")) {
    return "I'm Puffer, Adarsh's portfolio mascot and silent guardian. I watch his code and ensure visitors don't get lost in the deep sea.";
  }

  // 2. Tech Stack / Skills
  if (q.includes("stack") || q.includes("tech") || q.includes("skills") || q.includes("language") || q.includes("tools")) {
    return "Adarsh works across the full stack with TypeScript, React, Next.js, Node.js, and Java on the application side, backed by PostgreSQL, MongoDB, Redis, and Kafka. He also deals with Docker, AWS, and distributed architectures.";
  }

  // 3. Projects
  if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
    return "Adarsh builds distributed systems, scalable web apps, and AI-assisted developer tooling. You can scroll through the Featured Projects section to inspect the live demos and architectures.";
  }

  // 4. Experience & Education
  if (q.includes("experience") || q.includes("intern") || q.includes("company") || q.includes("job") || q.includes("career")) {
    return "Adarsh has interned at Skyclad Ventures (Software Engineer), Bloop (Software Engineer), and Meteorite (Frontend Developer). He's currently pursuing his B.Tech at IIIT Jabalpur (2022–2026).";
  }

  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("iiit") || q.includes("degree")) {
    return "He is pursuing a Bachelor of Technology at the Indian Institute of Information Technology (IIITDM), Jabalpur (Class of 2026).";
  }

  // 5. Current Exploration / Learning
  if (q.includes("exploring") || q.includes("learning") || q.includes("currently") || q.includes("focus")) {
    return "Currently, he's diving deeper into distributed systems, cloud infrastructure, event-driven pipelines, and AI-powered applications.";
  }

  // 6. Contact / Hiring
  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach") || q.includes("touch")) {
    return "You can reach out to Adarsh directly at vermaadarsh1024@gmail.com, connect via LinkedIn (linkedin.com/in/adarsh-verma-exorcist09), or jump straight down to the 'Get In Touch' section.";
  }

  if (q.includes("resume") || q.includes("cv")) {
    return "You can click the document icon next to my 'Talk to Puffer' button or in the navbar to open his official resume in-page.";
  }

  // 7. General Adarsh summary
  if (q.includes("adarsh") || q.includes("about") || q.includes("who is")) {
    return "Adarsh Verma is a Software Engineer focused on building scalable, reliable products across the stack. He enjoys turning complex problems into clean, well-architected systems and intuitive user interfaces.";
  }

  // 8. General fallback
  return "I'm good at talking about Adarsh, his projects, and engineering experience. The rest is slightly outside my depth. 🐡";
}
