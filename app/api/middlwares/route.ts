import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/api/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
/**
 * Middleware to verify JWT token from cookies and add userID to request headers.
 * 
 * @param {NextRequest} req - Incoming Next.js request object.
 * @return {Promise<NextResponse>} - NextResponse allowing or denying access.
 */
export const middleware = async (req: NextRequest): Promise<NextResponse> => {
  // Extract JWT token from cookies
  const token = req.cookies.get("jwt_token")?.value;

  // Return 401 if no token present
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token missing", success: false },
      { status: 401 }
    );
  }

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    // Clone request headers and add userID from token payload
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("userID", decoded.id);

    // Continue with request with updated headers
    return NextResponse.next({
      request: { headers: reqHeaders },
    });
  } catch (error) {
    // Log error and respond with 401 if token verification fails
    console.error("JWT verification failed:", error);
    return NextResponse.json(
      { message: "Invalid or expired token", success: false },
      { status: 401 }
    );
  }
};

export const config = {
  matcher: ["/api/aiModel/:path*"], // Middleware runs on /api/aiModel and its subpaths
};
