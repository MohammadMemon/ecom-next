import dbConnect from "@/lib/dbConnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const productIds = body.productIds;

    const stockData = await Product.find(
      { _id: { $in: productIds } },
      { _id: 1, stock: 1 }
    );

    return NextResponse.json(stockData, { status: 200 });
  } catch (error) {
    console.error("Error in product stock route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
