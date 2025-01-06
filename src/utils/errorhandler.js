import ErrorHander from "@/utils/ErrorHander";

export async function GET() {
  try {
    // Logic...
    throw new ErrorHander("Resource not found", 404);
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal Server Error",
      }),
      { status: error.statusCode || 500 }
    );
  }
}
