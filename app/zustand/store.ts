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
  chatName:string
}

type ChatStore = {
  chats: Chat[]
  addChat: (chat: Chat) => void
  setChat: (chats: Chat[]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  addChat:(chat) => 
    set((state) => ({
      chats: [...state.chats, chat]
    })),
    setChat:(chats) => 
      set(() => ({
        chats: chats
      }))
}))