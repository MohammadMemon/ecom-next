import { adminAuth } from "@/firebase/admin";
import { verifySessionCookie } from "@/lib/authConfig";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return new Response("No session", { status: 401 });
    }

    const claims = await verifySessionCookie(sessionCookie);

    if (!claims) {
      return new Response("Invalid session", { status: 401 });
    }

    return Response.json(claims);
  } catch (error) {
    console.error("Session verification error:", error);
    return new Response("Session error", { status: 500 });
  }
}

export async function POST(request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return new Response("Missing token", { status: 400 });
  }

  const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn / 1000,
      sameSite: "lax",
    });

    return new Response("Session established", { status: 200 });
  } catch (err) {
    console.error("Failed to create session cookie:", err);
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("__session");
    return new Response("Session cleared", { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return new Response("Logout error", { status: 500 });
  }
}
