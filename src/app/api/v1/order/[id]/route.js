import dbConnect from "@/lib/dbConnect";
import { getSingleOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  // Extract product ID from params
  const { id } = await params;
  console.log(id);
  const response = await getSingleOrder(id);
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
