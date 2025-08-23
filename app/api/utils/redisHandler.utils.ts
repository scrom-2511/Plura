import { Message, ModelTypes } from "@/types/types";
import { createClient } from "redis";

const client = createClient();

const connectClient = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};
export const contextProvider = async (userID: string, model: ModelTypes) => {
  await connectClient();
  const context = await client.get(`${userID}:${model}`);
  return context;
};

export const contextSetter = async (userID: string, context: string | null, model: ModelTypes, conversation: Message) => {
  await connectClient();
  if (!context) {
    await client.set(`${userID}:${model}`, JSON.stringify([conversation]));
  } else {
    const existingData: Array<Message> = JSON.parse(context);

    if (existingData.length > 20) {
      existingData.shift();
    }
    existingData.push(conversation);
    await client.set(`${userID}:${model}`, JSON.stringify(existingData));
  }
};

// const [gptContext, deepseekContext, mistralContext, llamaContext] = await Promise.all([
//     client.get(`${ModelTypes.GPT}:${userID}`),
//     client.get(`${ModelTypes.DEEPSEEK}:${userID}`),
//     client.get(`${ModelTypes.MISTRAL}:${userID}`),
//     client.get(`${ModelTypes.META_LLAMA}:${userID}`),
//   ]);
//   return {gptContext, deepseekContext, mistralContext, llamaContext};
