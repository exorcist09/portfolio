/**
 * Curated personality constants & API client for Puffer
 * Adarsh's portfolio companion mascot.
 *
 * Connected to Gemini 2.5 Flash via /api/puffer.
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
  text: "Hey! I'm Puffer. 🐡\n\nI can tell you about Adarsh, his work, projects, experience, and what he's building.\n\nWhat would you like to know?",
  timestamp: Date.now(),
};

export const SUGGESTED_QUESTIONS = [
  "Who is Adarsh?",
  "What projects has Adarsh built?",
  "What's his tech stack?",
  "What is he currently exploring?",
  "Tell me about his experience.",
  "How can I contact him?",
];

/**
 * Sends user prompt and recent conversation history to the /api/puffer backend.
 */
export async function getPufferResponse(query: string, history: Message[] = []): Promise<string> {
  const q = query.trim();
  if (!q) return "Say something first! 🐡";

  // Build conversation history payload (excluding the initial welcome message)
  const messagesPayload = history
    .filter((m) => m.id !== "init-welcome")
    .map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

  // Append current user message
  messagesPayload.push({
    role: "user" as const,
    content: q,
  });

  try {
    const res = await fetch("/api/puffer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesPayload,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      if (errJson?.message) {
        return errJson.message;
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data?.message || "I seem to have drifted a bit quiet. 🐡";
  } catch (err) {
    console.error("Puffer API error:", err);
    return "Looks like I lost contact with the surface for a moment. Try again. 🐡";
  }
}
