import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { createProduct } from "@/controllers/productController";

// Handle POST request for creating a product
export async function POST(req) {
  await dbConnect();
  const response = await createProduct(req);

  // Use NextResponse to send JSON responses
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
