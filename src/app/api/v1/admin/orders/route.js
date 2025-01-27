import dbConnect from "@/lib/dbConnect";
import { getAllOrders, myOrders } from "@/controllers/orderController";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const response = await getAllOrders();
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
