import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildSystemInstruction } from "@/lib/orb/knowledge";
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

    // Primary Google model from portfolio-v3: gemma-4-26b-a4b-it
    // Fallback to gemini-2.5-flash if Gemma is unavailable
    let replyText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemma-4-26b-a4b-it",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });
      replyText = response.text?.trim() || "";
    } catch (gemmaError) {
      console.warn("Gemma model attempt failed, falling back to gemini-2.5-flash:", gemmaError);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        });
        replyText = fallbackResponse.text?.trim() || "";
      } catch (fallbackError) {
        throw fallbackError;
      }
    }

    if (!replyText) {
      replyText = "I seem to have drifted a bit quiet. Ask me again!";
    }

    return NextResponse.json({ message: replyText });
  } catch (error: unknown) {
    console.error("Orb Gemini error:", error);
    const errString = String(error);
    let userMsg = "Looks like I lost connection for a moment. Please try again.";

    if (
      errString.includes("429") ||
      errString.includes("RESOURCE_EXHAUSTED") ||
      errString.includes("Quota")
    ) {
      userMsg =
        "The AI currents are a bit crowded right now (quota limit). Please wait a few seconds and ask again!";
    } else if (errString.includes("503") || errString.includes("UNAVAILABLE")) {
      userMsg = "The AI service is momentarily busy. Please try again in a few seconds!";
    }

    return NextResponse.json({ message: userMsg });
  }
}
