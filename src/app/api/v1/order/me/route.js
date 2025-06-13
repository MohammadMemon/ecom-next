import dbConnect from "@/lib/dbConnect";
import { myOrders } from "@/controllers/orderController";
import { NextResponse } from "next/server";

//Auth needed

export async function GET(req) {
  await dbConnect();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];
  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  // Pass token to getUser

  const userId = data.user.id;
  const response = await myOrders(userId);
  if (response.success) {
    return NextResponse.json(response, { status: 201 });
  } else {
    return NextResponse.json(
      {
        success: false,
        message: response.message,
      },
      { status: response.statusCode || 500 }
    );
  }
}
