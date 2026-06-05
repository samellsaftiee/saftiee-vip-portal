import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Redirect /admin to dashboard if authenticated
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Login page is always public
        if (pathname === "/admin/login") return true;
        // Everything else under /admin requires auth
        if (pathname.startsWith("/admin")) return !!token;
        // API routes under /api/content and /api/upload require auth
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
