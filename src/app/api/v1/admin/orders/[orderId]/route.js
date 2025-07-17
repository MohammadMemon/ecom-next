import dbConnect from "@/lib/dbConnect";
import { deleteOrder, updateOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = await params;
    const { status } = await req.json();

    const result = await updateOrder(orderId, status);

    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;

    const result = await deleteOrder(orderId);

    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
