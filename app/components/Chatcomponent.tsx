"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGptStore, useDeepseekStore, useMistralStore, useQwenStore, useChatHistoryStore, Chat } from "../zustand/store";
import { v6 as uuidv6 } from "uuid";
import PromptBox from "./PromptBox";
import { useParams, usePathname, useRouter } from "next/navigation";
import { conversations } from "../reqHandlers/conversations.reqHandler";
import { ConversationEntry } from "@/types/types";

const Chatcomponent = () => {
  // ====== ROUTER & URL PARAMS ======
  const url = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // ====== COMPONENT STATE ======
  const [chatComponent, setChatComponent] = useState<boolean>(false);
  const [conversation, setConversations] = useState<Array<ConversationEntry>>([]);
  const [currentChatID, setCurrentChatID] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  // ====== GPT STORE ======
  const [gptResponse, setGptResponse] = useState<string>("");
  const [newConversationGpt, setNewConversationGpt] = useState<boolean>(false);
  const messagesGpt = useGptStore((state) => state.messages);
  const addConversationGpt = useGptStore((state) => state.addConversation);

  // ====== DEEPSEEK STORE ======
  const [deepseekResponse, setDeepseekResponse] = useState<string>("");
  const [newConversationDeepseek, setNewConversationDeepseek] = useState<boolean>(false);
  const messagesDeepseek = useDeepseekStore((state) => state.messages);
  const addConversationDeepseek = useDeepseekStore((state) => state.addConversation);

  // ====== MISTRAL STORE ======
  const [mistralResponse, setMistralResponse] = useState<string>("");
  const [newConversationMistral, setNewConversationMistral] = useState<boolean>(false);
  const messagesMistral = useMistralStore((state) => state.messages);
  const addConversationMistral = useMistralStore((state) => state.addConversation);

  // ====== QWEN STORE ======
  const [qwenResponse, setQwenResponse] = useState<string>("");
  const [newConversationQwen, setNewConversationQwen] = useState<boolean>(false);
  const messagesQwen = useQwenStore((state) => state.messages);
  const addConversationQwen = useQwenStore((state) => state.addConversation);

  // ====== CHAT HISTORY STORE ======
  const { addChat } = useChatHistoryStore();

  // ====== EFFECT: Check Chat ID on Mount ======
  useEffect(() => {
    if (url.chatID && url.chatID !== "newChat") {
      setChatComponent(true);
    }
  }, []);

  const clearGpt = useGptStore((state) => state.clearMessages);
      const clearDeepseek = useDeepseekStore((state) => state.clearMessages);
      const clearMistral = useMistralStore((state) => state.clearMessages);
      const clearQwen = useQwenStore((state) => state.clearMessages);

  // ====== EFFECT: Fetch Conversations ======
  useEffect(() => {
    const getConversations = async () => {
      if (pathname.includes("newChat")) return;

      const result = await conversations(1, url.chatID as string);

      if (result.success) {
        console.log(result.data?.data.data);
        setConversations(result.data?.data.data);
      } else {
        console.error("Failed to fetch chat history", result.error);
      }
    };

    getConversations();
  }, []);

  // ====== EFFECT: Load Conversations into Stores ======
  useEffect(() => {
    conversation.forEach((entry: ConversationEntry) => {
      addConversationGpt({
        prompt: entry.prompt,
        response: entry.gpt || "There was an error getting the response.",
      });

      addConversationDeepseek({
        prompt: entry.prompt,
        response: entry.deepseek || "There was an error getting the response.",
      });

      addConversationMistral({
        prompt: entry.prompt,
        response: entry.mistral || "There was an error getting the response.",
      });

      addConversationQwen({
        prompt: entry.prompt,
        response: entry.qwen || "There was an error getting the response.",
      });
    });
    return () => {
      const clearAllMessages = () => {
        clearGpt();
        clearDeepseek();
        clearMistral();
        clearQwen();
      };
      clearAllMessages();
    };
  }, [conversation]);

  const streamModel = async (
    model: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>,
    addToStore: (msg: { prompt: string; response: string }) => void,
    setNewConversation: React.Dispatch<React.SetStateAction<boolean>>,
    conversationID: string,
    chatID: string
  ) => {
    if (!prompt) return;

    const data = { prompt, userID: 1, conversationID, chatID };
    const finalPrompt = prompt;
    let finalResponse = "";

    setCurrentPrompt(prompt);
    setPrompt("");
    setNewConversation(true);

    const response = await fetch(`http://localhost:3000/api/aiModels/${model}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setNewConversation(false);
        addToStore({ prompt: finalPrompt, response: finalResponse });
        setResponse("");
        finalResponse = "";
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      finalResponse += chunk;
      setResponse(finalResponse);
    }
  };

  const handleOnClick = async () => {
    if (!prompt) return;
    // setChatComponent(true)
    const newConversationID = uuidv6();
    const newChatID = uuidv6();
    if (pathname.includes("newChat")) {
      const chat: Chat = { chatName: "New Chat1", chatUUID: newChatID };
      addChat(chat);
      setCurrentChatID(newChatID);
      router.push(`/chat/${newChatID}`);
      console.log(prompt);
    }

    await Promise.allSettled([
      streamModel("chatgpt", setGptResponse, addConversationGpt, setNewConversationGpt, newConversationID, currentChatID),
      streamModel("deepseek", setDeepseekResponse, addConversationDeepseek, setNewConversationDeepseek, newConversationID, currentChatID),
      streamModel("mistral", setMistralResponse, addConversationMistral, setNewConversationMistral, newConversationID, currentChatID),
      streamModel("qwen", setQwenResponse, addConversationQwen, setNewConversationQwen, newConversationID, currentChatID),
    ]);
  };

  return (
    <>
      {chatComponent && (
        <>
          <ChatPanel
            title="CHATGPT"
            messages={messagesGpt}
            newConversation={newConversationGpt}
            currentPrompt={currentPrompt}
            liveResponse={gptResponse}
          />
          <ChatPanel
            title="DEEPSEEK"
            messages={messagesDeepseek}
            newConversation={newConversationDeepseek}
            currentPrompt={currentPrompt}
            liveResponse={deepseekResponse}
          />
          <ChatPanel
            title="MISTRAL"
            messages={messagesMistral}
            newConversation={newConversationMistral}
            currentPrompt={currentPrompt}
            liveResponse={mistralResponse}
          />
          <ChatPanel
            title="QWEN"
            messages={messagesQwen}
            newConversation={newConversationQwen}
            currentPrompt={currentPrompt}
            liveResponse={qwenResponse}
          />
        </>
      )}
      {!chatComponent && <NoChatComponent />}

      <PromptBox prompt={prompt} setPrompt={setPrompt} handleOnClick={handleOnClick} />
    </>
  );
};

export default Chatcomponent;

type ChatPanelProps = {
  title: string;
  messages: { prompt: string; response: string }[];
  newConversation: boolean;
  currentPrompt: string;
  liveResponse: string;
};

const ChatPanel = ({ title, messages, newConversation, currentPrompt, liveResponse }: ChatPanelProps) => (
  <div className="bg-primary rounded-2xl overflow-y-scroll">
    <div className="text-[12px] p-10 text-secondary">
      <h1 className="text-center text-sm font-bold mb-2">{title}</h1>
      {messages.map((message, index) => (
        <div key={`${message.prompt}-${index}`}>
          <div>
            <h6 className="font-bold">User</h6>
            <p>{message.prompt}</p>
          </div>
          <div>
            <h6 className="font-bold">Model</h6>
            <p>{message.response}</p>
          </div>
        </div>
      ))}
      {newConversation && (
        <div>
          <div>
            <h6 className="font-bold">User</h6>
            <p>{currentPrompt}</p>
          </div>
          <div>
            <h6 className="font-bold">Model</h6>
            <p>{liveResponse}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const NoChatComponent = () => {
  return (
    <>
      <div className="flex justify-center bg-primary rounded-2xl h-40 self-center mb-4">
        <div className="self-center text-center">CHATGPT</div>
      </div>

      <div className="flex justify-center bg-primary rounded-2xl h-40 self-center mb-4">
        <div className="self-center text-center">DEEPSEEK</div>
      </div>

      <div className="flex justify-center bg-primary rounded-2xl h-40 self-center mb-4">
        <div className="self-center text-center">MISTRAL</div>
      </div>

      <div className="flex justify-center bg-primary rounded-2xl h-40 self-center mb-4">
        <div className="self-center text-center">LLAMA</div>
      </div>
    </>
  );
};
