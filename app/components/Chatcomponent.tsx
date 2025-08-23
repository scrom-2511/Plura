"use client";

import React, { useState } from "react";
import {
  useGptStore,
  useDeepseekStore,
  useMistralStore,
  useQwenStore,
} from "../zustand/store";

const Chatcomponent = () => {
  // GPT state
  const [gptResponse, setGptResponse] = useState<string>("");
  const [newConversationGpt, setNewConversationGpt] = useState<boolean>(false);
  const messagesGpt = useGptStore((state) => state.messages);
  const addConversationGpt = useGptStore((state) => state.addConversation);

  // Deepseek state
  const [deepseekResponse, setDeepseekResponse] = useState<string>("");
  const [newConversationDeepseek, setNewConversationDeepseek] =
    useState<boolean>(false);
  const messagesDeepseek = useDeepseekStore((state) => state.messages);
  const addConversationDeepseek = useDeepseekStore(
    (state) => state.addConversation
  );

  // Mistral state
  const [mistralResponse, setMistralResponse] = useState<string>("");
  const [newConversationMistral, setNewConversationMistral] =
    useState<boolean>(false);
  const messagesMistral = useMistralStore((state) => state.messages);
  const addConversationMistral = useMistralStore(
    (state) => state.addConversation
  );

  // Qwen state
  const [qwenResponse, setQwenResponse] = useState<string>("");
  const [newConversationQwen, setNewConversationQwen] =
    useState<boolean>(false);
  const messagesQwen = useQwenStore((state) => state.messages);
  const addConversationQwen = useQwenStore((state) => state.addConversation);

  // shared state
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  // 🔥 generic streamer for all models
  const streamModel = async (
    model: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>,
    addToStore: (msg: { prompt: string; response: string }) => void,
    setNewConversation: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!prompt) return;

    const data = { userID: "329832", prompt };
    const finalPrompt = prompt;
    let finalResponse = "";

    setCurrentPrompt(prompt);
    setPrompt("");
    setNewConversation(true);

    const response = await fetch(
      `http://localhost:3000/api/aiModels/${model}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.body) {
      console.error(`No response body from ${model}`);
      return;
    }

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

    // launch all 4 in parallel
    await Promise.allSettled([
      // streamModel("chatgpt", setGptResponse, addConversationGpt, setNewConversationGpt),
      // streamModel("deepseek", setDeepseekResponse, addConversationDeepseek, setNewConversationDeepseek),
      // streamModel("mistral", setMistralResponse, addConversationMistral, setNewConversationMistral),
      streamModel("qwen", setQwenResponse, addConversationQwen, setNewConversationQwen),
    ]);
  };

  return (
    <>
      {/* CHATGPT */}
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

      <div className="col-span-2 col-start-2 bg-primary rounded-2xl flex items-center px-10">
        <textarea
          name="prompt"
          id="prompt"
          className="resize-none focus:outline-0 w-full text-sm text-secondary"
          placeholder="Ask Anything"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <button onClick={handleOnClick}>SEND</button>
      </div>
    </>
  );
};

export default Chatcomponent;

// 🔹 Reusable chat panel
type ChatPanelProps = {
  title: string;
  messages: { prompt: string; response: string }[];
  newConversation: boolean;
  currentPrompt: string;
  liveResponse: string;
};

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
