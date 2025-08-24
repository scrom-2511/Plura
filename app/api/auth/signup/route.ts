import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export const POST = async (req: Request) => {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await prisma.user.create({
      data: { email, username, password },
    });

    return NextResponse.json(
      { message: "Signup Successful", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
