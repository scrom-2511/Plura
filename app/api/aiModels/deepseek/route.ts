import { ModelTypes } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { streamModel } from "../../utils/streamModel.utils";
import { prisma } from "../../lib/prisma";

export const POST = async (req: NextRequest) => {
  const { prompt, userID, conversationID, chatID } = await req.json();
  let finalRes:string = ""
  const stream = new ReadableStream({
    async start(controller) {
      finalRes = await streamModel(ModelTypes.DEEPSEEK, controller, prompt, userID, process.env.OPEN_ROUTER_API_KEY2 as string, chatID, conversationID) as string
    },
  });
  const routeRes = new NextResponse(stream);
  
  return routeRes
};