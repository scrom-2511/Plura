import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/api/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const COOKIE_NAME = "token";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Authentication token missing", success: false }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("userID", decoded.id);
    return NextResponse.next({ request: { headers: reqHeaders } });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/aiModel/:path*"],
};
