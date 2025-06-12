import dbConnect from "@/lib/dbConnect";
import { getAllProducts } from "@/controllers/productController";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const queryObject = Object.fromEntries(searchParams.entries());

    const result = await getAllProducts(queryObject);
    // If the controller returns an error
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.statusCode || 500 }
      );
    }
    // Return successful response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "x-next-cache-tags":
          queryObject.subSubCategorySlug ||
          queryObject.subCategorySlug ||
          queryObject.categorySlug ||
          "products",
      },
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in product route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
