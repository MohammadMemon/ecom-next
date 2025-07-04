export async function GET() {
  return Response.json({
    key_id: process.env.RAZORPAY_KEY_ID,
  });
}
