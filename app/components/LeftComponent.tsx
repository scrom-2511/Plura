"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { chatHistory } from "../reqHandlers/chatHistory.reqHandler";
import { useChatHistoryStore } from "../zustand/store";

const LeftComponent = () => {
  const router = useRouter();
  const { chats, appendChat } = useChatHistoryStore();

  useEffect(() => {
    const getChatHistory = async () => {
      const result = await chatHistory(1, 1);

      if (result.success) {
        console.log(result.data?.data.data);
        appendChat(result.data?.data.data);
      } else {
        console.error("Failed to fetch chat history", result.error);
      }
    };

    getChatHistory();
  }, []);

  return (
    <div className="w-full grid grid-rows-[150px_auto] p-5 py-10 overflow-hidden">
      <div className="w-full flex flex-col items-center gap-5">
        <button className="bg-primary rounded-xl w-full h-12 text-sm font-bold hover:cursor-pointer" onClick={() => router.push("/chat/newChat")}>
          NEW CHAT
        </button>
        <input type="text" className="bg-primary w-full rounded-xl h-12 text-[13px] focus:outline-0 p-5" placeholder="Search..." />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-5 overflow-auto">
        {chats.map((chat) => (
          <div key={chat.chatUUID} className="bg-primary rounded-xl w-full min-h-12 text-[12px] flex items-center hover:cursor-pointer p-5" onClick={()=> router.push(`/chat/${chat.chatUUID}`)}>
            <h3>{chat.chatName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftComponent;
