import dbConnect from '@/lib/dbConnect';
import { getAllProducts } from '@/controllers/productController';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const start = process.hrtime(); // Start high-resolution timer
    try {
      const dbStart = process.hrtime();
    await dbConnect();
    const dbDuration = process.hrtime(dbStart);
    console.log(`DB Connection: ${dbDuration[0] * 1e3 + dbDuration[1] / 1e6}ms`);

    const paramsStart = process.hrtime();
    const searchParams = request.nextUrl.searchParams;
    const queryObject = Object.fromEntries(searchParams.entries());
    const paramsDuration = process.hrtime(paramsStart);
    console.log(`Params Extraction: ${paramsDuration[0] * 1e3 + paramsDuration[1] / 1e6}ms`);

    const controllerStart = process.hrtime();
    const result = await getAllProducts(queryObject);
    const controllerDuration = process.hrtime(controllerStart);
    console.log(`Controller Execution: ${controllerDuration[0] * 1e3 + controllerDuration[1] / 1e6}ms`);
      // If the controller returns an error
      console.time("Returning")
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: result.message
          },
          { status: result.statusCode || 500 }
        );
      }
      console.timeEnd("Returning")
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
    }finally {
      const totalDuration = process.hrtime(start);
      console.log(`Total Request Time: ${totalDuration[0] * 1e3 + totalDuration[1] / 1e6}ms`);
    }
  }
  