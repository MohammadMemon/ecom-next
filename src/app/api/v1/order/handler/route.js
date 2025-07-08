import dbConnect from "@/lib/dbConnect";
import { newOrder } from "@/controllers/orderController";
import { updateProductStock } from "@/controllers/productController"; // Assuming this exists
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateOrderId } from "@/utils/generateOrderId";
import { sendOrderNotifications } from "@/utils/orderEmail";

const sendNotifications = async (orderData) => {
  try {
    // Send Email notification
    await sendEmailNotification(orderData);

    // Send WhatsApp confirmation
    await sendWhatsAppNotification(orderData);
  } catch (error) {
    console.error("Notification error:", error);
  }
};

const sendEmailNotification = async (orderData) => {
  await sendOrderNotifications(orderData);
};

const sendWhatsAppNotification = async (orderData) => {};

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      shippingInfo,
      orderItems,
      itemsPrice,
      shippingPrice,
      totalPrice,
      businessName,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification data" },
        { status: 400 }
      );
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order items are required" },
        { status: 400 }
      );
    }

    if (!shippingInfo || !shippingInfo.email || !shippingInfo.phone) {
      return NextResponse.json(
        { success: false, message: "Shipping information is incomplete" },
        { status: 400 }
      );
    }

    // Verify Razorpay payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("Payment signature verification failed");
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const orderId = await generateOrderId();

    const orderPayload = {
      orderId: orderId,
      user: user,
      shippingInfo,
      orderItems: orderItems,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentInfo: {
        id: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        status: "succeeded",
        method: "razorpay",
        paidAt: new Date().toISOString(),
      },
      orderStatus: "Processing",
      createdAt: new Date().toISOString(),
    };

    // Create order in database
    const orderResponse = await newOrder(orderPayload);

    if (!orderResponse.success) {
      console.error("Order creation failed:", orderResponse.message);
      return NextResponse.json(
        { success: false, message: "Order could not be created" },
        { status: 500 }
      );
    }

    const createdOrder = orderResponse.order;

    // Update product stock
    try {
      for (const item of orderItems) {
        await updateProductStock(item.product, item.quantity);
      }
    } catch (stockError) {
      console.error("Stock update error:", stockError);
    }

    // Trigger revalidation for affected products
    try {
      const categoryTags = new Set();

      for (const item of orderItems) {
        revalidateTag(item.product);
        console.log("Revalidated Product Page For :" + item.product);

        if (item.categorySlug) categoryTags.add(item.categorySlug);
        if (item.subCategorySlug) categoryTags.add(item.subCategorySlug);
        if (item.subSubCategorySlug) categoryTags.add(item.subSubCategorySlug);
      }

      for (const tag of categoryTags) {
        revalidateTag(tag);
        console.log("Revalidated tag" + tag);
      }

      // Revalidate general listing
      revalidateTag("products");

      // Revalidate homepage
      revalidatePath("/");
    } catch (revalidationError) {
      console.error("Revalidation error:", revalidationError);
    }

    const shippingAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.pincode} ${shippingInfo.country} `;
    console.log(shippingAddress);
    // Send notifications
    sendNotifications({
      orderId: orderId,
      paymentId: razorpay_payment_id,
      customerEmail: shippingInfo.email,
      customerName: shippingInfo.name,
      customerPhone: shippingInfo.phone,
      shippingAddress: shippingAddress,
      items: orderItems,
      totalPrice,
      businessName,
    });

    // success response
    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: {
          orderId: orderId,
          paymentId: razorpay_payment_id,
          amount: totalPrice,
          status: "confirmed",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error occurred while processing order",
      },
      { status: 500 }
    );
  }
}
