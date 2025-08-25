import { Conversation } from "@prisma/client";

export enum ModelTypes {
  GPT = "openai/gpt-4o",
  DEEPSEEK = "z-ai/glm-4.5-air:free",
  MISTRAL = "mistralai/mistral-small-3.2-24b-instruct:free",
  QWEN = "moonshotai/kimi-k2:free",
}

export const modelFieldMap: Record<ModelTypes, keyof Conversation> = {
    [ModelTypes.GPT]: "gpt",
    [ModelTypes.DEEPSEEK]: "deepseek",
    [ModelTypes.MISTRAL]: "mistral",
    [ModelTypes.QWEN]: "qwen",
  };

export type Message = {
  prompt: string;
  response: string;
};

export type ConversationEntry = {
  id: number;
  conversationID: string;
  prompt: string;
  gpt: string | null;
  deepseek: string | null;
  mistral: string | null;
  qwen: string | null;
  userID: number;
  chatID: string;
  createdAt: string;
  updatedAt: string;
};