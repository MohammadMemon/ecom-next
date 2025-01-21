import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/controllers/productController";

export async function PUT(req, { params }) {
  await dbConnect(); // Ensure DB connection

  const { id } = await params;

  // Check if id is valid
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 400 }
    );
  }

  // Parse the incoming JSON body
  let body;
  try {
    body = await req.json(); // Parse the request body
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { success: false, message: "Invalid body format" },
      { status: 400 }
    );
  }

  // Now call the controller function with the extracted id and body
  const response = await updateProduct(id, body);

  if (response.success) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json(
      { success: false, message: response.message },
      { status: response.statusCode || 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  await dbConnect(); // Ensure DB connection

  const { id } = await params;

  // Check if id is valid
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 400 }
    );
  }

  // Now call the controller function with the extracted id
  const response = await deleteProduct(id);

  if (response.success) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json(
      { success: false, message: response.message },
      { status: response.statusCode || 500 }
    );
  }
}
