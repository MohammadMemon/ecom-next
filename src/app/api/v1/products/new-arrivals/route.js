import dbConnect from "@/lib/dbConnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const result = await Product.find({
      category: { $not: /bike/i },
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(8);

    return NextResponse.json(
      { products: result },
      {
        status: result.statusCode || 200,
        headers: {
          "x-next-cache-tags": "new-arrivals",
        },
      }
    );
  } catch (error) {
    console.error("Error in Get New Arrivals route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
