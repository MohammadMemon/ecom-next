import dbConnect from "@/lib/dbConnect";
import { getProductDetails } from "@/controllers/productController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const result = await getProductDetails(id);

    return NextResponse.json(result, {
      status: result.statusCode || 200,
      headers: {
        "x-next-cache-tags": result.product._id,
      },
    });
  } catch (error) {
    console.error("Error in Get Product Details route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
