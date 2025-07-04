import crypto from "crypto";

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return Response.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return Response.json(
        { success: false, message: "Invalid signature!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
