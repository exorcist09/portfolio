"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Bot, User, ArrowRight } from "lucide-react";
import { siteContent } from "@/data/content";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export default function AgentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: siteContent.agentPrompt,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What kind of design systems have you built?",
    "Are you available for contract roles?",
    "What stack do you use for web projects?",
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Thanks for asking! Adarsh specializes in design systems, creative engineering, and high-craft UI/UX. Feel free to shoot an email directly at ${siteContent.email} to discuss details!`;

      const lower = userText.toLowerCase();
      if (lower.includes("system") || lower.includes("blade")) {
        reply = "Adarsh contributed to large-scale multi-brand design systems like Blade at Razorpay, focusing on token pipelines, accessible primitives, and fluid micro-interactions.";
      } else if (lower.includes("available") || lower.includes("hire") || lower.includes("contract")) {
        reply = `Adarsh is currently open for select consulting and creative technologist projects. You can ping him at ${siteContent.email} or book a quick intro call!`;
      } else if (lower.includes("stack") || lower.includes("tech")) {
        reply = "Adarsh works extensively with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Node.js, WebGL/Three.js, and Figma.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg rounded-2xl bg-[#0D0D0D] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center text-[#F5A623]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#EDEDEA]">
                    Adarsh&apos;s Agent
                  </h3>
                  <p className="text-[11px] font-mono-custom text-[#8A8A85]">
                    online • responds instantly
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8A85] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 no-scrollbar min-h-[220px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#EDEDEA] shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] text-xs sm:text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                      m.sender === "user"
                        ? "bg-[#F5A623] text-black font-medium"
                        : "bg-white/[0.06] text-[#EDEDEA] border border-white/[0.08]"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623] shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-[#8A8A85] text-xs font-mono-custom pl-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A8A85] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A8A85] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A8A85] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Quick suggested chips */}
            <div className="px-5 py-2 border-t border-white/[0.05] flex gap-2 overflow-x-auto no-scrollbar">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="shrink-0 text-[11px] font-mono-custom px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-[#8A8A85] hover:text-[#EDEDEA] border border-white/[0.06] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-4 border-t border-white/[0.08] flex items-center gap-2 bg-[#0A0A0A]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Adarsh's agent something..."
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-full px-4 py-2 text-xs sm:text-sm text-[#EDEDEA] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#F5A623]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-white text-black disabled:opacity-40 flex items-center justify-center hover:bg-[#EDEDEA] transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

