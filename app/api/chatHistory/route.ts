import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../lib/prisma";

export const POST = async (req: NextRequest) => {
    const { userID, page } = await req.json();

    if (!userID || typeof page !== "number" || page < 1) {
        return NextResponse.json({ error: "Invalid input", success: false }, { status: 400 });
    }

    const chatHistory = await prisma.chat.findMany({
        where: { userID },
        select: {
            chatName: true,
            chatUUID: true
        },
        orderBy:{
            createdAt:"desc"
        },
        skip: (page - 1) * 10,
        take: 10
    });

    return NextResponse.json({ data: chatHistory, success: true });
};
