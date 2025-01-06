import dbConnect from '@/lib/dbConnect';
import { getAllProducts } from '@/controllers/productController';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      await dbConnect();
      // Extract search parameters from the URL
      const searchParams = request.nextUrl.searchParams;
      const queryObject = Object.fromEntries(searchParams.entries());
  
      // Call the controller function to get products
      const result = await getAllProducts(queryObject);
  
      // If the controller returns an error
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: result.message
          },
          { status: result.statusCode || 500 }
        );
      }
  
      // Return successful response
      return NextResponse.json(result);
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error in product route:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error'
        },
        { status: 500 }
      );
    }
  }
  

// export async function GET() {
//     try {
//       // Establish the database connection
//       await dbConnect();
  
//       // Fetch products from the collection
//       const products = await Product.find();
  
//       // Return the products in the response
//       return NextResponse.json({ success: true, products });
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       return NextResponse.json(
//         { success: false, message: error.message || "Failed to fetch products" },
//         { status: 500 }
//       );
//     }
//   }
