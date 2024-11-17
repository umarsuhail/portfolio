"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const [isChatOpened, setOpened] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ message: string; type: "send" | "received" }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const openChatBox = () => {
    setOpened(!isChatOpened);
  };

  const handleSend = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    if (inputRef.current) {
      const userMessage = inputRef.current.value;
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { message: userMessage, type: "send" },
      ]);
      setInputValue("");

      setResponseMessage(userMessage);
    }
  };

  const setResponseMessage = (userMessage: string) => {
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          message: `Hi there, the chat feature is under development. You said: ${userMessage}`,
          type: "received",
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="" ref={chatContainerRef}>
      <div className="fixed z-10 bottom-2 right-2 animate-pulse">
        {/* chat icon */}
        <button onClick={openChatBox}>
          <Icon
            icon="solar:chat-line-bold-duotone"
            className={isChatOpened ? "rotate-180" : ""}
            fontSize={50}
            color="#FFFFFF"
          />
        </button>
      </div>

      {/* chat popup */}
      {isChatOpened && (
        <div className="flex border-2 border-purple-400 flex-col w-72 h-5/6 bg-yellow-50 fixed z-20 bottom-20 top-3 right-3 rounded-md p-3">
          <div className="flex w-full rounded-xl shadow-md ">
            <Icon
              icon="ix:user-profile-filled"
              fontSize={50}
              className="text-slate-300"
            />
            <span className="text-xs text-slate-500 m-2">
              Hello there, this is a fully custom developed personalized AI
              assistant, and it is under development
            </span>
          </div>

          {/* chat interface */}
          <div className=" overflow-y-auto flex flex-col h-2/3">
            {chatMessages.map((msg, index) => (
            <div key={index}>
              <div
                className={`m-2 p-2 text-xs break-words rounded-xl w-3/4 ${
                  msg.type === "send"
                    ? "bg-purple-500 rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-none "
                    : "bg-blue-500 rounded-tl-xl rounded-br-xl rounded-bl-xl rounded-tr-none float-right"
                }`}
              >
                <div className="w-full max-w-[70%]">{msg.message}</div>
              </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="absolute bottom-3 h-12 flex justify-between w-[calc(100%-16px)] items-center"
          >
            <input
              ref={inputRef}
              onChange={handleChange}
              value={inputValue}
              className="rounded-xl w-full min-h-9 flex border-none shadow-md m-2 focus:outline-none p-2 text-gray-600 text-sm"
              placeholder="type here"
              autoFocus
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              <Icon
                icon="ic:round-send"
                className="text-purple-400"
                fontSize={30}
              />
            </button>
            {loading && (
              <Icon
                icon="eos-icons:three-dots-loading"
                fontSize={30}
                className="text-gray-600"
              />
            )}
          </form>
        </div>
      )}
    </div>
  );
}
