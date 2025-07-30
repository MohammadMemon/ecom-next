import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge/lib/next/middleware";

export async function middleware(request) {
  const { pathname } = new URL(request.url);
  console.log("🔥 Middleware triggered for:", pathname);

  // FIRST: Handle API routes with immediate blocking
  if (pathname.startsWith("/api/v1/admin")) {
    console.log("🔒 Intercepting API admin route:", pathname);

    // Check for any authentication (cookie or bearer token)
    const cookieHeader = request.headers.get("cookie");
    const authHeader = request.headers.get("authorization");

    // If no authentication at all, block immediately
    if (!cookieHeader && !authHeader) {
      console.log("❌ BLOCKING: No authentication found");
      return new NextResponse(
        JSON.stringify({ error: "Authentication required", path: pathname }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If bearer token, block for now (you can implement verification later)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      console.log("❌ BLOCKING: Bearer token not supported via middleware");
      return new NextResponse(
        JSON.stringify({
          error:
            "Bearer token authentication not supported. Use cookie-based authentication.",
          path: pathname,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Continue with firebase auth middleware for other routes
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
      console.log("✅ Valid token for:", decodedToken.uid);
      console.log("📍 Path:", pathname);

      // Redirect logged-in users away from auth pages
      if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Admin role checks
      if (pathname.startsWith("/admin") && decodedToken.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (pathname.startsWith("/dashboard") && decodedToken.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      // API admin route protection
      if (
        pathname.startsWith("/api/v1/admin") &&
        decodedToken.role !== "admin"
      ) {
        console.log("❌ API Admin access denied for role:", decodedToken.role);
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 403 }
        );
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

      // Allow access to auth pages when not logged in
      if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup")
      ) {
        return NextResponse.next();
      }

      // Redirect to login for protected routes
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/account")
      ) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      // Block API admin routes for unauthenticated users
      if (pathname.startsWith("/api/v1/admin")) {
        console.log("❌ API Admin access denied - no authentication");
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      return NextResponse.next();
    },

    handleError: async (error) => {
      const { pathname } = new URL(request.url);
      console.log("💥 Middleware error:", error);
      console.log("📍 Error on:", pathname);

      return NextResponse.redirect(new URL("/auth/login", request.url));
    },
  });
}

export const config = {
  matcher: [
    "/api/login",
    "/api/signup",
    "/admin/:path*",
    "/account/:path*",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/signup",
    "/api/v1/admin/:path*",
    "/api/v1/admin",
    "/((?!_next/static|_next/image|favicon.ico).*api/v1/admin.*)",
  ],
};
