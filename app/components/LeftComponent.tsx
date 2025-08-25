"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatHistory } from "../reqHandlers/chatHistory.reqHandler";
import { useChatHistoryStore, useDeepseekStore, useGptStore, useMistralStore, useQwenStore } from "../zustand/store";

// ==========================
// LeftComponent
// ==========================
const LeftComponent = () => {
  const router = useRouter();

  // Zustand store hooks
  const { chats, appendChat } = useChatHistoryStore();

  const clearGpt = useGptStore((state) => state.clearMessages);
  const clearDeepseek = useDeepseekStore((state) => state.clearMessages);
  const clearMistral = useMistralStore((state) => state.clearMessages);
  const clearQwen = useQwenStore((state) => state.clearMessages);

  // Fetch chat history on component mount
  useEffect(() => {
    const getChatHistory = async () => {
      const result = await chatHistory(1, 1); // Parameters could be page & limit

      if (result.success) {
        console.log(result.data?.data.data); // Log chat data (can be removed in prod)
        appendChat(result.data?.data.data); // Add chat history to Zustand store
      } else {
        console.error("Failed to fetch chat history", result.error);
      }
    };

    getChatHistory();
  }, []);

  // Clear all messages from different model stores
  const clearAllMessages = () => {
    clearGpt();
    clearDeepseek();
    clearMistral();
    clearQwen();
  };

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
            className="bg-primary rounded-xl w-full min-h-15 h-15 text-[12px] flex items-center hover:cursor-pointer p-5"
            onClick={() => {
              router.push(`/chat/${chat.chatUUID}`);
              clearAllMessages(); // Clear messages when switching chats
            }}
          >
            <h3>{chat.chatName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftComponent;
