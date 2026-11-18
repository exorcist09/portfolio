"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, ArrowRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { siteContent } from "@/data/content";

interface OrbAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "orb" | "user";
  text: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const FULL_INTRO_TEXT =
  "I know my way around Adarsh's work. Ask me about his projects, design decisions, or how he brings ideas to life with code. I can point you in the right direction.";

const PROMPTS = [
  "Which project should I start with?",
  "What do you do best?",
  "What's your design + code background?",
  "How do I book a call with Adarsh?",
];

export default function OrbAssistant({ isOpen, onClose }: OrbAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedIntro, setTypedIntro] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for intro paragraph on open
  useEffect(() => {
    if (!isOpen) {
      setTypedIntro("");
      setIsTypingDone(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedIntro(FULL_INTRO_TEXT.slice(0, i));
      if (i >= FULL_INTRO_TEXT.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setTypedIntro(FULL_INTRO_TEXT);
    setIsTypingDone(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const lower = query.toLowerCase();

    setTimeout(() => {
      let replyText = "";
      let action: Message["action"] = undefined;

      if (
        lower.includes("which project") ||
        lower.includes("start with") ||
        lower.includes("top project")
      ) {
        replyText =
          "Start with Kairo! It's a high-performance workspace engineered with Next.js, WebGL shaders, and real-time collaboration. You can also explore all case studies on the Work page.";
        action = {
          label: "Explore Work",
          href: "/work",
        };
      } else if (
        lower.includes("what do you do best") ||
        lower.includes("best") ||
        lower.includes("strength")
      ) {
        replyText =
          "Adarsh excels at crafting fluid, high-velocity web interfaces and resilient distributed backends. From WebGL & micro-interactions to scalable Node.js architecture.";
        action = {
          label: "View Skills Matrix",
          href: "/skills",
        };
      } else if (
        lower.includes("design") ||
        lower.includes("background") ||
        lower.includes("who")
      ) {
        replyText = `${siteContent.name} is a Software Engineer based in ${siteContent.location}. He pairs obsessive attention to UI craft with deep systems engineering.`;
      } else if (
        lower.includes("book") ||
        lower.includes("call") ||
        lower.includes("meet") ||
        lower.includes("schedule")
      ) {
        replyText =
          "You can schedule a direct 15-minute introductory meeting on his calendar right here on the website.";
        action = {
          label: "Schedule a Call",
          href: "/work-together?from=home",
        };
      } else if (
        lower.includes("email") ||
        lower.includes("contact") ||
        lower.includes("reach")
      ) {
        replyText = `You can email Adarsh directly at ${siteContent.email}.`;
        action = {
          label: "Copy Email",
          onClick: handleCopyEmail,
        };
      } else {
        replyText = `Thanks for asking! You can explore Adarsh's projects, read about his experience, or reach out directly at ${siteContent.email}.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: replyText,
          action,
        },
      ]);
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed bottom-[135px] right-4 sm:bottom-[142px] sm:right-7 z-[125] flex flex-col pointer-events-none"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio AI Assistant"
        >
          {/* Subtle mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden pointer-events-auto"
          />

          {/* Compact Assistant Card: Sleek monochrome glass, opening upwards from the orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 29 }}
            style={{ transformOrigin: "bottom right" }}
            className="relative w-full max-w-[320px] sm:w-[330px] h-[440px] sm:h-[470px] max-h-[64vh] rounded-[24px] bg-[#0c0d11]/90 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/95 flex flex-col z-[130] text-left font-sans pointer-events-auto overflow-hidden"
          >
            {/* Top Close Button */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
              {/* Typewriter Intro Paragraph (No heading, no sparkle icon) */}
              <div className="pr-7 pt-1">
                <p className="text-[12.5px] sm:text-[13px] text-[#A1A1AA] leading-relaxed min-h-[46px]">
                  {typedIntro}
                  {!isTypingDone && (
                    <span className="inline-block w-1 h-3 ml-0.5 bg-white/70 animate-pulse" />
                  )}
                </p>
              </div>

              {/* Chat Stream if messages exist, otherwise Prompt List */}
              {messages.length === 0 ? (
                <div className="mt-auto mb-2 space-y-1.5">
                  {PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left flex items-start gap-2 text-[12px] text-[#8A8A85] hover:text-white transition-colors cursor-pointer group py-0.5"
                    >
                      <span className="text-[#8A8A85] group-hover:text-white transition-colors select-none">
                        ↳
                      </span>
                      <span className="leading-snug">{prompt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="my-2 space-y-2 flex-1 overflow-y-auto no-scrollbar pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] text-xs leading-relaxed ${
                          m.sender === "user"
                            ? "bg-white/12 text-white font-medium rounded-[16px] px-3.5 py-1.5"
                            : "rounded-[16px] px-3.5 py-1.5 text-xs font-sans tracking-tight bg-white/[0.06] backdrop-blur-md border border-white/[0.10] text-[#EDEDEA] shadow-sm inline-flex items-center gap-0.5"
                        }`}
                      >
                        <span>{m.text}</span>
                        {m.sender === "orb" && (
                          <span className="inline-block font-light ml-0.5 animate-pulse select-none text-white/70">
                            |
                          </span>
                        )}
                      </div>

                      {m.action && (
                        <div className="mt-1">
                          {m.action.href ? (
                            <Link
                              href={m.action.href}
                              onClick={onClose}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[11px] text-white font-medium transition-colors"
                            >
                              <span>{m.action.label}</span>
                              <ArrowRight className="w-3 h-3 text-white/80" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={m.action.onClick}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[11px] text-white font-medium transition-colors cursor-pointer"
                            >
                              <span>{m.action.label}</span>
                              {copied ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-[#8A8A85]" />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Bottom Pill Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="mt-2.5 w-full rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.10] p-1.5 pl-3.5 flex items-center justify-between gap-2 focus-within:border-white/30 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Adarsh's work..."
                  className="w-full bg-transparent text-xs text-[#EDEDEA] placeholder:text-[#606064] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Send query"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
