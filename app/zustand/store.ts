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
