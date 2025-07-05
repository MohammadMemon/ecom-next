import sendEmail from "@/app/api/v1/emailtest/route";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";

// Create new Order
export const newOrder = async (body) => {
  try {
    // Validate required fields
    if (!body.user && !body.guestUser) {
      return {
        success: false,
        message: "Either user or guestUser is required",
        statusCode: 400,
      };
    }

    let userId;
    if (body.user) {
      userId = body.user;
    } else if (body.guestUser) {
      userId = `guest_${body.guestUser.email}`;
    }

    const order = await Order.create({
      user: userId,
      itemsPrice: body.itemsPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
      orderItems: body.orderItems,
      shippingInfo: body.shippingInfo,
      paymentInfo: body.paymentInfo,
      orderStatus: body.orderStatus || "Processing",
      paidAt: body.paymentInfo?.paidAt || Date.now(),
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
  const order = await Order.findById(id).populate("user", "name email");

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
export const myOrders = async (userId) => {
  const orders = await Order.find({ user: userId });
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
export const updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  const user = await User.findOne({ email: req.body.email });

  await user.save({ validateBeforeSave: false });

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    const message = ` Hey ${user.name} :- \n Your order from Cycledaddy is shipped!\n We hope you're as exceted as we are! \n Your order will reach you in 2-7 Working days depending on your location.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Your order from Cycledaddy is shipped!`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      return next(new ErrorHander(error.message, 500));
    }

    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    const message = ` Hey ${user.name} :- \n We have delivered your order. \n Order Id: ${order.id}.\n We hope you liked our service.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Your order from Cycledaddy is delivered!`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      return next(new ErrorHander(error.message, 500));
    }

    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
export const deleteOrder = async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    return {
      success: false,
      message: "Order not found",
      statusCode: 404,
    };
  }

  await Order.findByIdAndDelete(id);

  return {
    success: true,
  };
};
