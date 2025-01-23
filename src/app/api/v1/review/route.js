import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { createProductReview , getProductReviews, deleteReview} from "@/controllers/productController";
import { createClient } from "@/utils/supabase/server";

export async function PUT(req) {
  try {
    await dbConnect();
    const supabase = await createClient();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    // Pass token to getUser
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Supabase auth error:", error);
      return NextResponse.json(
        { success: false, message: `Authentication error: ${error.message}` },
        { status: 401 }
      );
    }

    const userId = data.user.id;
    console.log(userId);

    let body = await req.json();

    const response = await createProductReview(userId, body);

    return response.success
      ? NextResponse.json(response, { status: 200 })
      : NextResponse.json(
          { success: false, message: response.message },
          { status: response.statusCode || 500 }
        );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  const response = await getProductReviews(productId);

  if (response.success) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json(
      { success: false, message: response.message },
      { status: response.statusCode || 500 }
    );
  }
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")
  const productId = searchParams.get("productId");
  const response = await deleteReview(id,productId);

  if (response.success) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json(
      { success: false, message: response.message },
      { status: response.statusCode || 500 }
    );
  }
}
