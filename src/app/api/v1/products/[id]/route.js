import dbConnect from '@/lib/dbConnect';
import { getProductDetails } from '@/controllers/productController';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
      // Connect to the database
      await dbConnect();
  
      // Extract product ID from params
      const { id } = params;
  
      // Fetch product details
      const result = await getProductDetails(id);
  
      // Return the response
      return NextResponse.json(result, { status: result.statusCode || 200 });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error in Get Product Details route:", error);
      return NextResponse.json(
        { success: false, message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
