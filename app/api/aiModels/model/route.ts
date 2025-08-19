import { main } from "@/aiModels/chatgpt";
import { prisma } from "@/lib/prisma";
import { getSummary } from "@/utils/getSummary";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { chatID, prompt, userID, chatName } = body;

    if (!chatID || !prompt) {
      return NextResponse.json({ error: "Missing required fields: chatID or prompt" }, { status: 400 });
    }

    let gpt, deepseek, llama, grok, mistral;
    try {
      ({ gpt, deepseek, llama, grok, mistral } = await main(prompt));
    } catch (aiError) {
      console.error("AI model error:", aiError);
      return NextResponse.json({ error: "AI model processing failed", success: false }, { status: 500 });
    }

    const resObj = { gpt, deepseek, llama, grok, mistral };

    try {
      await prisma.chatHistory.create({
        data: { gpt, deepseek, llama, grok, mistral, chatID },
      });
    } catch (error) {
      console.error("Database error while creating chatHistory:", error);
      return NextResponse.json({ error: "Failed to store chat history", success: false }, { status: 500 });
    }

    const res = NextResponse.json({ success: true, result: resObj }, { status: 200 });

    (async()=>{
      try {
        const summaries = await getSummary(resObj);
        
        const {
          gpt: gptChatSummary,
          llama: llamaChatSummary,
          grok: grokChatSummary,
          deepseek: deepseekChatSummary,
          mistral: mistralChatSummary
        } = summaries;
  
        await prisma.chat.create({
          data: {
            gptChatSummary,
            llamaChatSummary,
            grokChatSummary,
            deepseekChatSummary,
            mistralChatSummary,
            userID,
            chatUUID: chatID,
            chatName,
          },
        });
      } catch (error) {
        console.error("Error generating or storing chat summary:", error);
      }
    })();

    return res;
  } catch (error) {
    console.error("API Error in chat POST:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 });
  }
};
