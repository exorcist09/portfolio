import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Compass } from "lucide-react";
import {
  type Message,
  INITIAL_ASSISTANT_MESSAGE,
  SUGGESTED_QUESTIONS,
  getPufferResponse,
} from "./pufferPersonality";

function PufferAvatarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="11.5" cy="12" rx="7.5" ry="6.5" />
      <circle cx="8" cy="10.5" r="1.2" fill="currentColor" />
      <path d="M11.5 5.5V3 M11.5 21v-2.5 M4 12H2 M19 12h2 M6.5 7.5L5 6 M16.5 16.5L18 18 M6.5 16.5L5 18 M16.5 7.5L18 6" />
      <path d="M19 12l3.5-3v6z" fill="currentColor" fillOpacity="0.3" />
      <path d="M12 13.5c1.5 0 2.5 1 2 2" />
    </svg>
  );
}

interface PufferAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PufferAssistant({ isOpen, onClose }: PufferAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and scroll to bottom when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  }, [isOpen]);

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clean extensible message dispatch handler
  const handleSendMessage = async (userText: string) => {
    const text = userText.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      const responseText = await getPufferResponse(text);

      const pufferMsg: Message = {
        id: `puffer-${Date.now()}`,
        sender: "puffer",
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, pufferMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `puffer-err-${Date.now()}`,
          sender: "puffer",
          text: "I'm slightly out of my depth right now. Try asking again in a moment. 🐡",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 md:right-8 z-[140] pointer-events-auto">
          {/* Close Button OUTSIDE the modal at the top right */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onClose}
            aria-label="Close Puffer assistant"
            title="Close"
            className="glass absolute -top-11 right-1 sm:-top-12 sm:right-2 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-background/80 text-foreground border border-white/20 backdrop-blur-2xl shadow-xl transition-all duration-200 hover:bg-background/95 hover:scale-110 active:scale-95 cursor-pointer group z-50"
          >
            <X className="h-4 w-4 stroke-[2.2] transition-transform duration-200 group-hover:rotate-90" />
          </motion.button>

          {/* Modal Box expanding from Puffer anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.25, x: 30, y: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.25, x: 30, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[calc(100vw-32px)] sm:w-[380px] md:w-[410px] h-[500px] max-h-[75vh] flex flex-col rounded-3xl border border-white/20 bg-background/85 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
            role="dialog"
            aria-label="Puffer Assistant"
          >
            {/* Header */}
            <div className="flex items-center px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {/* Uncolored, neutral avatar icon */}
                <div className="relative grid h-8 w-8 place-items-center rounded-full bg-white/[0.08] text-foreground border border-white/15 shadow-inner">
                  <PufferAvatarIcon className="h-4 w-4 -scale-x-100 opacity-90" />
                </div>
                <h3 className="font-hero text-sm font-semibold tracking-tight text-foreground">
                  Puffer
                </h3>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
              {messages.map((m) => {
                const isPuffer = m.sender === "puffer";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      isPuffer ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isPuffer && (
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.08] text-foreground border border-white/15 mt-0.5">
                        <PufferAvatarIcon className="h-3.5 w-3.5 -scale-x-100 opacity-80" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[82%] whitespace-pre-line ${
                        isPuffer
                          ? "glass bg-white/[0.04] text-foreground border border-white/10 shadow-sm"
                          : "bg-primary text-primary-foreground font-medium shadow-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {/* Suggested Questions Chips */}
              {messages.length === 1 && !isTyping && (
                <div className="pt-2">
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Compass className="h-3 w-3 text-primary" /> Suggested Questions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="glass rounded-full px-3 py-1.5 text-[11px] text-foreground/90 border border-white/15 bg-white/[0.03] transition-all hover:bg-primary/15 hover:border-primary/40 hover:text-primary active:scale-95 text-left cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing / Thinking Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground pl-8">
                  <span className="text-[11px] font-medium">Puffer is thinking</span>
                  <span className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about Adarsh..."
                aria-label="Ask about Adarsh"
                className="flex-1 rounded-full bg-white/[0.06] border border-white/15 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-all"
              />

              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                aria-label="Send message"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
