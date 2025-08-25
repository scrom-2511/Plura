import { ModelTypes } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { streamModel } from "../../utils/streamModel.utils";
import { prisma } from "../../lib/prisma";

/**
 * Handles POST request to stream a DEEPSEEK model response.
 *
 * @param {NextRequest} req - Incoming request containing prompt and identifiers.
 * @returns {Promise<NextResponse>} Streamed response from the model.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  // Parse request JSON body and validate inputs
  const { prompt, userID, conversationID, chatID } = await req.json();

  if (
    typeof prompt !== "string" || 
    !prompt.trim() ||
    typeof userID !== "number" ||
    typeof conversationID !== "string" ||
    typeof chatID !== "string"
  ) {
    return new NextResponse("Invalid input parameters", { status: 400 });
  }

  let finalRes = "";

  // Create a readable stream to handle streaming model output
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stream the DEEPSEEK model response with API key #2
        finalRes = (await streamModel(
          ModelTypes.DEEPSEEK,
          controller,
          prompt,
          userID,
          process.env.OPEN_ROUTER_API_KEY2 as string,
          chatID,
          conversationID
        )) as string;
      } catch (error) {
        // Close the stream controller on error
        controller.error(error);
      }
    },
  });

  // Return the streaming response
  return new NextResponse(stream);
};
