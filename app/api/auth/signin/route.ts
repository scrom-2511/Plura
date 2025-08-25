import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure to set this in your environment variables

/**
 * Handles user sign-in.
 *
 * @param {Request} req - The incoming HTTP request containing user credentials.
 * @return {Promise<NextResponse>} - JSON response indicating sign-in result.
 */
export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    // Parse and validate input
    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // Verify credentials
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Wrong Credentials", success: false },
        { status: 400 }
      );
    }

    // Generate JWT payload and sign token
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    // Create response
    const response = NextResponse.json(
      { message: "Signin Successful", success: true },
      { status: 201 }
    );

    // Set cookie with token
    response.cookies.set({
      name: "jwt_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    // Handle server errors
    console.error("Signin Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
