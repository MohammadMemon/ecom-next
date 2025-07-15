import dbConnect from "@/lib/dbConnect";
import { myOrders } from "@/controllers/orderController";
import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";

export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    const response = await myOrders(userEmail);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
