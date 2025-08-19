import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    
    if (user?.password != password) {
      return NextResponse.json({ message: "Wrong Credentials", success: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Signin Successful", success: true }, { status: 201 });
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
};
