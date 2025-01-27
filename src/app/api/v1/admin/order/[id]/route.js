import dbConnect from "@/lib/dbConnect";
import { deleteOrder } from "@/controllers/orderController";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract product ID from params
    const { id } = await params;

    // Fetch product details
    const result = await deleteOrder(id);

    // Return the response
    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in  Delete order route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
