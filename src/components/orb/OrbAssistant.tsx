"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, RotateCcw } from "lucide-react";
import Link from "next/link";

interface OrbAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "orb";
  text: string;
  followUps?: string[];
}

const INITIAL_PROMPTS = [
  "Which project should I start with?",
  "What's Adarsh's background?",
  "How do I book a call with Adarsh?",
];

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");

  const parseInline = (str: string) => {
    const parts: (string | React.ReactNode)[] = [];
    const regex =
      /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|(https?:\/\/[^\s]+))/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let key = 0;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // **bold**
        parts.push(
          <strong key={key++} className="font-semibold text-white">
            {match[2]}
          </strong>
        );
      } else if (match[3] && match[4]) {
        // [title](url)
        const isExternal = match[4].startsWith("http");
        parts.push(
          <Link
            key={key++}
            href={match[4]}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="underline underline-offset-2 decoration-white/40 hover:decoration-white text-white font-medium transition-colors"
          >
            {match[3]}
          </Link>
        );
      } else if (match[5]) {
        // raw url
        parts.push(
          <a
            key={key++}
            href={match[5]}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 decoration-white/40 hover:decoration-white text-white font-medium transition-colors break-all"
          >
            {match[5]}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-[13.5px] text-[#EDEDEA]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point: starts with * or -
        if (/^(\*|-)\s+/.test(trimmed)) {
          const content = trimmed.replace(/^(\*|-)\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full mt-2 shrink-0 bg-white/60" />
              <span className="flex-1">{parseInline(content)}</span>
            </div>
          );
        }

        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

export default function OrbAssistant({ isOpen, onClose }: OrbAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open on small screen (where background is blurred)
  // Uses bulletproof mobile scroll lock (position: fixed + scroll offset) for iOS/Android
  useEffect(() => {
    if (!isOpen) return;

    let isLocked = false;
    let savedScrollY = 0;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;

    const applyLock = () => {
      if (typeof window === "undefined") return;

      if (window.innerWidth < 640) {
        if (!isLocked) {
          savedScrollY =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
          document.body.style.position = "fixed";
          document.body.style.top = `-${savedScrollY}px`;
          document.body.style.left = "0px";
          document.body.style.right = "0px";
          document.body.style.width = "100%";
          isLocked = true;
        }
      } else {
        if (isLocked) {
          document.documentElement.style.overflow = originalHtmlOverflow;
          document.body.style.overflow = originalBodyOverflow;
          document.body.style.position = originalBodyPosition;
          document.body.style.top = originalBodyTop;
          document.body.style.left = originalBodyLeft;
          document.body.style.right = originalBodyRight;
          document.body.style.width = originalBodyWidth;
          window.scrollTo(0, savedScrollY);
          isLocked = false;
        }
      }
    };

    applyLock();
    window.addEventListener("resize", applyLock);

    // Non-passive touchmove prevention on mobile: prevents iOS / Android rubber banding
    // while keeping natural smooth scrolling inside the chatbox content area
    const container = modalContainerRef.current;
    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 640) return;
      const target = e.target as HTMLElement | null;
      const scrollable = scrollableContentRef.current;
      if (scrollable && (scrollable === target || scrollable.contains(target))) {
        return;
      }
      if (e.cancelable) e.preventDefault();
    };

    if (container) {
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("resize", applyLock);
      if (container) {
        container.removeEventListener("touchmove", handleTouchMove);
      }
      if (isLocked) {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.left = originalBodyLeft;
        document.body.style.right = originalBodyRight;
        document.body.style.width = originalBodyWidth;
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isOpen]);

  // Smooth scroll within chatbox when new messages arrive or loading changes
  useEffect(() => {
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTo({
        top: scrollableContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSend = async (userText: string, fromSuggestion: boolean = false) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Contextual follow-up suggestions for "Keep exploring"
    const q = trimmed.toLowerCase();
    let candidateFollowUps: string[] = [];
    if (q.includes("project") || q.includes("start with")) {
      candidateFollowUps = [
        "What's Adarsh's background?",
        "How do I book a call with Adarsh?",
      ];
    } else if (q.includes("background") || q.includes("experience")) {
      candidateFollowUps = [
        "Which project should I start with?",
        "How do I book a call with Adarsh?",
      ];
    } else if (
      q.includes("call") ||
      q.includes("book") ||
      q.includes("hire") ||
      q.includes("contact")
    ) {
      candidateFollowUps = [
        "Which project should I start with?",
        "What's Adarsh's background?",
      ];
    } else {
      candidateFollowUps = [
        "Which project should I start with?",
        "What's Adarsh's background?",
        "How do I book a call with Adarsh?",
      ];
    }

    const followUps = fromSuggestion
      ? candidateFollowUps.filter((item) => item.toLowerCase() !== q)
      : undefined;

    try {
      // Build conversation payload for the API route
      const payload = newMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const res = await fetch("/api/orb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: payload,
        }),
      });

      let responseText = "";
      if (res.ok) {
        const data = await res.json().catch(() => null);
        responseText = data?.message || "";
      }

      if (
        !responseText ||
        responseText.includes("momentarily busy") ||
        responseText.includes("lost connection") ||
        responseText.includes("AI currents are a bit crowded")
      ) {
        // Fallback response if API key is not configured or error occurs
        if (q.includes("best") || q.includes("what do you do")) {
          responseText =
            "Adarsh is best at bridging high-performance systems with robust backend architectures — from distributed Node.js/Python microservices to real-time WebSockets and responsive interfaces. You can see the range in [his work](/work).";
        } else if (q.includes("project") || q.includes("start with")) {
          responseText =
            "Start with [Kairo](/work/kairo) (visual workflow automation engine) or [KAI](/work/kai) (agentic AI reasoning engine). Both demonstrate deep full-stack execution and scalable system architectures. You can explore all in [his projects](/work).";
        } else if (q.includes("background") || q.includes("experience")) {
          responseText =
            "Adarsh is a Software Engineer who builds scalable products, intuitive web applications, and high-throughput backends. Review his full timeline in [his experience](#experience).";
        } else if (
          q.includes("call") ||
          q.includes("book") ||
          q.includes("schedule") ||
          q.includes("hire") ||
          q.includes("contact")
        ) {
          responseText =
            "You can book a direct 15-minute intro call on the [Work Together page](/work-together?from=assistant) or via his calendar at https://cal.com/adarsh-verma/intro. You can also email him directly at vermaadarsh1024@gmail.com.";
        } else if (
          q.includes("calculator") ||
          (q.includes("write") && q.includes("code"))
        ) {
          responseText =
            "I'm specifically focused on Adarsh's portfolio, projects, and engineering background! While I can't write general code here, you can explore Adarsh's GitHub at https://github.com/exorcist09 to see his real-world implementations. Would you like to check out any of his projects?";
        } else if (
          q.includes("exorcist") ||
          q.includes("leetcode") ||
          q.includes("handle") ||
          q.includes("profiles")
        ) {
          responseText =
            "**exorcist09** is Adarsh's universal online developer handle! You can find him across the web here:\n\n- **GitHub**: [github.com/exorcist09](https://github.com/exorcist09) — Repositories and open-source contributions\n- **LeetCode**: [leetcode.com/u/exorcist09](https://leetcode.com/u/exorcist09/) — Algorithmic problem solving and data structures\n- **LinkedIn**: [linkedin.com/in/adarsh-verma-exorcist09](https://www.linkedin.com/in/adarsh-verma-exorcist09/) — Professional experience";
        } else {
          responseText =
            "I know Adarsh's work, background, and technical projects. Ask me about his full-stack applications, skills, or how he builds software!";
        }
      }

      const orbReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "orb",
        text: responseText,
        followUps,
      };

      setMessages((prev) => [...prev, orbReply]);
    } catch (err) {
      console.error("Orb API query failed:", err);
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "orb",
        text: "I lost connection for a second. Please try asking again!",
        followUps,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={modalContainerRef}
          className="fixed inset-0 sm:inset-auto sm:bottom-[115px] sm:right-7 z-[200] flex items-center justify-center sm:items-end sm:justify-end p-4 sm:p-0 pointer-events-none select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio AI Assistant"
        >
          {/* Backdrop: blurred and darkened ONLY on small screen (< sm), completely transparent & unblurred on big screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none pointer-events-auto cursor-pointer z-0 touch-none"
            aria-label="Close assistant backdrop"
          />

          {/* Modal Wrapper holding Close button outside above + Chatbox card */}
          <div className="relative z-10 flex flex-col items-end pointer-events-auto w-full max-w-[360px] sm:w-[360px]">
            {/* Header Action Buttons: Rotate Reset button (appears only when chat happened) + Close Button */}
            <div className="w-full flex justify-end items-center gap-2 mb-2.5 sm:mb-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset chat"
                  title="Reset conversation"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#20212a]/85 hover:bg-[#2c2d38]/95 text-[#A1A1AA] hover:text-white backdrop-blur-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group border-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2] group-hover:-rotate-90 transition-transform duration-200" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                title="Close (Esc)"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#20212a]/85 hover:bg-[#2c2d38]/95 text-[#EDEDEA] hover:text-white backdrop-blur-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group border-0"
              >
                <X className="w-4 h-4 stroke-[2.2] group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Chatbox Card: Refined dark graphite glass, clearly visible against black page background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="relative w-full h-[510px] max-h-[82vh] sm:max-h-[76vh] rounded-[24px] bg-gradient-to-b from-[#20212a]/90 via-[#16171f]/88 to-[#101116]/92 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.04)] flex flex-col text-left font-sans overflow-hidden select-text border-0"
            >
              {/* Single Unified Scrollable Content Area */}
              <div
                ref={scrollableContentRef}
                className="p-5 sm:p-6 flex-1 overflow-y-auto chat-scroll flex flex-col overscroll-contain"
              >
                {/* Initial View: Static greeting & prompts when no messages have been sent */}
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Bold Header */}
                      <h2 className="text-xl sm:text-[22px] font-bold text-white tracking-tight">
                        HI, I&apos;m Orb.
                      </h2>

                      {/* Clean Intro Paragraph (No typewriter delay) */}
                      <p className="text-[13px] sm:text-[13.5px] text-[#A1A1AA] leading-relaxed mt-2.5">
                        I know my way around Adarsh&apos;s work. Ask me about his
                        projects, skills, or how he brings ideas to life with code.
                        I can point you in the right direction.
                      </p>
                    </div>

                    {/* Initial Suggested Prompts */}
                    <div className="pt-6 space-y-3">
                      {INITIAL_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(prompt, true)}
                          className="w-full text-left flex items-start gap-3 text-[13.5px] text-[#E4E4E7] hover:text-white transition-colors cursor-pointer group py-0.5"
                        >
                          <span className="text-[#71717A] group-hover:text-white transition-colors text-base leading-none select-none">
                            ↳
                          </span>
                          <span className="font-medium leading-snug">
                            {prompt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Active Conversation Thread View */
                  <div className="space-y-4">
                    {messages.map((m, idx) => (
                      <div key={m.id || idx}>
                        {m.sender === "user" ? (
                          /* User Question: Glassy Dark Pill on the Right */
                          <div className="flex justify-end pt-1">
                            <div className="max-w-[88%] text-[13px] sm:text-[13.5px] font-medium leading-relaxed bg-white/[0.08] backdrop-blur-md text-white rounded-2xl px-4 py-2 shadow-sm">
                              {m.text}
                            </div>
                          </div>
                        ) : (
                          /* Orb Response: Clean prose directly on card background */
                          <div className="pt-2 text-left">
                            <MarkdownText text={m.text} />

                            {/* Divider & Keep Exploring Suggestions (Only rendered if followUps exist) */}
                            {m.followUps && m.followUps.length > 0 && (
                              <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
                                <p className="text-[12px] font-medium text-[#71717A] mb-2.5 select-none">
                                  Keep exploring
                                </p>
                                <div className="space-y-2.5">
                                  {m.followUps.map((fu, fIdx) => (
                                    <button
                                      key={fIdx}
                                      type="button"
                                      onClick={() => handleSend(fu, true)}
                                      className="w-full text-left flex items-start gap-2.5 text-[13px] text-[#EDEDEA] hover:text-white transition-colors cursor-pointer group py-0.5"
                                    >
                                      <span className="text-[#71717A] group-hover:text-white transition-colors text-sm leading-none select-none">
                                        ↳
                                      </span>
                                      <span className="font-medium leading-snug">
                                        {fu}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading / Thinking Indicator */}
                    {isLoading && (
                      <div className="pt-2 text-left flex items-center gap-2 text-[#A1A1AA] text-xs">
                        <span>Orb is thinking</span>
                        <span className="flex gap-1 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Bottom Input Bar: Gradient continues seamlessly through the footer */}
              <div className="p-3 sm:p-4 pt-1.5 bg-transparent shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(input, false);
                  }}
                  className="w-full rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.04] hover:from-white/[0.11] hover:to-white/[0.06] backdrop-blur-md p-1.5 pl-3.5 pr-1.5 flex items-center justify-between gap-2 focus-within:from-white/[0.13] focus-within:to-white/[0.08] transition-all"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Orb about Adarsh's work..."
                    disabled={isLoading}
                    className="w-full bg-transparent text-[13px] text-[#EDEDEA] placeholder:text-[#71717A] focus:outline-none disabled:opacity-50"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    aria-label="Send query"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
