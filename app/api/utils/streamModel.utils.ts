import { Message, ModelTypes } from "@/types/types";
import { contextProvider, contextSetter } from "./redisHandler.utils";

export const streamModel = async (model: ModelTypes, controller: ReadableStreamDefaultController, prompt:string, userID:string, apikey:string) => {
  const context = await contextProvider(userID, model);
  const systemContent = context
    ? `You are an Ai assistant.`
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
        controller.enqueue(JSON.stringify({ model, done }));
        const conversation:Message = {prompt, response:finalResponse} 
        await contextSetter(userID, context, model, conversation)
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
              controller.enqueue(JSON.stringify({ model, content }));
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
