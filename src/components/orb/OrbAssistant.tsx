"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, RotateCcw } from "lucide-react";
import Link from "next/link";
import { siteContent } from "@/data/content";

interface OrbAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "orb";
  text: string;
  linkText?: string;
  linkHref?: string;
  afterLinkText?: string;
  followUps?: string[];
}

const INITIAL_PROMPTS = [
  "Which project should I start with?",
  "What do you do best?",
  "What's your design + code background?",
  "How do I book a call with Adarsh?",
];

export default function OrbAssistant({ isOpen, onClose }: OrbAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
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

  // Smooth scroll within chatbox when new messages arrive
  useEffect(() => {
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTo({
        top: scrollableContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleReset = () => {
    setMessages([]);
    setInput("");
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSend = (userText: string, fromSuggestion: boolean = false) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Generate response matching the reference style in the user wireframe
    setTimeout(() => {
      const q = trimmed.toLowerCase();
      let orbReply: ChatMessage;

      // Candidate suggestions tailored to the subject matter
      let candidateFollowUps: string[] = [];
      if (q.includes("best") || q.includes("what do you do")) {
        candidateFollowUps = [
          "Which project should I start with?",
          "What's your design + code background?",
          "How do I book a call with Adarsh?",
        ];
      } else if (q.includes("project") || q.includes("start with")) {
        candidateFollowUps = [
          "What do you do best?",
          "What's your design + code background?",
          "How do I book a call with Adarsh?",
        ];
      } else if (q.includes("background") || q.includes("experience")) {
        candidateFollowUps = [
          "What do you do best?",
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
          "What do you do best?",
          "Which project should I start with?",
          "What's your design + code background?",
        ];
      } else {
        candidateFollowUps = [
          "Which project should I start with?",
          "What do you do best?",
          "What's your design + code background?",
          "How do I book a call with Adarsh?",
        ];
      }

      // "Keep exploring" only appears when user clicked a suggested prompt
      const followUps = fromSuggestion
        ? candidateFollowUps.filter((item) => item.toLowerCase() !== q)
        : undefined;

      if (q.includes("best") || q.includes("what do you do")) {
        orbReply = {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: "Adarsh is best at bridging high-performance systems with robust backend architectures — from distributed Node.js/Python microservices to real-time WebSockets and responsive interfaces. You can see the range in ",
          linkText: "his work",
          linkHref: "/work",
          afterLinkText: ".",
          followUps,
        };
      } else if (q.includes("project") || q.includes("start with")) {
        orbReply = {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: "Start with NexMeet (real-time WebRTC conferencing) or DocuFlow (AI document intelligence with vector search). Both demonstrate full-stack execution and responsive UI systems. Explore all in ",
          linkText: "his projects",
          linkHref: "/work",
          afterLinkText: ".",
          followUps,
        };
      } else if (q.includes("background") || q.includes("experience")) {
        orbReply = {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: "Adarsh is a Software Engineer who builds scalable products, intuitive web applications, and high-throughput backends. Review his full timeline in ",
          linkText: "his experience",
          linkHref: "#experience",
          afterLinkText: ".",
          followUps,
        };
      } else if (
        q.includes("call") ||
        q.includes("book") ||
        q.includes("hire") ||
        q.includes("contact")
      ) {
        orbReply = {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: "You can book a direct 15-minute intro call or send a project inquiry right from ",
          linkText: "work together",
          linkHref: "/work-together?from=assistant",
          afterLinkText: `. You can also email directly at ${siteContent.email}.`,
          followUps,
        };
      } else {
        orbReply = {
          id: (Date.now() + 1).toString(),
          sender: "orb",
          text: "I can help you explore Adarsh's featured work, tech stack, or schedule an introductory call. Discover more in ",
          linkText: "his work",
          linkHref: "/work",
          afterLinkText: ".",
          followUps,
        };
      }

      setMessages((prev) => [...prev, orbReply]);
    }, 280);
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
                        Hi, I&apos;m Orb.
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
                            <p className="text-[13.5px] text-[#EDEDEA] leading-relaxed font-normal">
                              {m.text}
                              {m.linkText && m.linkHref && (
                                <Link
                                  href={m.linkHref}
                                  onClick={onClose}
                                  className="underline underline-offset-2 decoration-white/40 hover:decoration-white text-white font-medium transition-colors"
                                >
                                  {m.linkText}
                                </Link>
                              )}
                              {m.afterLinkText}
                            </p>

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
                    placeholder="Ask about Adarsh's work..."
                    className="w-full bg-transparent text-[13px] text-[#EDEDEA] placeholder:text-[#71717A] focus:outline-none"
                  />

                  {/* Send Button */}
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
