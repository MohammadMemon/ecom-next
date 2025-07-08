import nodeMailer from "nodemailer";

// Email templates
const emailTemplates = {
  // Customer email templates
  customer: {
    orderConfirmation: (data) => ({
      subject: `Thank you for your order #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0;">Thank You for Your Order!</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Your order has been received and is being processed</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555;">Hello ${data.customerName},</h2>
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Payment ID:</strong> ${data.paymentId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${data.totalPrice}</p>
            </div>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Items Ordered:</h3>
              ${data.items
                .map(
                  (item) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p><strong>${
                    item.name || item.productName || "Item"
                  }</strong></p>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Price: ₹${item.price}</p>
                </div>
              `
                )
                .join("")}
            </div>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Shipping Information:</h3>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              ${
                data.shippingAddress
                  ? `<p><strong>Address:</strong> ${data.shippingAddress}</p>`
                  : ""
              }
            </div>

            <p style="color: #666; margin-top: 30px;">
              You will receive another email when your order is shipped with tracking information.
            </p>
            
            <p style="color: #666;">
              Best regards,<br>
              ${data.businessName}
            </p>
          </div>
        </div>
      `,
      text: `
        Order Confirmation - #${data.orderId}
        
        Hello ${data.customerName},
        
        Thank you for your order! We've received your order and it's being processed.
        
        Order Details:
        - Order ID: ${data.orderId}
        - Payment ID: ${data.paymentId}
        - Order Date: ${new Date().toLocaleDateString()}
        - Total Amount: ₹${data.totalPrice}
        
        Items Ordered:
        ${data.items
          .map(
            (item) =>
              `- ${item.name || item.productName || "Item"} (Qty: ${
                item.quantity
              }) - ₹${item.price}`
          )
          .join("\n")}
        
        You will receive another email when your order is shipped.
        
        Best regards,
        ${data.businessName}
      `,
    }),

    orderShipped: (data) => ({
      subject: `Order Shipped - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Order Shipped! 🚚</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555;">Hello ${data.customerName},</h2>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Shipping Details:</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Shipping Date:</strong> ${new Date().toLocaleDateString()}</p>
              ${
                data.trackingNumber
                  ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>`
                  : ""
              }
              ${
                data.estimatedDelivery
                  ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>`
                  : ""
              }
            </div>

            ${
              data.trackingUrl
                ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.trackingUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Track Your Order
                </a>
              </div>
            `
                : ""
            }

            <p style="color: #666;">
              Thank you for choosing ${data.businessName}!
            </p>
          </div>
        </div>
      `,
      text: `
        Order Shipped - #${data.orderId}
        
        Hello ${data.customerName},
        
        Great news! Your order has been shipped and is on its way to you.
        
        Shipping Details:
        - Order ID: ${data.orderId}
        - Shipping Date: ${new Date().toLocaleDateString()}
        ${
          data.trackingNumber ? `- Tracking Number: ${data.trackingNumber}` : ""
        }
        ${
          data.estimatedDelivery
            ? `- Estimated Delivery: ${data.estimatedDelivery}`
            : ""
        }
        
        ${data.trackingUrl ? `Track your order: ${data.trackingUrl}` : ""}
        
        Thank you for choosing ${data.businessName}!
      `,
    }),

    orderDelivered: (data) => ({
      subject: `Order Delivered - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Order Delivered! ✅</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555;">Hello ${data.customerName},</h2>
            <p>Your order has been successfully delivered!</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Delivered On:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p style="color: #666;">
              We hope you're satisfied with your purchase. If you have any questions or concerns, please don't hesitate to contact us.
            </p>
            
            <p style="color: #666;">
              Thank you for choosing ${data.businessName}!
            </p>
          </div>
        </div>
      `,
      text: `
        Order Delivered - #${data.orderId}
        
        Hello ${data.customerName},
        
        Your order has been successfully delivered!
        
        Order ID: ${data.orderId}
        Delivered On: ${new Date().toLocaleDateString()}
        
        We hope you're satisfied with your purchase.
        
        Thank you for choosing ${data.businessName}!
      `,
    }),

    orderCancelled: (data) => ({
      subject: `Order Cancelled - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Order Cancelled</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555;">Hello ${data.customerName},</h2>
            <p>Your order has been cancelled as requested.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString()}</p>
              ${
                data.reason
                  ? `<p><strong>Reason:</strong> ${data.reason}</p>`
                  : ""
              }
            </div>

            <p style="color: #666;">
              ${
                data.refundInfo ||
                "If you made a payment, the refund will be processed within 5-7 business days."
              }
            </p>
            
            <p style="color: #666;">
              If you have any questions, please contact us.
            </p>
          </div>
        </div>
      `,
      text: `
        Order Cancelled - #${data.orderId}
        
        Hello ${data.customerName},
        
        Your order has been cancelled as requested.
        
        Order ID: ${data.orderId}
        Cancelled On: ${new Date().toLocaleDateString()}
        ${data.reason ? `Reason: ${data.reason}` : ""}
        
        ${
          data.refundInfo ||
          "If you made a payment, the refund will be processed within 5-7 business days."
        }
      `,
    }),
  },

  // Owner/Admin email templates
  owner: {
    newOrder: (data) => ({
      subject: `New Order Received - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">New Order Received! 🎉</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>A new order has been placed and requires processing.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Order Information:</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Payment ID:</strong> ${data.paymentId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${data.totalPrice}</p>
            </div>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Customer Information:</h3>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              ${
                data.customerPhone
                  ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>`
                  : ""
              }
              ${
                data.shippingAddress
                  ? `<p><strong>Shipping Address:</strong> ${data.shippingAddress}</p>`
                  : ""
              }
            </div>

            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333;">Items Ordered:</h3>
              ${data.items
                .map(
                  (item) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p><strong>${
                    item.name || item.productName || "Item"
                  }</strong></p>
                  <p>SKU: ${item.sku || "N/A"}</p>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Price: ₹${item.price}</p>
                </div>
              `
                )
                .join("")}
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;">
                <strong>Action Required:</strong> Please process this order and update the inventory.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Order Received - #${data.orderId}
        
        A new order has been placed and requires processing.
        
        Order Information:
        - Order ID: ${data.orderId}
        - Payment ID: ${data.paymentId}
        - Order Date: ${new Date().toLocaleDateString()}
        - Total Amount: ₹${data.totalPrice}
        
        Customer Information:
        - Name: ${data.customerName}
        - Email: ${data.customerEmail}
        ${data.customerPhone ? `- Phone: ${data.customerPhone}` : ""}
        ${
          data.shippingAddress
            ? `- Shipping Address: ${data.shippingAddress}`
            : ""
        }
        
        Items Ordered:
        ${data.items
          .map(
            (item) =>
              `- ${item.name || item.productName || "Item"} (SKU: ${
                item.sku || "N/A"
              }) - Qty: ${item.quantity} - ₹${item.price}`
          )
          .join("\n")}
        
        ACTION REQUIRED: Please process this order and update the inventory.
      `,
    }),
  },
};

// Create transporter with retry logic and better deliverability settings
function createTransporter() {
  return nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
  });
}

async function sendEmail(options) {
  const transporter = createTransporter();

  try {
    const mailOptions = {
      from: `${process.env.BUSINESS_NAME || "CycleDaddy"} <${
        process.env.SMTP_MAIL
      }>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      headers: {
        "X-Priority": "3",
        "Reply-To": process.env.REPLY_TO_EMAIL || process.env.SMTP_MAIL,
      },

      // Message tracking
      messageId: `<${Date.now()}-${Math.random().toString(36).substr(2, 9)}@${
        process.env.SMTP_DOMAIN || "localhost"
      }>`,
      date: new Date().toISOString(),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to} `);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Email sending failed:`, error.message);
  }
}

// Send notification to customer
async function sendCustomerNotification(type, data) {
  if (!emailTemplates.customer[type]) {
    throw new Error(`Invalid customer notification type: ${type}`);
  }

  const template = emailTemplates.customer[type](data);

  return await sendEmail({
    to: data.customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// Send notification to owner
async function sendOwnerNotification(type, data) {
  if (!emailTemplates.owner[type]) {
    throw new Error(`Invalid owner notification type: ${type}`);
  }

  const template = emailTemplates.owner[type](data);
  const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_MAIL;

  return await sendEmail({
    to: ownerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// Main notification function for new orders
export async function sendOrderNotifications(orderData) {
  const results = {
    customerEmail: { success: false },
    ownerEmail: { success: false },
    errors: [],
  };

  // Validate required data
  const requiredFields = [
    "orderId",
    "customerEmail",
    "customerName",
    "items",
    "totalPrice",
    "businessName",
  ];
  for (const field of requiredFields) {
    if (!orderData[field]) {
      const error = `Missing required field: ${field}`;
      results.errors.push(error);
      console.error(error);
      return results;
    }
  }

  // Send customer confirmation email
  try {
    const customerResult = await sendCustomerNotification(
      "orderConfirmation",
      orderData
    );
    results.customerEmail = customerResult;
  } catch (error) {
    results.errors.push(`Customer email error: ${error.message}`);
    console.error("Customer email error:", error);
  }

  // Send owner notification email
  try {
    const ownerResult = await sendOwnerNotification("newOrder", orderData);
    results.ownerEmail = ownerResult;
  } catch (error) {
    results.errors.push(`Owner email error: ${error.message}`);
    console.error("Owner email error:", error);
  }

  return results;
}

// Send order status update notifications
export async function sendOrderStatusUpdate(status, orderData) {
  const results = {
    customerEmail: { success: false },
    ownerEmail: { success: false },
    errors: [],
  };

  const validStatuses = ["shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    const error = `Invalid status: ${status}. Valid statuses: ${validStatuses.join(
      ", "
    )}`;
    results.errors.push(error);
    return results;
  }

  // Map status to template names
  const statusTemplateMap = {
    shipped: "orderShipped",
    delivered: "orderDelivered",
    cancelled: "orderCancelled",
  };

  try {
    const templateName = statusTemplateMap[status];
    const customerResult = await sendCustomerNotification(
      templateName,
      orderData
    );
    results.customerEmail = customerResult;
  } catch (error) {
    results.errors.push(`Status update email error: ${error.message}`);
    console.error("Status update email error:", error);
  }

  return results;
}

// Backward compatibility function (matches your original function signature)
export default async function sendNotifications(orderData) {
  return await sendOrderNotifications(orderData);
}
