import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildSystemInstruction, getLocalFallbackReply } from "@/lib/orb/knowledge";
import fs from "fs";
import path from "path";

export interface ChatMessagePayload {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    let apiKey = process.env.GEMINI_API_KEY;

    // Check .env / .env.local if not loaded into process.env
    if (!apiKey) {
      try {
        const envFiles = [".env.local", ".env"];
        for (const file of envFiles) {
          const filePath = path.resolve(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8");
            const match = content.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
            if (match && match[1]) {
              apiKey = match[1].trim().replace(/^["']|["']$/g, "");
              process.env.GEMINI_API_KEY = apiKey;
              break;
            }
          }
        }
      } catch {
        // Fallback safely
      }
    }

    if (!apiKey) {
      return NextResponse.json({
        message:
          "I'm not fully connected to my AI core right now. Feel free to ask about Adarsh's projects or reach out via email!",
      });
    }

    const body = await req.json().catch(() => ({}));
    const rawMessages: ChatMessagePayload[] = [];

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      for (const m of body.messages) {
        if (
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
        ) {
          rawMessages.push({
            role: m.role,
            content: m.content.slice(0, 2000).trim(),
          });
        }
      }
    } else if (typeof body.message === "string" && body.message.trim().length > 0) {
      rawMessages.push({
        role: "user",
        content: body.message.slice(0, 2000).trim(),
      });
    }

    if (rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    const recentHistory = rawMessages.slice(-10);
    const contents = recentHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Server-side dynamic date reference
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const currentDate = `${yyyy}-${mm}-${dd}`;
    const currentHumanDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

    const systemInstruction = buildSystemInstruction(currentDate, currentHumanDate);
    const ai = new GoogleGenAI({ apiKey });

    const lastUserMessage =
      [...rawMessages].reverse().find((m) => m.role === "user")?.content || "";

    // Candidate models:
    // 1. gemini-2.5-flash (fast, reliable production endpoint on Google GenAI)
    // 2. gemma-4-26b-a4b-it (portfolio-v3 model)
    const candidateModels = ["gemini-2.5-flash", "gemma-4-26b-a4b-it"];
    let replyText = "";

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        });
        const candidateText = response.text?.trim();
        if (candidateText && candidateText.length > 0) {
          replyText = candidateText;
          break;
        }
      } catch (modelErr) {
        console.warn(`Orb model [${modelName}] attempt failed:`, modelErr);
      }
    }

    if (!replyText) {
      replyText = getLocalFallbackReply(lastUserMessage);
    }

    return NextResponse.json({ message: replyText });
  } catch (error: unknown) {
    console.error("Orb API error:", error);
    let fallbackQuery = "";
    try {
      const fallbackBody = await req.json();
      fallbackQuery =
        typeof fallbackBody?.message === "string"
          ? fallbackBody.message
          : Array.isArray(fallbackBody?.messages)
          ? fallbackBody.messages[fallbackBody.messages.length - 1]?.content || ""
          : "";
    } catch {
      // ignore
    }
    return NextResponse.json({ message: getLocalFallbackReply(fallbackQuery) });
  }
}
