import { Message, ModelTypes } from "@/types/types";
import { contextProvider, contextSetter } from "./redisHandler.utils";
import { prisma } from "../lib/prisma";

export const streamModel = async (model: ModelTypes, controller: ReadableStreamDefaultController, prompt:string, userID:number, apikey:string, chatID: string, conversationID:string) => {
  const context = await contextProvider(userID, model);
  const systemContent = context
    ? `You are an AI assistant. Use the following context to maintain a natural, continuous flow in our conversation: ${context}. Do not greet me in every response. Avoid phrases like "from the context you provided"—your responses should feel seamless and conversational, as if you already know the context.`
    : "You are an AI assistant";
  console.log(context);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apikey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 500,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let finalResponse = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        const conversation:Message = {prompt, response:finalResponse} 
        await contextSetter(userID, context, model, conversation);
        controller.close();
        (async ()=>{
          try {
            await prisma.chat.upsert({
              where: { chatUUID: chatID },
              update: {},
              create: {
                chatUUID: chatID,
                chatName: "New Chat",
                userID,
              },
            });
            const data: any = {
              prompt,
              conversationID,
              chatID,
              userID,
            };
            
            if (model === ModelTypes.GPT) {
              data.gpt = finalResponse;
            } else if (model === ModelTypes.DEEPSEEK) {
              data.deepseek = finalResponse;
            } else if (model === ModelTypes.MISTRAL) {
              data.mistral = finalResponse;
            } else if (model === ModelTypes.QWEN) {
              data.qwen = finalResponse;
            }
            
            await prisma.conversation.create({ data });
          } catch (error) {
            console.error("Failed to save conversation:", error);
          }
        })()
        return finalResponse
      }

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEnd = buffer.indexOf("\n");
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              console.log(content);
              controller.enqueue(content);
              finalResponse += content;
            }
          } catch (e) {
            // Ignore invalid JSON
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};
