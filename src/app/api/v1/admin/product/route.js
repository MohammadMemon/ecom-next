import dbConnect from '@/lib/dbConnect';
import { getAdminProducts } from '@/controllers/productController';
import { NextResponse } from 'next/server';

export async function GET(request) {

    try {
      
    await dbConnect();

    const result = await getAdminProducts();
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
      console.error('Error in admin product route:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error'
        },
        { status: 500 }
      );
    }
  }