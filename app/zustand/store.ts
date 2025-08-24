import { Message } from "@/types/types";
import { create } from "zustand";

type MessageStore = {
  messages: Message[];
  addConversation: (message: Message) => void;
};

export const useGptStore = create<MessageStore>((set) => ({
  messages: [],
  addConversation: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export const useDeepseekStore = create<MessageStore>((set) => ({
  messages: [],
  addConversation: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export const useMistralStore = create<MessageStore>((set) => ({
  messages: [],
  addConversation: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export const useQwenStore = create<MessageStore>((set) => ({
  messages: [],
  addConversation: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

type Chat = {
  chatName:string,
  chatUUID:string
}

type ChatHistoryStore = {
  chats: Chat[]
  addChat: (chat: Chat) => void
  appendChat: (chats: Chat[]) => void
}

export const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  chats: [],
  addChat:(chat) => 
    set((state) => ({
      chats: [...state.chats, chat]
    })),
    appendChat:(chats) => 
      set((state) => ({
        chats: [...state.chats, ...chats]
      }))
}))