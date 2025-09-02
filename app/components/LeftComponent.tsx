"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { chatHistory } from "../reqHandlers/chatHistory.reqHandler";
import { OptionsMenu, useChatHistoryStore, useOptionsMenuStore } from "../zustand/store";

const LeftComponent = () => {
  const router = useRouter();
  const hasLoadedRef = useRef(false);

  const setOptionsMenu = useOptionsMenuStore((state) => state.setOptions)


  // Zustand store hooks
  const { chats, appendChat, clearChat } = useChatHistoryStore();
  
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    // Async function to fetch chat history for userID=1 and page=1
    const getChatHistory = async () => {
      try {
        const result = await chatHistory(1, 1);
  
        if (result.success) {
          // On success, log data and update chat state
          console.log(result.data.data);
          appendChat(result.data.data);
        } else {
          // Log error if API call was unsuccessful
          console.error("Failed to fetch chat history", result.error);
        }
      } catch (err) {
        // Catch any unexpected errors
        console.error("Unexpected error fetching chat history:", err);
      }
    };
  
    getChatHistory();
    return () => {
      clearChat()
    }
  }, []);

  const handleOnClickMenu = (e: React.MouseEvent<HTMLDivElement>, componentID: string) => {
    e.stopPropagation();
    const options: OptionsMenu =  {x: e.clientX, y: e.clientY, componentID, visibility:true}
    setOptionsMenu(options)
  }

  return (
    <div className="w-full grid grid-rows-[150px_auto] p-5 py-10 overflow-hidden">
      {/* Top Section: NEW CHAT button and Search bar */}
      <div className="w-full flex flex-col items-center gap-5">
        <button className="bg-primary rounded-xl w-full h-12 text-sm font-bold hover:cursor-pointer" onClick={() => router.push("/chat/newChat")}>
          NEW CHAT
        </button>
        <input type="text" className="bg-primary w-full rounded-xl h-12 text-[13px] focus:outline-0 p-5" placeholder="Search..." />
      </div>

      {/* Chat List Section */}
      <div className="w-full h-full flex flex-col items-center gap-3 overflow-auto">
        {chats.map((chat) => (
          <div
            key={chat.chatUUID}
            className="bg-primary rounded-xl w-full min-h-15 h-15 text-[12px] flex justify-between hover:cursor-pointer p-5"
            onClick={() => {
              router.push(`/chat/${chat.chatUUID}`);
            }}
          >
            <h3>{chat.chatName}</h3>
            <img src="/menu.svg" alt="" className="invert h-5" onClick={(e) => handleOnClickMenu(e, chat.chatUUID)}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftComponent;
