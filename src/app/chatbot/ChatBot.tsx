"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Icon } from "@iconify/react";

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
    a: "Emirates multi-tenant biometric dashboards for 50+ banks and financial institutions, a Telecom Onboarding Dashboard, an Enterprise Revenue & Billing Analytics Platform, a Loyalty Rewards Platform, GetLife Insurance Portal, and SkySearch.AI.",
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
  const [isChatMounted, setChatMounted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const openCloseTimeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const closeChatBox = () => {
    setOpened(false);
    openCloseTimeoutRef.current = window.setTimeout(() => {
      setChatMounted(false);
      openCloseTimeoutRef.current = null;
    }, 360);
  };

  const openChatBox = () => {
    if (openCloseTimeoutRef.current) {
      window.clearTimeout(openCloseTimeoutRef.current);
      openCloseTimeoutRef.current = null;
    }

    if (isChatOpened) {
      closeChatBox();
      return;
    }

    setChatMounted(true);
    setOpened(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          type: "received",
          message: "Hi there! I'm Umar's AI assistant. Ask me about Umar's experience, skills, projects, or how to get in touch.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    const handler = () => {
      if (openCloseTimeoutRef.current) {
        window.clearTimeout(openCloseTimeoutRef.current);
        openCloseTimeoutRef.current = null;
      }
      if (!isChatMounted) setChatMounted(true);
      setOpened(true);
      if (chatMessages.length === 0) {
        setChatMessages([
          {
            type: "received",
            message: "Hi there! I'm Umar's AI assistant. Ask me about Umar's experience, skills, projects, or how to get in touch.",
            timestamp: new Date(),
          },
        ]);
      }
    };
    window.addEventListener("open-portfolio-chat", handler);

    return () => window.removeEventListener("open-portfolio-chat", handler);
  }, [chatMessages, isChatMounted]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    setLoading(true);
    const userMessage = inputValue.trim();

    const currentMessages: ChatMessage[] = [
      ...chatMessages,
      { message: userMessage, type: "send", timestamp: new Date() },
    ];
    setChatMessages(currentMessages);
    setInputValue("");
    setIsTyping(true);
    setShowFaq(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: currentMessages.map((msg) => ({
            role: msg.type === "send" ? "user" : "assistant",
            message: msg.message,
          })),
        }),
      });

      const data = await response.json();

      if (data.message) {
        setChatMessages((prev) => [
          ...prev,
          { type: "received", message: data.message, timestamp: new Date() },
        ]);
      }
      // AI unavailable (error / quota) — open the consistent HelpWidget and show inline FAQ.
      if (data.fallback) {
        setShowFaq(true);
        window.dispatchEvent(new CustomEvent("open-help"));
      }
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
      // Also open the HelpWidget and show inline FAQ to present consistent help when AI is down.
      setShowFaq(true);
      window.dispatchEvent(new CustomEvent("open-help"));
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

  // Listen for FAQ submissions dispatched from the HelpWidget (modal) so users
  // can pick a quick answer from the help dialog and have it inserted into chat.
  useEffect(() => {
    const onSubmitFaq = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.q && detail.a) {
        handleFaq(detail);
      }
    };

    window.addEventListener("submit-faq", onSubmitFaq as EventListener);
    return () => window.removeEventListener("submit-faq", onSubmitFaq as EventListener);
  }, [chatMessages]);

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

  useEffect(() => {
    return () => {
      if (openCloseTimeoutRef.current) {
        window.clearTimeout(openCloseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openChatBox}
        aria-label={isChatOpened ? "Close chat" : "Open chat"}
        aria-expanded={isChatOpened}
        className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 flex items-center justify-center shadow-lg shadow-vintage-burgundy/25 transition-all duration-300 ${
          isChatOpened ? "shadow-xl shadow-vintage-burgundy/40" : "hover:scale-110 active:scale-90"
        }`}
      >
        <Icon
          icon={isChatOpened ? "solar:close-circle-bold" : "solar:chat-round-dots-bold"}
          className={`text-2xl text-vintage-cream transition-transform duration-300 ${
            isChatOpened ? "scale-125" : "scale-100"
          }`}
        />

        {!isChatOpened && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-vintage-burgundy rounded-full border-2 border-vintage-navy animate-pulse" />
        )}
      </button>

      {isChatMounted && (
        <div
          role="dialog"
          aria-label="Umar's portfolio AI assistant"
          className={`fixed z-40 bottom-20 right-4 flex h-[min(680px,calc(100dvh-6.5rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-vintage-cream/20 bg-vintage-navy/95 shadow-2xl shadow-black/50 sm:bottom-24 sm:right-6 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[min(560px,calc(100vw-3rem))] ${
            isChatOpened
              ? "chat-panel-enter pointer-events-auto"
              : "chat-panel-exit pointer-events-none"
          }`}
        >
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-vintage-burgundy via-vintage-burgundy to-vintage-slate p-4 sm:p-5">
            <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-vintage-cream/15 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-vintage-cream/20 bg-vintage-cream/15 shadow-lg shadow-black/20">
                <Icon icon="solar:user-speak-bold" className="text-xl text-vintage-cream" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-vintage-cream">Umar&apos;s AI Assistant</h3>
                <p className="flex items-center gap-1.5 text-xs text-vintage-cream/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.95)]" />
                  Ready to help
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href="https://wa.me/971568323258"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact on WhatsApp"
                  title="Contact on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/90 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon icon="mdi:whatsapp" className="text-lg text-emerald-300" />
                </a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-help"))}
                  className="hidden rounded-md bg-white/10 px-2.5 py-2 text-xs font-medium text-white/90 transition hover:bg-white/20 sm:block"
                  aria-label="Open help dialog"
                >
                  Help
                </button>
                <button
                  type="button"
                  onClick={closeChatBox}
                  aria-label="Minimize chat"
                  title="Minimize chat"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-vintage-cream/10 text-vintage-cream transition hover:bg-vintage-cream/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon icon="solar:minimize-bold" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(191,9,47,0.14),transparent_36%),linear-gradient(180deg,rgba(19,36,64,0.9),rgba(10,20,37,0.98))] p-4 sm:p-5"
          >
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "send" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-sm leading-6 shadow-sm sm:max-w-[78%] ${
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
                <div className="flex items-center gap-3 rounded-xl rounded-bl-md border border-vintage-cream/10 bg-vintage-slate/50 px-3.5 py-3 shadow-sm">
                  <span className="chat-loader-orbit flex h-7 w-7 items-center justify-center rounded-full border border-vintage-cream/15 bg-vintage-navy/70">
                    <Icon icon="solar:stars-line-duotone" className="text-base text-vintage-cream" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-vintage-cream/80">Assistant is thinking</p>
                    <div className="mt-1.5 flex gap-1">
                      <span className="chat-loader-dot" />
                      <span className="chat-loader-dot" />
                      <span className="chat-loader-dot" />
                    </div>
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

          <form onSubmit={handleSend} className="border-t border-vintage-cream/10 bg-vintage-navy/90 p-4 sm:p-5">
            <p id="chat-input-desc" className="sr-only">
              Type your message and press Enter or click send to chat with the assistant.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-vintage-cream/10 bg-black/15 p-1.5 focus-within:border-vintage-burgundy/70 focus-within:ring-2 focus-within:ring-vintage-burgundy/20">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                aria-describedby="chat-input-desc"
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-vintage-cream placeholder:text-vintage-cream/40 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 px-3 text-sm font-semibold text-vintage-cream transition hover:shadow-lg hover:shadow-vintage-burgundy/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="text-base" />
                    <span className="hidden sm:inline">Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Icon icon="solar:send-bold" className="text-base" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
