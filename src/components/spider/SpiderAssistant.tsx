"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, ArrowRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { siteContent } from "@/data/content";

interface SpiderAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "spider" | "user";
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

export default function SpiderAssistant({ isOpen, onClose }: SpiderAssistantProps) {
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
    }, 14);

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

    // Immediately complete intro typing if ongoing
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
          sender: "spider",
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
          className="fixed inset-0 z-[90] flex items-end justify-center sm:justify-end p-4 sm:p-0 sm:bottom-9 sm:right-16 pointer-events-none"
          role="dialog"
          aria-modal="true"
          aria-label="Spidy AI Assistant"
        >
          {/* Subtle mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden pointer-events-auto"
          />

          {/* Assistant Card: Glass effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-[325px] sm:w-[335px] h-[580px] sm:h-[610px] max-h-[88vh] rounded-[28px] bg-[#0d0e12]/80 backdrop-blur-xl border border-white/[0.10] shadow-2xl shadow-black/80 flex flex-col z-[90] text-left font-sans pointer-events-auto overflow-hidden"
          >
            {/* Top Close Button */}
            <div className="absolute top-4 right-4 z-10">
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
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
              {/* Top Greeting & Intro - Title in compact size */}
              <div>
                <h2 className="text-[17px] sm:text-[18px] font-semibold text-white tracking-tight mb-1.5">
                  Hey, I&apos;m Spidy.
                </h2>
                <p className="text-[12px] sm:text-[12.5px] text-[#A1A1AA] leading-relaxed min-h-[50px]">
                  {typedIntro}
                  {!isTypingDone && (
                    <span className="inline-block w-1 h-3 ml-0.5 bg-[var(--accent)] animate-pulse" />
                  )}
                </p>
              </div>

              {/* Chat Stream if messages exist, otherwise Prompt List sitting immediately above input */}
              {messages.length === 0 ? (
                <div className="mt-auto mb-2.5 space-y-2">
                  {PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left flex items-start gap-2 text-[12.5px] text-[#8A8A85] hover:text-white transition-colors cursor-pointer group py-1"
                    >
                      <span className="text-[#8A8A85] group-hover:text-[var(--accent)] transition-colors select-none">
                        ↳
                      </span>
                      <span className="leading-snug">{prompt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="my-2 space-y-2.5 flex-1 overflow-y-auto no-scrollbar pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Glass background for Spidy's messages */}
                      <div
                        className={`max-w-[88%] text-xs leading-relaxed ${
                          m.sender === "user"
                            ? "bg-white/10 text-white font-medium rounded-[18px] px-3.5 py-2"
                            : "rounded-[18px] px-3.5 py-2 text-xs font-sans tracking-tight bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#EDEDEA] shadow-sm inline-flex items-center gap-0.5"
                        }`}
                      >
                        <span>{m.text}</span>
                        {m.sender === "spider" && (
                          <span className="inline-block font-light ml-0.5 animate-pulse select-none text-[var(--accent)]">
                            |
                          </span>
                        )}
                      </div>

                      {m.action && (
                        <div className="mt-1.5">
                          {m.action.href ? (
                            <Link
                              href={m.action.href}
                              onClick={onClose}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[11px] text-white font-medium transition-colors"
                            >
                              <span>{m.action.label}</span>
                              <ArrowRight className="w-3 h-3 text-[var(--accent)]" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={m.action.onClick}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[11px] text-white font-medium transition-colors cursor-pointer"
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
                className="mt-3 w-full rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.10] p-1.5 pl-3.5 flex items-center justify-between gap-2 focus-within:border-white/25 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Spidy about Adarsh..."
                  className="w-full bg-transparent text-xs text-[#EDEDEA] placeholder:text-[#606064] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Send query"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
