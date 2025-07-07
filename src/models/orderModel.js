import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
  },
  user: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    isGuest: { type: Boolean, required: true },
  },
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
    pincode: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      categorySlug: {
        type: String,
        required: true,
      },
      subCategorySlug: {
        type: String,
        required: true,
      },
      subSubCategorySlug: {
        type: String,
        required: false,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
      default: "razorpay",
    },
    paidAt: {
      type: Date,
      required: true,
    },
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "paymentInfo.id": 1 });

orderSchema.methods.isGuestOrder = function () {
  return this.user.startsWith("guest_");
};

let Order;

if (mongoose.models.Order) {
  Order = mongoose.models.Order;
} else {
  Order = mongoose.model("Order", orderSchema, "orders");
}

export default Order;
