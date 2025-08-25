"use client";

import React, { useEffect, useState } from "react";
import {
  useGptStore,
  useDeepseekStore,
  useMistralStore,
  useQwenStore,
  useChatHistoryStore,
  Chat,
} from "../zustand/store";
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
  const [conversation, setConversations] = useState<ConversationEntry[]>([]);
  const [currentChatID, setCurrentChatID] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  // ====== GPT STORE ======
  const [gptResponse, setGptResponse] = useState<string>("");
  const [newConversationGpt, setNewConversationGpt] = useState<boolean>(false);
  const messagesGpt = useGptStore((state) => state.messages);
  const addConversationGpt = useGptStore((state) => state.addConversation);
  const clearGpt = useGptStore((state) => state.clearMessages);

  // ====== DEEPSEEK STORE ======
  const [deepseekResponse, setDeepseekResponse] = useState<string>("");
  const [newConversationDeepseek, setNewConversationDeepseek] = useState<boolean>(false);
  const messagesDeepseek = useDeepseekStore((state) => state.messages);
  const addConversationDeepseek = useDeepseekStore((state) => state.addConversation);
  const clearDeepseek = useDeepseekStore((state) => state.clearMessages);

  // ====== MISTRAL STORE ======
  const [mistralResponse, setMistralResponse] = useState<string>("");
  const [newConversationMistral, setNewConversationMistral] = useState<boolean>(false);
  const messagesMistral = useMistralStore((state) => state.messages);
  const addConversationMistral = useMistralStore((state) => state.addConversation);
  const clearMistral = useMistralStore((state) => state.clearMessages);

  // ====== QWEN STORE ======
  const [qwenResponse, setQwenResponse] = useState<string>("");
  const [newConversationQwen, setNewConversationQwen] = useState<boolean>(false);
  const messagesQwen = useQwenStore((state) => state.messages);
  const addConversationQwen = useQwenStore((state) => state.addConversation);
  const clearQwen = useQwenStore((state) => state.clearMessages);

  // ====== CHAT HISTORY STORE ======
  const { addChat } = useChatHistoryStore();

  // ====== EFFECT: Check Chat ID on Mount ======
  useEffect(() => {
    if (url.chatID && url.chatID !== "newChat") {
      setChatComponent(true);
    }
  }, [url.chatID]);

  // ====== EFFECT: Fetch Conversations ======
  useEffect(() => {
    const getConversations = async () => {
      // Avoid fetching if it's a new chat
      if (pathname.includes("newChat") || !url.chatID) return;

      try {
        const result = await conversations(1, url.chatID as string);
        if (result.success) {
          // Store fetched conversations
          setConversations(result.data.data);
        } else {
          console.error("Failed to fetch chat history", result.error);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    getConversations();
  }, [pathname, url.chatID]);

  // ====== EFFECT: Load Conversations into Stores & Cleanup ======
  useEffect(() => {
    if (conversation.length === 0) return;

    // Load conversation entries into each AI model store
    conversation.forEach((entry) => {
      addConversationGpt({
        prompt: entry.prompt,
        response: entry.gpt ?? "There was an error getting the response.",
      });
      addConversationDeepseek({
        prompt: entry.prompt,
        response: entry.deepseek ?? "There was an error getting the response.",
      });
      addConversationMistral({
        prompt: entry.prompt,
        response: entry.mistral ?? "There was an error getting the response.",
      });
      addConversationQwen({
        prompt: entry.prompt,
        response: entry.qwen ?? "There was an error getting the response.",
      });
    });

    // Cleanup function to clear all messages on unmount or conversation change
    return () => {
      clearGpt();
      clearDeepseek();
      clearMistral();
      clearQwen();
    };
  }, [conversation, addConversationGpt, addConversationDeepseek, addConversationMistral, addConversationQwen, clearGpt, clearDeepseek, clearMistral, clearQwen]);

  /**
   * Streams AI model response chunk by chunk.
   * @param model - AI model name.
   * @param setResponse - React state setter for live response.
   * @param addToStore - Function to add conversation to zustand store.
   * @param setNewConversation - React state setter to track new conversation status.
   * @param conversationID - Unique conversation identifier.
   * @param chatID - Current chat identifier.
   */
  const streamModel = async (
    model: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>,
    addToStore: (msg: { prompt: string; response: string }) => void,
    setNewConversation: React.Dispatch<React.SetStateAction<boolean>>,
    conversationID: string,
    chatID: string
  ): Promise<void> => {
    // Input validation: do not proceed if prompt is empty
    if (!prompt.trim()) return;

    const data = { prompt, userID: 1, conversationID, chatID };
    const finalPrompt = prompt;
    let finalResponse = "";

    setCurrentPrompt(prompt);
    setPrompt(""); // Clear prompt input
    setNewConversation(true); // Mark new conversation as in-progress

    try {
      const response = await fetch(`http://localhost:3000/api/aiModels/${model}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.body) {
        console.error("Response body is null");
        setNewConversation(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Read stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Mark conversation as complete and save to store
          setNewConversation(false);
          addToStore({ prompt: finalPrompt, response: finalResponse });
          setResponse("");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        finalResponse += chunk;
        setResponse(finalResponse); // Update live response
      }
    } catch (error) {
      console.error(`Error streaming model ${model}:`, error);
      setNewConversation(false);
    }
  };

  /**
   * Handles submit button click to start conversation streams.
   */
  const handleOnClick = async (): Promise<void> => {
    if (!prompt.trim()) return; // Validate prompt input

    // Generate new unique IDs for conversation and chat
    const newConversationID = uuidv6();
    let newChatID = currentChatID;

    // If on newChat path, create new chat entry and route to it
    if (pathname.includes("newChat")) {
      newChatID = uuidv6();
      const chat: Chat = { chatName: "New Chat1", chatUUID: newChatID };
      addChat(chat);
      setCurrentChatID(newChatID);
      router.push(`/chat/${newChatID}`);
      setChatComponent(true);
    }

    // Start streaming responses from all models concurrently
    await Promise.allSettled([
      streamModel("chatgpt", setGptResponse, addConversationGpt, setNewConversationGpt, newConversationID, newChatID),
      streamModel("deepseek", setDeepseekResponse, addConversationDeepseek, setNewConversationDeepseek, newConversationID, newChatID),
      streamModel("mistral", setMistralResponse, addConversationMistral, setNewConversationMistral, newConversationID, newChatID),
      streamModel("qwen", setQwenResponse, addConversationQwen, setNewConversationQwen, newConversationID, newChatID),
    ]);
  };

  return (
    <>
      {chatComponent ? (
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
      ) : (
        <NoChatComponent />
      )}

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

/**
 * ChatPanel component displays conversation for a specific AI model.
 * @param props - Component props.
 * @param props.title - Title of the AI model.
 * @param props.messages - Array of conversation messages.
 * @param props.newConversation - Indicates if a new conversation is ongoing.
 * @param props.currentPrompt - Current user prompt.
 * @param props.liveResponse - Live AI response streaming.
 */
const ChatPanel = ({
  title,
  messages,
  newConversation,
  currentPrompt,
  liveResponse,
}: ChatPanelProps) => (
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

/**
 * NoChatComponent shown when no chat is active.
 */
const NoChatComponent = () => (
  <>
    {["CHATGPT", "DEEPSEEK", "MISTRAL", "LLAMA"].map((model) => (
      <div key={model} className="flex justify-center bg-primary rounded-2xl h-40 self-center mb-4">
        <div className="self-center text-center">{model}</div>
      </div>
    ))}
  </>
);
