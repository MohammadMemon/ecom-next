import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge/lib/next/middleware";

export async function middleware(request) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    cookieName: "AuthToken",
    cookieSignatureKeys: [process.env.COOKIE_SECRET],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 12,
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },

    handleValidToken: async ({ decodedToken }) => {
      const { pathname } = new URL(request.url);

      if (pathname.startsWith("/admin") && decodedToken.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      return NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers.entries()),
            "x-user-uid": decodedToken.uid,
            "x-user-role": decodedToken.role || "user",
          }),
        },
      });
    },

    handleInvalidToken: async (reason) => {
      const { pathname } = new URL(request.url);
      console.log("❌ Invalid token:", reason);
      console.log("📍 Path:", pathname);

      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/account")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return NextResponse.next();
    },

    handleError: async (error) => {
      const { pathname } = new URL(request.url);
      console.log("💥 Middleware error:", error);
      console.log("📍 Error on:", pathname);

      return NextResponse.redirect(new URL("/login", request.url));
    },
  });
}
export const config = {
  matcher: [
    "/api/login",
    "/api/logout",
    "/account/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
