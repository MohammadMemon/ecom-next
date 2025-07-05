import dbConnect from "@/lib/dbConnect";
import { newOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

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

    const response = await newOrder(body);
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
