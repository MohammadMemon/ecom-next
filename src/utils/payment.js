let razorpayKey = null;

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Get Razorpay key (cached)
const getRazorpayKey = async () => {
  if (razorpayKey) return razorpayKey;

  try {
    const response = await fetch("/api/v1/payment/key");
    const data = await response.json();
    razorpayKey = data.key_id;
    return razorpayKey;
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    throw new Error("Failed to load payment configuration");
  }
};

// Calculate order totals using your store's shipping logic
const calculateOrderTotals = (cartStore) => {
  const orderData = cartStore.getOrderData();
  const cartSummary = cartStore.getCartSummary();

  return {
    subtotal: orderData.subtotal,
    shippingCharges: orderData.shipping,
    totalPrice: orderData.total,
    itemsCount: cartSummary.totalItems,
    items: cartStore.items,
  };
};

// Main payment function
export const initiatePayment = async (cartStore, router, options = {}) => {
  const shippingDetails = cartStore.getShippingDetails();

  const user = options.user || null;

  // Determine user identity
  let buyer = null;

  if (user) {
    buyer = {
      id: user.email,
      name: shippingDetails.name?.trim() || user.displayName,
      email: user.email,
      phone: shippingDetails.phone,
      isGuest: false,
    };
  } else {
    buyer = {
      id: `guest_${shippingDetails.email}`,
      name: shippingDetails.name,
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      isGuest: true,
    };
  }

  try {
    const cartSummary = cartStore.getCartSummary();

    // Validate required data
    if (cartSummary.isEmpty) {
      throw new Error("Cart is empty");
    }

    if (!shippingDetails || !shippingDetails.email || !shippingDetails.phone) {
      throw new Error("Shipping details are incomplete");
    }

    // Calculate totals using your store's logic
    const orderTotals = calculateOrderTotals(cartStore);

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load payment gateway");
    }

    // Get Razorpay key
    const keyId = await getRazorpayKey();

    // Create order
    const orderResponse = await fetch("/api/v1/payment/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: orderTotals.totalPrice }),
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      throw new Error(orderData.message || "Failed to create payment order");
    }

    // Initialize Razorpay payment
    return new Promise((resolve, reject) => {
      const razorpayOptions = {
        key: keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: options.businessName || "Cycledaddy",
        description: `Payment for ${orderTotals.itemsCount} items - ₹${orderTotals.totalPrice}`,
        order_id: orderData.data.id,
        handler: async (response) => {
          try {
            const result = await handlePaymentSuccess(
              response,
              buyer,
              {
                items: orderTotals.items,
                shippingDetails,
                orderTotals,
                cartStore,
              },
              router,
              options
            );
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: buyer.name,
          email: buyer.email,
          contact: buyer.phone,
        },
        notes: {
          address: `${shippingDetails.address}, ${shippingDetails.city}`,
          items_count: orderTotals.itemsCount,
        },
        theme: {
          color: options.themeColor,
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw error;
  }
};

// Handle payment success
const handlePaymentSuccess = async (
  paymentResponse,
  buyer,
  orderData,
  router,
  options = {}
) => {
  try {
    // Prepare order items for backend
    const orderItems = orderData.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images[0]?.url || "",
      product: item._id,
      categorySlug: item.categorySlug,
      subCategorySlug: item.subCategorySlug,
      subSubCategorySlug: item.subSubCategorySlug,
    }));

    // Prepare complete order payload for secure backend endpoint
    const orderPayload = {
      // Payment verification data
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,

      // Order data
      user: buyer.isGuest ? null : buyer.id,
      guestUser: buyer.isGuest ? buyer : null,
      shippingInfo: orderData.shippingDetails,
      orderItems: orderItems,
      itemsPrice: orderData.orderTotals.subtotal,
      shippingPrice: orderData.orderTotals.shippingCharges,
      totalPrice: orderData.orderTotals.totalPrice,
      businessName: options.businessName || "Cycledaddy",
    };

    // Send to secure backend endpoint that handles everything atomically
    const secureResponse = await fetch("/api/v1/order/handler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const secureData = await secureResponse.json();

    if (!secureData.success) {
      throw new Error(secureData.message || "Order processing failed");
    }

    orderData.cartStore.completeOrder();

    const paymentInfo = {
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: secureData.data.orderId,
      amount: orderData.orderTotals.totalPrice,
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("lastPayment", JSON.stringify(paymentInfo));

    // Navigate to success page
    router.replace("/order-confirmed");

    return {
      success: true,
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: secureData.data.orderId,
      amount: orderData.orderTotals.totalPrice,
    };
  } catch (error) {
    console.error("Payment success handling error:", error);
    throw error;
  }
};
