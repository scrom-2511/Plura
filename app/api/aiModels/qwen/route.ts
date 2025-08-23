// import { Message, ModelTypes } from "@/types/types";
// import { NextRequest, NextResponse } from "next/server";
// import { streamModel } from "../../utils/streamModel.utils";

// export const POST = async (req: NextRequest) => {
//   const { prompt } = await req.json();

//   // List of models you want to hit
//   const models = [
//     "openai/gpt-4o",
//     "mistralai/mistral-small-3.2-24b-instruct:free",
//     "meta-llama/llama-3.3-70b-instruct:free",
//     "x-ai/grok-2"
//   ];

//   // Start all requests simultaneously
//   const responses = await Promise.all(
//     models.map(async (model) => {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model,
//           messages: [{ role: "user", content: prompt }],
//           stream: true,
//         }),
//       });
//       return { model, stream: response.body?.getReader() };
//     })
//   );

//   // Return a combined stream to frontend
//   const encoder = new TextEncoder();
//   const stream = new ReadableStream({
//     async start(controller) {
//       // Kick off concurrent readers
//       await Promise.all(
//         responses.map(async ({ model, stream }) => {
//           if (!stream) return;
//           while (true) {
//             const { value, done } = await stream.read();
//             if (done) {
//               controller.enqueue(encoder.encode(JSON.stringify({ model, done: true })));
//               break;
//             }
//             controller.enqueue(
//               encoder.encode(JSON.stringify({ model, content: new TextDecoder().decode(value) }))
//             );
//           }
//         })
//       );
//       controller.close();
//     },
//   });

//   return new NextResponse(stream);
// };

import { Message, ModelTypes } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

export const POST = async (req: NextRequest) => {
  const { userID, prompt } = await req.json();
  const client = createClient();
  await client.connect();
  const context = await client.get(userID);
  // const finalContext = await JSON.parse(context!)
  const systemContent = context
    ? `You are an Ai assistant.`
    : "You are an AI assistant";
  console.log(context);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY2}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ModelTypes.QWEN,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 1000,
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
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            const conversation = { prompt, response: finalResponse };
            if (!context) {
              await client.set(userID, JSON.stringify([conversation]));
            } else {
              const existingData: Array<Message> = JSON.parse(context);

              if (existingData.length > 20) {
                existingData.shift();
              }
              existingData.push(conversation);
              await client.set(userID, JSON.stringify(existingData));
            }
            break;
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
      },
    });
    return new NextResponse(stream);
  } catch (e) {
    console.log(e);
  }
};
