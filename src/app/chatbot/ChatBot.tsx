"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Icon } from "@iconify/react";
import Reveal from "../components/Reveal";

type ChatMessage = {
  type: "send" | "received";
  message: string;
  timestamp: Date;
};

// Offline FAQ — shown when the AI is unavailable (error / quota). Answered locally, no API call.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What does Umar do?",
    a: "Umar Suhail is a Lead Frontend Engineer & Application Developer with 7+ years of experience building high-performance React and Next.js applications. He currently works at Emirates Face Recognition (EFR) in Dubai, UAE.",
  },
  {
    q: "What's his tech stack?",
    a: "React, Next.js, TypeScript, JavaScript, Node.js, Redux, and Tailwind CSS — with a focus on scalable architecture, UI/UX, and accessibility.",
  },
  {
    q: "Notable projects?",
    a: "Emirates multi-tenant biometric dashboards (50+ tenants), a Telecom Onboarding Dashboard, an Enterprise Revenue & Billing Analytics Platform, a Loyalty Rewards Platform, GetLife Insurance Portal, and SkySearch.AI.",
  },
  {
    q: "Is he available for work?",
    a: "Yes — Umar is open to senior frontend engineering roles and select freelance projects (UAE, India, or remote).",
  },
  {
    q: "How can I contact Umar?",
    a: "Email umarsuhail112@gmail.com or connect on LinkedIn at linkedin.com/in/umar-suhail.",
  },
];

export default function ChatBot() {
  const [isChatOpened, setOpened] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const openChatBox = () => {
    setOpened(!isChatOpened);
    if (!isChatOpened && chatMessages.length === 0) {
      setChatMessages([
        {
          type: "received",
          message: "Hello! 👋 I'm Umar's AI assistant. Ask me about Umar's experience, skills, projects, and career journey.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    setLoading(true);
    const userMessage = inputValue.trim();

    setChatMessages((prev) => [
      ...prev,
      { message: userMessage, type: "send", timestamp: new Date() },
    ]);
    setInputValue("");
    setIsTyping(true);
    setShowFaq(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, id: 2 }),
      });

      const data = await response.json();

      if (data.message) {
        setChatMessages((prev) => [
          ...prev,
          { type: "received", message: data.message, timestamp: new Date() },
        ]);
      }
      // AI unavailable (error / quota) — offer offline FAQ shortcuts.
      if (data.fallback) setShowFaq(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "received",
          message: "Sorry, I'm having trouble connecting. Meanwhile, here are some quick answers:",
          timestamp: new Date(),
        },
      ]);
      setShowFaq(true);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  // Answer an FAQ locally — no API call.
  const handleFaq = (faq: { q: string; a: string }) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "send", message: faq.q, timestamp: new Date() },
      { type: "received", message: faq.a, timestamp: new Date() },
    ]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isChatOpened && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpened]);

  return (
    <>
      <button
        type="button"
        onClick={openChatBox}
        aria-label={isChatOpened ? "Close chat" : "Open chat"}
        className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-lg bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 flex items-center justify-center shadow-lg shadow-vintage-burgundy/25 hover:shadow-xl hover:shadow-vintage-burgundy/30 transition-all duration-300 hover:scale-110 active:scale-90"
      >
        {isChatOpened ? (
          <Icon icon="solar:close-circle-bold" className="text-2xl text-vintage-cream" />
        ) : (
          <Icon icon="solar:chat-round-dots-bold" className="text-2xl text-vintage-cream" />
        )}

        {!isChatOpened && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-vintage-burgundy rounded-full border-2 border-vintage-navy animate-pulse" />
        )}
      </button>

      {isChatOpened && (
          <Reveal
            y={20}
            scale={0.95}
            duration={0.3}
            className="fixed z-40 bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] vintage-card rounded-xl overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-vintage-cream/20 flex items-center justify-center">
                <Icon icon="solar:user-speak-bold" className="text-xl text-vintage-cream" />
              </div>
              <div className="flex-1">
                <h3 className="text-vintage-cream font-semibold text-sm">AI Assistant</h3>
                <p className="text-vintage-cream/70 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-vintage-cream animate-pulse" />
                  Online
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpened(false)}
                aria-label="Minimize chat"
                className="w-8 h-8 rounded-lg bg-vintage-cream/10 flex items-center justify-center hover:bg-vintage-cream/20 transition-colors"
              >
                <Icon icon="solar:minimize-bold" className="text-vintage-cream" />
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "send" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.type === "send"
                        ? "bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 text-vintage-cream rounded-br-md"
                        : "bg-vintage-slate/50 text-vintage-cream/90 rounded-bl-md"
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.type === "send" ? "text-vintage-cream/50" : "text-vintage-cream/30"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-vintage-slate/50 p-3 rounded-xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {showFaq && !isTyping && (
                <div className="flex flex-col gap-2">
                  {FAQS.map((faq) => (
                    <button
                      key={faq.q}
                      type="button"
                      onClick={() => handleFaq(faq)}
                      className="text-left text-sm px-3 py-2 rounded-lg border border-vintage-burgundy/40 bg-vintage-burgundy/10 text-vintage-cream/90 hover:bg-vintage-burgundy/20 hover:border-vintage-burgundy/60 transition-colors"
                    >
                      {faq.q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-vintage-cream/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 bg-vintage-slate/30 border border-vintage-cream/10 rounded-lg px-4 py-2.5 text-sm text-vintage-cream placeholder:text-vintage-cream/40 focus:outline-none focus:ring-2 focus:ring-vintage-burgundy/50 focus:border-vintage-burgundy disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="w-10 h-10 rounded-lg bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-vintage-burgundy/25 transition-all duration-300"
                >
                  {loading ? (
                    <Icon icon="svg-spinners:ring-resize" className="text-vintage-cream" />
                  ) : (
                    <Icon icon="solar:send-bold" className="text-vintage-cream" />
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        )}
    </>
  );
}
