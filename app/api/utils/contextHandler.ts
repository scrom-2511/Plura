import { Message, modelFieldMap, ModelTypes } from "@/types/types";
import { createClient } from "redis";
import { prisma } from "../lib/prisma";

const client = createClient();

const connectClient = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};
export const contextProvider = async (userID: number, model: ModelTypes, chatID: string): Promise<string | null> => {
  await connectClient();

  const cacheKey = `${userID}:${model}:${chatID}`;
  const cached = await client.get(cacheKey);

  if (cached) return cached;

  const data = await prisma.conversation.findMany({
    where: {
      chatID,
      userID,
      [modelFieldMap[model]]: {not: null}
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 20,
  });

  if (!data || data.length === 0) {
    return null;
  }

  const contextArr: Message[] = [];

  for (const d of data) {
    contextArr.push({ prompt: d.prompt, response: d[modelFieldMap[model]] as string });
  }

  contextArr.reverse();

  await client.set(cacheKey, JSON.stringify(contextArr));

  return JSON.stringify(contextArr);
};

export const contextSetter = async (userID: number, context: string | null, model: ModelTypes, conversation: Message, chatID:string) => {
  await connectClient();
  const cacheKey = `${userID}:${model}:${chatID}`;
  if (!context) {
    await client.set(cacheKey, JSON.stringify([conversation]));
  } else {
    const existingData: Array<Message> = JSON.parse(context);

    if (existingData.length > 20) {
      existingData.shift();
    }
    existingData.push(conversation);
    await client.set(cacheKey, JSON.stringify(existingData));
  }
};
