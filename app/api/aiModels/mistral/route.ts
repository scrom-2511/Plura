import { ModelTypes } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { streamModel } from "../../utils/streamModel.utils";

export const POST = async (req: NextRequest) => {
  const { prompt, userID } = await req.json();

  const stream = new ReadableStream({
    start(controller) {
      streamModel(ModelTypes.MISTRAL, controller, prompt, userID, process.env.OPEN_ROUTER_API_KEY2 as string);
    },
  });
  return new NextResponse(stream)
};