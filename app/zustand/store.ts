import { Message } from "@/types/types";
import { number } from "zod";
import { create } from "zustand";

type MessageStore = {
  messages: Message[];
  /**
   * Adds a message to the conversation.
   * @param {Message} message - The message to add.
   */
  addConversation: (message: Message) => void;

  /**
   * Clears all messages in the store.
   */
  clearMessages: () => void;
};

/**
 * Custom Zustand store for GPT message management.
 */
export const useGptStore = create<MessageStore>((set) => ({
  messages: [],

  // Add a message to the conversation with validation
  addConversation: (message) => {
    if (!message || typeof message !== "object") {
      console.warn("Invalid message provided to addConversation");
      return;
    }
    console.log("I was called");
    set((state) => ({
      messages: [...state.messages, message], // Append new message immutably
    }));
  },

  // Clear all messages
  clearMessages: () => set({ messages: [] }),
}));

/**
 * Custom Zustand store for Deepseek message management.
 */
export const useDeepseekStore = create<MessageStore>((set) => ({
  messages: [],

  addConversation: (message) => {
    if (!message || typeof message !== "object") {
      console.warn("Invalid message provided to addConversation");
      return;
    }
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => set({ messages: [] }),
}));

/**
 * Custom Zustand store for Mistral message management.
 */
export const useMistralStore = create<MessageStore>((set) => ({
  messages: [],

  addConversation: (message) => {
    if (!message || typeof message !== "object") {
      console.warn("Invalid message provided to addConversation");
      return;
    }
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => set({ messages: [] }),
}));

/**
 * Custom Zustand store for Qwen message management.
 */
export const useQwenStore = create<MessageStore>((set) => ({
  messages: [],

  addConversation: (message) => {
    if (!message || typeof message !== "object") {
      console.warn("Invalid message provided to addConversation");
      return;
    }
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => set({ messages: [] }),
}));

export type Chat = {
  chatName: string;
  chatUUID: string;
};

type ChatHistoryStore = {
  chats: Chat[];

  /**
   * Adds a single chat to the history at the front.
   * @param {Chat} chat - The chat to add.
   */
  addChat: (chat: Chat) => void;

  /**
   * Appends multiple chats to the end of the history.
   * @param {Chat[]} chats - The chats to append.
   */
  appendChat: (chats: Chat[]) => void;

  /**
   * Clears the entire chat history.
   * Removes all chats from the history array.
   */
  clearChat: () => void;
};

/**
 * Zustand store to manage chat history.
 */
export const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  chats: [],

  addChat: (chat) => {
    if (!chat || typeof chat !== "object" || !chat.chatUUID) {
      console.warn("Invalid chat provided to addChat");
      return;
    }
    set((state) => ({
      chats: [chat, ...state.chats], // Add new chat at beginning
    }));
  },

  appendChat: (chats) => {
    set((state) => ({
      chats: [...state.chats, ...chats], // Append chats immutably
    }));
  },

  clearChat: () => set({ chats: [] }), // Empties chats array
}));

export type OptionsMenu = {
  x: number;
  y: number;
  visibility: boolean;
  componentID: string;

}

type OptionsMenuStore = {
  options : OptionsMenu;
  setOptions: (options: OptionsMenu) => void;
}

export const useOptionsMenuStore = create<OptionsMenuStore>((set) => ({
  options:{x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER, componentID:"", visibility: true},
  setOptions: (options: OptionsMenu) => {
    set((state) => ({
      options
    }))
  }
}))