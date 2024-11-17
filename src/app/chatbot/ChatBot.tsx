"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, {  useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const [isChatOpened, setOpened] = useState(false);
  const [sendChat, setSendChat] = useState<string[]>([]);
  const [inputValue,setInputValue] = useState("");
  const [loading,setLoading] = useState(false);


  const inputRef = useRef<HTMLInputElement>(null);

  const openChatBox = () => {
    setOpened(!isChatOpened);
  };

  const handleSend = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);
    if (inputRef.current) {
      console.log(inputRef.current.value);
      setSendChat((prevChats) => [...prevChats, inputRef.current!.value]);
      setInputValue("")
    }
  };
  useEffect(()=>{
    console.log(sendChat);
    
  },[sendChat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); 
  };
  return (
    <div className="">
      <div className="fixed z-10 bottom-2 right-2 animate-pulse">
        {/* chat icon */}
        <div className="">
          <button onClick={openChatBox}>
            <Icon
              icon="solar:chat-line-bold-duotone"
              className={isChatOpened ? "rotate-180" : ""}
              fontSize={50}
              color="#FFFFFF"
            />
          </button>
        </div>
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
              Hello there, this is a fully custom developed personolized AI assistant, and it is under development
            </span>
          </div>
          {/* chat interface */}
          <div className="h-3/5 overflow-y-scroll">
            {sendChat.map((items,index)=>{
                return <div className="bg-purple-500 text-xs break-words rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-none m-2 p-2" key={index}>
                {items}
              </div>
              
            })}

          </div>
          <form
            onSubmit={handleSend}
            className="absolute bottom-3 h-12 flex justify-between w-[calc(100%-16px)] items-center"
          >
            <input
              ref={inputRef}
              onChange={handleChange}
              value={inputValue}
              className="rounded-xl w-full  min-h-9 flex border-none shadow-md m-2 focus:outline-none  p-2 text-gray-600 text-sm"
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
          </form>
        </div>
      )}
    </div>
  );
}
