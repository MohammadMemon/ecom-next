import Order from "@/models/orderModel";
import { sendOrderStatusUpdate } from "@/utils/orderEmail";

// Create new Order
export const newOrder = async (body) => {
  try {
    // Validate required fields
    if (
      !body.user ||
      !body.user.userId ||
      !body.user.userEmail ||
      typeof body.user.isGuest !== "boolean"
    ) {
      return {
        success: false,
        message: "Incomplete or invalid user information",
        statusCode: 400,
      };
    }

    // Create the order
    const order = await Order.create({
      orderId: body.orderId,
      user: {
        userId: body.user.userId,
        userEmail: body.user.userEmail,
        isGuest: body.user.isGuest,
      },
      shippingInfo: body.shippingInfo,
      orderItems: body.orderItems,
      itemsPrice: body.itemsPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
      paymentInfo: {
        id: body.paymentInfo.id,
        orderId: body.paymentInfo.orderId,
        signature: body.paymentInfo.signature,
        status: body.paymentInfo.status,
        method: body.paymentInfo.method,
        paidAt: body.paymentInfo.paidAt || new Date().toISOString(),
      },
      orderStatus: body.orderStatus || "Confirmed",
      createdAt: new Date(body.createdAt).toISOString(),
    });

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Error in New Order controller:", error);

    return {
      success: false,
      message: error.message || "Failed to create newOrder",
      statusCode: 500,
    };
  }
};

// get Single Order
export const getSingleOrder = async (id) => {
  const order = await Order.findOne({ orderId: id });

  if (!order) {
    return {
      success: false,
      message: "Order not found",
      statusCode: 404,
    };
  }

  return {
    success: true,
    order,
  };
};

// get logged in user Orders
export const myOrders = async (userEmail) => {
  const orders = await Order.find({ "user.userEmail": userEmail });
  return {
    success: true,
    orders,
  };
};

// get all Orders -- Admin
export const getAllOrders = async () => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  return {
    success: true,
    totalAmount,
    orders,
  };
};

// update Order Status -- Admin
export const updateOrder = async (orderId, status) => {
  const order = await Order.findOne({ orderId });

  if (!order) {
    return {
      success: false,
      message: "Order not found with this ID",
      statusCode: 404,
    };
  }

  if (order.orderStatus === "Delivered") {
    return {
      success: false,
      message: "This order has already been delivered",
      statusCode: 400,
    };
  }

  const validStatuses = ["Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message: "Invalid order status",
      statusCode: 400,
    };
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  const emailResult = await sendOrderStatusUpdate(status.toLowerCase(), {
    orderId: order.orderId,
    customerName: order.shippingInfo.name,
    customerEmail: order.user.userEmail,
    items: order.orderItems,
    totalPrice: order.totalPrice,
  });

  return {
    success: true,
    message: `Order status updated to ${status}`,
    emailResult,
  };
};

export const deleteOrder = async (orderId) => {
  const order = await Order.findOne({ orderId });

  if (!order) {
    return {
      success: false,
      message: "Order not found",
      statusCode: 404,
    };
  }

  await order.deleteOne();

  return {
    success: true,
    message: "Order deleted successfully",
    statusCode: 200,
  };
};
