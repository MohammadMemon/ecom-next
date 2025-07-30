import { adminAuth } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const idToken = authHeader?.split("Bearer ")[1];

    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    try {
      if (decodedToken.uid === uid) {
        await adminAuth.setCustomUserClaims(uid, { role: "user" });
      }
      console.log("Role set successfully");
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json({
      success: true,
      message: `Role User set for user ${uid}`,
    });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    return NextResponse.json(
      { error: "Failed to set user role" },
      { status: 500 }
    );
  }
}
