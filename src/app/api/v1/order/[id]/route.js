import dbConnect from "@/lib/dbConnect";
import { getSingleOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";
import Order from "@/models/orderModel";
import { adminAuth } from "@/firebase/admin";

export async function GET(req, { params }) {
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
    // Verify the token and extract user email
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const currentUserEmail = decodedToken.email;

    const { id } = await params;

    // Fetch the order first
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if the order belongs to the current user
    if (order.user.userEmail !== currentUserEmail) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You do not own this order" },
        { status: 403 }
      );
    }

    // If valid, proceed to fetch full order data
    const response = await getSingleOrder(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Order access error:", error);
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
