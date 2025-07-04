import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount } = await request.json();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
