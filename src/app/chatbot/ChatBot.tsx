"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

type ChatMessage = {
  type: "send" | "received";
  message: string;
  timestamp: Date;
};

export default function ChatBot() {
  const [isChatOpened, setOpened] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const openChatBox = () => {
    setOpened(!isChatOpened);
    if (!isChatOpened && chatMessages.length === 0) {
      setChatMessages([
        {
          type: "received",
          message: "Hello! 👋 I'm Umar's Gemini-powered assistant. Ask me about Umar's experience, skills, projects, and career journey.",
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
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "received",
          message: "Sorry, I'm having trouble connecting. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
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
      <motion.button
        onClick={openChatBox}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-lg bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 flex items-center justify-center shadow-lg shadow-vintage-burgundy/25 hover:shadow-xl hover:shadow-vintage-burgundy/30 transition-shadow duration-300"
      >
        <AnimatePresence mode="wait">
          {isChatOpened ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="solar:close-circle-bold" className="text-2xl text-vintage-cream" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="solar:chat-round-dots-bold" className="text-2xl text-vintage-cream" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isChatOpened && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-vintage-burgundy rounded-full border-2 border-vintage-navy animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {isChatOpened && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
                onClick={() => setOpened(false)}
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-vintage-slate/50 p-3 rounded-xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-vintage-cream/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
