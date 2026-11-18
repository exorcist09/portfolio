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
  "HI, I'm Orb, I know my way around Adarsh's work. Ask me about his projects, skills, or how he brings ideas to life with code. I can point you in the right direction.";

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
    // and touch dragging everywhere except within the scrollable messages container
    const container = modalContainerRef.current;
    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 640) return;
      const scrollable = scrollableContentRef.current;
      if (!scrollable || !scrollable.contains(e.target as Node)) {
        if (e.cancelable) e.preventDefault();
      }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Conversational, concise responses crafted to Adarsh's portfolio
    setTimeout(() => {
      let replyText = "";
      let action: Message["action"] = undefined;

      const q = userText.toLowerCase();

      if (q.includes("project") || q.includes("start with")) {
        replyText =
          "Start with NexMeet (real-time video conferencing) or DocuFlow (AI document intelligence). Both show complete full-stack execution and responsive UI systems.";
        action = {
          label: "View all projects",
          href: "/work",
        };
      } else if (q.includes("best") || q.includes("what do you do")) {
        replyText =
          "Adarsh excels at bridging high-performance systems with robust backend architectures — Nodejs, Python, Typescript, and distributed APIs.";
        action = {
          label: "Explore technical stack",
          href: "/skills",
        };
      } else if (q.includes("background")) {
        replyText =
          "Adarsh is a Software engineer";
        action = {
          label: "Check experience history",
          href: "#experience",
        };
      } else if (q.includes("call") || q.includes("book") || q.includes("hire") || q.includes("contact")) {
        replyText =
          "You can schedule a direct 15-minute intro call or drop an email anytime.";
        action = {
          label: "Book a 15-min call",
          href: "/work-together?from=assistant",
        };
      } else if (q.includes("email") || q.includes("reach")) {
        replyText = `Direct contact: ${siteContent.email}. Available for engineering and product roles.`;
        action = {
          label: copied ? "Copied!" : "Copy Email",
          onClick: handleCopyEmail,
        };
      } else {
        replyText =
          "I can help you explore Adarsh's featured work, stack capabilities, or schedule an introductory call.";
        action = {
          label: "Book an intro call",
          href: "/work-together?from=assistant",
        };
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
          <div className="relative z-10 flex flex-col items-end pointer-events-auto w-full max-w-[340px] sm:w-[340px]">
            {/* Close Button: Positioned outside above the chatbox (matching ResumeModal style) */}
            <div className="w-full flex justify-end mb-2.5 sm:mb-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                title="Close (Esc)"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18181B]/95 hover:bg-[#27272A] border border-white/20 text-[#EDEDEA] hover:text-white backdrop-blur-xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <X className="w-4 h-4 stroke-[2.2] group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Compact Assistant Card: Sleek monochrome glass, identical design on mobile and desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="relative w-full h-[470px] max-h-[76vh] sm:max-h-[70vh] rounded-[24px] bg-[#0c0d11]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col text-left font-sans overflow-hidden overscroll-contain"
            >
              {/* Main Content Area */}
              <div
                ref={scrollableContentRef}
                className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar"
              >
                {/* Typewriter Intro Paragraph */}
                <div className="pt-1">
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
        </div>
      )}
    </AnimatePresence>
  );
}
