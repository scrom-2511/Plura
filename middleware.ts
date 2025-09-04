import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware (){
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({token, req}) => {
        const {pathname} = req.nextUrl;

        if(pathname === "signup"){
          return true
        }

        if(pathname === "/chat/newChat"){
          return true
        }

        return !!true

      }
    }
  }
)

export const config = {
  matcher: ["/chat/:path*", "/dashboard/:path*"],
};
