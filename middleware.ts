import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: "saftiee2024secret",
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname === "/admin/login") return true;
        if (pathname.startsWith("/admin")) return !!token;
        if (pathname.startsWith("/api/content") || pathname.startsWith("/api/upload")) {
          return !!token;
        }
        return true;
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*", "/api/upload/:path*"],
};
