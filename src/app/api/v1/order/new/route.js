import dbConnect from "@/lib/dbConnect";
import { newOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";

//Auth needed

export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    let body;
    try {
      body = await req.json(); // Parse the request body
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { success: false, message: "Invalid body format" },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const userId = data.user.id;

    const response = await newOrder(body, userId);
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
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
